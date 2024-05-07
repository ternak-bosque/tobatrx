import Phaser from 'phaser'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'
import StorageKeys from '../consts/StorageKeys'
import { getValue, initTron } from '../service-tron'
import { initWeb3 } from '../web3-logic'
import { assets } from '../consts/Assets'
import { ImageButton } from './ImageButton'

export default class GameStart extends Phaser.Scene {
	constructor() {
		super(SceneKeys.GameStart)
	}

	preload() {
		this.load.image("btnBaseLong", assets.btnBaseLong)
		this.load.image("btnTextPlay", assets.btnTextPlay)
		this.load.image("btnTextProfile", assets.btnTextProfile)
		this.load.image("btnDino", assets.btnDino)

		this.load.rexAwait(async function(successCallback, failureCallback) { 
			await initWeb3();
			successCallback();
		});
	}

	create() {
		this.add.tileSprite(0, 0, this.scale.width, this.scale.height, TextureKeys.Background)
			.setOrigin(0)
			.setScrollFactor(0)

		const fullscreen = this.add.image(60, 50, "fullscreen").setScale(0.25).setInteractive()
		fullscreen.on("pointerdown", () => {
			if(!this.scale.isFullscreen){
				this.scale.startFullscreen();
			}
			else {
				this.scale.stopFullscreen();
			}
		})

		const { width, height } = this.scale
		const x = width * 0.5
		const y = height * 0.7
		
		const currentProfile = getValue(StorageKeys.CurrentProfile)
		if (currentProfile) {
			const dino = this.add.image(width*0.95, 60, "btnDino").setScale(0.5).setInteractive({ useHandCursor: true })
			dino.on('pointerup', () => this.openExternalLink(currentProfile.address, currentProfile.tokenId), this);
		}	

		const logo = this.add.image(width*0.5, height*0.2, 'text-logo')
		logo.preFX.setPadding(32);
        const fx = logo.preFX.addGlow(0xDBB600, 4, 2);
        this.tweens.add({
            targets: fx,
            outerStrength: 10,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });

		// Play Button
		const btnPlay = new ImageButton(this, x, y, 'btnBaseLong', 'btnTextPlay', () => {
			this.scene.start(SceneKeys.Game);
		})
		this.add.existing(btnPlay);

		// Profile Button
		const walletAddress = getValue(StorageKeys.WalletAddress)
		if (walletAddress !== null) {
			const btnProfile = new ImageButton(this, x, height*0.85, 'btnBaseLong', 'btnTextProfile', async () => {
				if (walletAddress === "not_connected") {
					const response = await initTron();
					if (response !== null) {
						this.scene.start(SceneKeys.GameConnect)
					}
				}
				else {
					this.scene.start(SceneKeys.GameConnect)
				}
			})
			this.add.existing(btnProfile)
		}
	}

	openExternalLink (collectionAddress, tokenId) {
        const url = `https://tobaontron.xyz/token/${collectionAddress}_${tokenId}`;
        const s = window.open(url, '_blank');

        if (s && s.focus)
        {
            s.focus();
        }
        else if (!s)
        {
            window.location.href = url;
        }
    }
}
