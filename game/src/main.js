import Phaser from 'phaser'
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js'

import GameScene from './irunner/GameScene'
import PreloadGame from './irunner/Preloader'
import GameOver from './irunner/GameOver'
import GameStart from './irunner/GameStart'
import GameConnect from './irunner/GameConnect'
import ProfileMint from './irunner/ProfileMint'

//"phaser": "^3.80.1"


const config = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: 'game-container',
		width: 1200,
		height: 640
	},
	backgroundColor: 0x444444,
	physics: {
		default: 'arcade'
	},
	scene: [PreloadGame, GameStart, GameScene, GameOver, GameConnect, ProfileMint],
	plugins: {
        global: [{
            key: 'rexAwaitLoader',
            plugin: AwaitLoaderPlugin,
            start: true
        }]
    }
}

export default new Phaser.Game(config)
