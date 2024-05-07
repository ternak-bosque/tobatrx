import Phaser from 'phaser'
import SceneKeys from '../consts/SceneKeys'
import { TextButton } from './TextButton'
import { powerUpsTokens } from '../consts/NftData'
import { assets } from '../consts/Assets'
import { ImageButton, TextImageTile } from './ImageButton'
import { generatePowerUps } from '../web3-logic'
import { getValue } from '../service-tron'
import StorageKeys from '../consts/StorageKeys'

export default class GameOver extends Phaser.Scene {
    //private againButton!: Phaser.GameObjects.Text
    //private finishButton!: Phaser.GameObjects.Text

	constructor()
	{
		super(SceneKeys.GameOver)
		this.isProcesing = false
	}

	preload() {
		this.load.image("btnBaseLong", assets.btnBaseLong)
		this.load.image("btnBaseShort", assets.btnBaseShort)
		this.load.image("btnTextRetry", assets.btnTextRetry)
		this.load.image("btnTextExit", assets.btnTextExit)

		this.load.image("tilePowCoins1", assets.tilePowCoins1)
		this.load.image("tilePowCoins2", assets.tilePowCoins2)
		this.load.image("tilePowForce1", assets.tilePowForce1)
		this.load.image("tilePowForce2", assets.tilePowForce2)
		this.load.image("tilePowJump1", assets.tilePowJump1)
		this.load.image("tilePowJump2", assets.tilePowJump2)
		this.load.image("tilePowLives1", assets.tilePowLives1)
		this.load.image("tilePowLives2", assets.tilePowLives2)
	}

	create()
	{
        const { width, height } = this.scale

		const textStyle = {
            fontFamily: 'Monospace, Times, serif',
			fontSize: '24px',
			color: '#FFFFFF',
			backgroundColor: '#F06292',
			shadow: { fill: true, blur: 0, offsetY: 0 },
			padding: { left: 15, right: 15, top: 10, bottom: 10 }
		};

		// minting message
		const waitText = new TextButton(
            this,
            width * 0.5,
            height * 0.16,
            "🕓 Minting Rewards, wait a moment please...",
            { ...textStyle, backgroundColor: "#666292" },
            () => {}
        ).setOrigin(0.5);

        const lastScore = window.localStorage.getItem("lastScore") || "{}" ;
		const data = JSON.parse(lastScore);
		const txt = new TextImageTile(this, width*0.5, height*0.3, 'btnBaseLong', `Score: ${data.coins + data.distance}`, () => {})
        this.add.existing(txt)

		// Power-Up unlocked
		const newPowerUps = this.getPowerUps(data)
		newPowerUps.forEach((el, i) => {
			//this.add.text(width*0.5, height*(0.4+0.1*i), `Power-Up Unlocked: ${el.title}`, textStyle).setOrigin(0.5)
			this.add.image(width*0.5, height*(0.4+0.1*i), el.tile).setScale(0.6)
		});

		// Retry button
		const btnRetry = new ImageButton(this, width*0.62, height*0.9, 'btnBaseShort', 'btnTextRetry', async () => {
			// mint if needed...
			if (newPowerUps.length > 0) {
				if (this.isProcesing) return;

				this.isProcesing = true;
				this.add.existing(waitText)
				await generatePowerUps(newPowerUps)
				this.isProcesing = false;
			}
			this.scene.stop(SceneKeys.GameOver)
		    this.scene.stop(SceneKeys.Game)
            this.scene.start(SceneKeys.Game) 
		})
		this.add.existing(btnRetry);

		// Main menu button
		const btnExit = new ImageButton(this, width*0.38, height*0.9, 'btnBaseShort', 'btnTextExit', async () => {
			// mint if needed...
			if (newPowerUps.length > 0) {
				if (this.isProcesing) return;

				this.isProcesing = true;
				this.add.existing(waitText)
				await generatePowerUps(newPowerUps)
				this.isProcesing = false;
			}
			this.scene.stop(SceneKeys.GameOver)
            this.scene.stop(SceneKeys.Game)
            this.scene.start(SceneKeys.GameStart) 
		})
		this.add.existing(btnExit);
	}

	getPowerUps(data) {
		data.score = data.coins + data.distance;
		const prizes = powerUpsTokens.sort((a,b) => a.value - b.value).filter(o => data[o.unlock.prop] >= o.unlock.goal)

		const getUniques = (arr, prop) => {
			const group = {};
			arr.forEach(el => {
				group[el[prop]] = el
			});
			return group;
		}

		const uniquePrizes = getUniques(prizes, "type") // one prize for each type
		const newPowers = Object.keys(uniquePrizes).map(key => uniquePrizes[key])

		// check if the user already have this power-ups to not include them
		const currentPowerUps = getValue(StorageKeys.Powers) || []
		const oldPowers = new Set(currentPowerUps.map(o => {
			const metadata = o.metadata || {}
			return metadata.name
		}))
		const result = newPowers.filter(({ title }) => !oldPowers.has(title));

		return result
	}
}
