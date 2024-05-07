import Phaser from 'phaser'
import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
import { assets } from '../consts/Assets';

export default class PreloadGame extends Phaser.Scene {
    constructor(){
        super(SceneKeys.Preloader);
    }
    preload(){
        this.load.image("text-logo", assets.logo); // es.cooltext.com/
        this.load.image("fullscreen", assets.fullscreen);
        this.load.image("btnBaseXL", assets.btnBaseXL);
        this.load.image(TextureKeys.Background, assets.background);
        this.load.image(TextureKeys.Platform, assets.platform);

        this.load.image("btnPowCoins", assets.btnPowCoins)
		this.load.image("btnPowForce", assets.btnPowForce)
		this.load.image("btnPowLives", assets.btnPowLives)
		this.load.image("btnPowJump", assets.btnPowJump)
 
        this.load.spritesheet(TextureKeys.Player, assets.player, {
            frameWidth: 80,
            frameHeight: 70
        });
 
        this.load.spritesheet(TextureKeys.Coin, assets.coin, {
            frameWidth: 30,
            frameHeight: 30
        });
 
        // the firecamp is a sprite sheet made by 32x58 pixels
        this.load.spritesheet(TextureKeys.Enemy, assets.enemy, {
            frameWidth: 60,
            frameHeight: 70
        });

        //this.load.atlas("player0", "/assets/test/player0.png", "/assets/test/player0.json");
 
    }
    create(){
 
        // setting player animation
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers(TextureKeys.Player, {
                start: 0,
                end: 7
            }),
            frameRate: 20,
            repeat: -1
        });
 
        // setting coin animation
        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers(TextureKeys.Coin, {
                start: 0,
                end: 5
            }),
            frameRate: 15,
            yoyo: true,
            repeat: -1,
            skipMissedFrames: true,
            showBeforeDelay: false
        });
 
        // setting enemy animation
        this.anims.create({
            key: "move",
            frames: this.anims.generateFrameNumbers(TextureKeys.Enemy, {
                start: 0,
                end: 4
            }),
            frameRate: 8,
            repeat: -1,
            skipMissedFrames: true,
            showBeforeDelay: false
        });

        // alt player
        // this.anims.create({
        //     "key": "player0-run",
        //     "type": "frame",
        //     "frames": [
        //         {
        //             "key": "player0",
        //             "frame": "Running_000",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_001",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_002",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_003",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_004",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_005",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_006",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_007",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_008",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_009",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_010",
        //             "duration": 0,
        //             "keyframe": false
        //         },
        //         {
        //             "key": "player0",
        //             "frame": "Running_011",
        //             "duration": 0,
        //             "keyframe": false
        //         }
        //     ],
        //     "frameRate": 30,
        //     "skipMissedFrames": true,
        //     "repeat": -1,
        //     "showBeforeDelay": false
        // });
 
        this.scene.start(SceneKeys.GameStart);
    }
}