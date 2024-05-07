import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import StorageKeys from "../consts/StorageKeys";
import { TextButton } from "./TextButton";
import { delay, getValue, mintPowerUp } from "../service-tron";
import { switchProfile, generateProfileNFT } from "../web3-logic";
import { assets } from "../consts/Assets";
import { ImageButton, TextImageTile } from "./ImageButton";
import { powerUpsTokens } from "../consts/NftData";

// https://gameplaycoder.com/creating-buttons-using-the-user-components-in-phaser-editor-v3/
// https://codepen.io/rexrainbow/pen/YMyBom
export default class GameConnect extends Phaser.Scene {
    //private startButton!: Phaser.GameObjects.Text

    constructor() {
        super(SceneKeys.GameConnect);
        this.isProcesing = false
    }

    preload() {
        this.load.image("btnBaseShort", assets.btnBaseShort)
		this.load.image("btnTextBack", assets.btnTextBack)

        this.load.image("btnBase2XL", assets.btnBase2XL)
    }

    create() {
        this.add
            .tileSprite(
                0,
                0,
                this.scale.width,
                this.scale.height,
                TextureKeys.Background
            )
            .setOrigin(0)
            .setScrollFactor(0);

        const { width, height } = this.scale;
        const x = width * 0.5;
        const y = height * 0.85;

        const buttonStyle = {
            fontFamily: "Monospace, Times, serif",
            fontSize: "32px",
            color: "#FFFFFF",
            backgroundColor: "#000000",
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 15, right: 15, top: 10, bottom: 10 },
        };

        // Retry button
		const btnBack = new ImageButton(this, x, y, 'btnBaseShort', 'btnTextBack', () => {
			this.scene.start(SceneKeys.GameStart); 
		})
		this.add.existing(btnBack);

        this.waitButton = new TextButton(
            this,
            width * 0.5,
            height * 0.2,
            "🕓 Loading, wait a moment please...",
            { ...buttonStyle, backgroundColor: "#666292" },
            () => {}
        ).setOrigin(0.5);

        const profiles = getValue(StorageKeys.Profiles) || [];
        const currentTokenId = getValue(StorageKeys.CurrentTokenId) || null;
        console.log(profiles);

        if (profiles.length > 0) {
            const header = new TextImageTile(
                this, width * 0.5, height * 0.2, 'btnBase2XL', "Please select a Profile!", () => {}
            )
            this.add.existing(header)

            let that = this;
            profiles.forEach((el, i) => {
                const text = el.tokenId == currentTokenId ? 
                    `✅ ${el.metadata.name}: ${el.metadata.attributes[0].value}`:
                    `${el.metadata.name}: ${el.metadata.attributes[0].value}`;

                const btn = new TextImageTile(
                    this, 
                    width * 0.5, 
                    height * (0.3 + 0.1 * i), 
                    'btnBase2XL', 
                    text, 
                    async () => {
                        if (that.isProcesing) return;

                        that.isProcesing = true;
                        this.add.existing(this.waitButton);
                        await switchProfile(el.tokenId);

                        that.isProcesing = false;
                        this.scene.start(SceneKeys.GameStart);
                    }, 
                    {
                        fontSize: '30px'
                    }
                )
                this.add.existing(btn)
            });

            // const _btn = new TextButton(this, width*0.5, height*0.5, 'Mint PowerUp', {...buttonStyle, backgroundColor: '#4498FF'},
            //     async () => {
            //         const data = powerUpsTokens[4]
            //         const tbaAddress = getValue(StorageKeys.TokenBoundAddress)
            //         this.add.existing(this.waitButton);
            //         const r = await mintPowerUp(tbaAddress, data)
            //         console.log(r)
            //         this.scene.start(SceneKeys.GameStart)
            //     }
            // ).setOrigin(0.5);
            // this.add.existing(_btn);
        } else {
            // mint new profile
            let that = this;
            const btn1 = new TextImageTile(this, width * 0.5, height * 0.3, 'btnBaseShort', "Mint Profile", async () => {
                if (that.isProcesing) return;

                that.isProcesing = true;
                this.add.existing(this.waitButton);
                await generateProfileNFT();

                that.isProcesing = false;
                this.scene.start(SceneKeys.GameStart);
            })
            this.add.existing(btn1);
        }
    }

    openExternalLink (collectionAddress, tokenId) {
        // 	button.on('pointerup', () => this.openExternalLink(currentProfile.address, currentProfile.tokenId), this);	
        const url = `http://localhost:3000/token/${collectionAddress}_${tokenId}`;
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
