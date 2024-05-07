import Phaser from 'phaser'
import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
import { getValue } from '../service-tron';
import StorageKeys from '../consts/StorageKeys';
import { getUpdatedPowerUpValues } from '../web3-logic';

let game = {
    config: {
        type: Phaser.AUTO,
        width: 1334,
        height: 730,
        backgroundColor: 0x444444,
        physics: {
            default: "arcade"
        }
    }
};
 
// global game options
let gameOptions = {
 
    // platform speed range, in pixels per second
    platformSpeedRange: [300, 300],
 
    // mountain speed, in pixels per second
    mountainSpeed: 5.5,
 
    // spawn range, how far should be the rightmost platform from the right edge
    // before next platform spawns, in pixels
    spawnRange: [80, 300],
 
    // platform width range, in pixels
    platformSizeRange: [90, 300],
 
    // a height range between rightmost platform and next platform to be spawned
    platformHeightRange: [-5, 5],
 
    // a scale to be multiplied by platformHeightRange
    platformHeighScale: 20,
 
    // platform max and min height, as screen height ratio
    platformVerticalLimit: [0.4, 0.8],
 
    // player gravity
    playerGravity: 900,
 
    // player jump force
    jumpForce: 400,
 
    // player starting X position
    playerStartPosition: 200,
 
    // consecutive jumps allowed
    jumps: 2,
 
    // % of probability a coin appears on the platform
    coinPercent: 20,
 
    // % of probability a fire appears on the platform
    firePercent: 30
}

// PowerUps: JumpForce[500, 700] JumpQty[3,4] moreCoins[33%, 40%] extraLives[1, 2] 

export default class GameScene extends Phaser.Scene{
    constructor(){
        super(SceneKeys.Game);

        // this.platformGroup = null
        // this.platformPool = null
        // this.player = null
        // this.background = null

        // this.coinGroup = null
        // this.fireGroup = null
        // this.coinPool = null
        // this.firePool = null
        // this.platformCollider = null
        
        this.scoreLabel = null
        this.didLost = false
        this.lives = 1
        this.scorePace = 10
        this.score = 0
        this.distance = 0
        this.dying = false
        this.nextPlatformDistance = 0
        this.playerJumps = 0
        this.bgmovement = 0
        this.addedPlatforms = 0
    }
    create(){
        const that = this;
        this.lives = 1;
        this.distance = 0;
        this.score = 0;
        this.didLost = false

        this.physics.world.fixedStep = false // remove game jitter
 
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, TextureKeys.Background)
			.setOrigin(0)
			.setScrollFactor(0)
 
        // group with all active platforms.
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });
 
        // platform pool
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });
 
        // group with all active coins.
        this.coinGroup = this.add.group({
            // once a coin is removed, it's added to the pool
            removeCallback: function(coin){
                coin.scene.coinPool.add(coin)
            }
        });
 
        // coin pool
        this.coinPool = this.add.group({
            // once a coin is removed from the pool, it's added to the active coins group
            removeCallback: function(coin){
                coin.scene.coinGroup.add(coin)
            }
        });
 
        // group with all active firecamps.
        this.fireGroup = this.add.group({
            // once a firecamp is removed, it's added to the pool
            removeCallback: function(fire){
                fire.scene.firePool.add(fire)
            }
        });
 
        // fire pool
        this.firePool = this.add.group({
            // once a fire is removed from the pool, it's added to the active fire group
            removeCallback: function(fire){
                fire.scene.fireGroup.add(fire)
            }
        });

 
        // keeping track of added platforms
        this.addedPlatforms = 0;
 
        // number of consecutive jumps made by the player so far
        this.playerJumps = 0;
 
        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * gameOptions.platformVerticalLimit[1]);
 
        // adding the player;
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height * 0.7, TextureKeys.Player);
        //this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height * 0.3, "player0");
        this.player.setGravityY(gameOptions.playerGravity);
        this.player.setDepth(2);
        //this.player.setScale(0.4)
 
        // the player is not dying
        this.dying = false;
 
        // setting collisions between the player and the platform group
        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function(){
            // play "run" animation if the player is on a platform
            if(!that.player.anims.isPlaying) {
                that.player.anims.play("run");
                //that.player.anims.play("player0-run");
            }
        }, null, this);
 
        // setting collisions between the player and the coin group
        this.physics.add.overlap(this.player, this.coinGroup, function(player, coin){
 
            that.tweens.add({
                targets: coin,
                y: coin.y - 100,
                alpha: 0,
                duration: 800,
                ease: "Cubic.easeOut",
                callbackScope: that,
                onComplete: function(){
                    that.coinGroup.killAndHide(coin);
                    that.coinGroup.remove(coin);
                }
            });

            that.score += that.scorePace;
 
        }, null, this);
 
        // setting collisions between the player and the fire group
        this.physics.add.overlap(this.player, this.fireGroup, function(player, fire) {
            that.dying = true;
            that.player.anims.stop();
            that.player.setFrame(9);
            //that.player.setFrame("Running_007");
            //that.player.setAngle(-60);
            that.player.body.setVelocityY(-200);
            that.physics.world.removeCollider(that.platformCollider);
 
        }, null, this);
 
        // checking for input
        this.input.on("pointerdown", this.jump, this);

        // Game Progress
        this.scoreLabel = this.add.text(0, -3,  "", {
            align: "right",
            fontFamily: 'Arial, Times, serif',
			fontSize: '28px',
			color: '#FFFFFF',
            strokeThickness: 2,
            shadowOffsetX: 1,
            shadowColor: '#000',
		})
		.setOrigin(0.5, 0.5);

        const bg = this.add.image(0, 0, 'btnBaseXL');
        const container = this.add.container(
            this.scale.width*0.80, 30, 
            [bg, this.scoreLabel]
        ).setSize(bg.width, bg.height)

        // powerUps
        const powerUps = getValue(StorageKeys.Powers) || []
		const uniqueTypes = [...new Set(powerUps.map(o => o.metadata.attributes[0].value))]
		uniqueTypes.forEach((el, i) => {
			const type = el; //el.metadata.attributes[0].value;
			const iconTexture = 
				type === "jump" ? "btnPowJump" : 
				type === "force" ? "btnPowForce":
				type === "lives" ? "btnPowLives": "btnPowCoins";

				this.add.image(50+(70*i), 45, iconTexture).setScale(0.5)
		})

        const pwr = getUpdatedPowerUpValues()
        gameOptions.jumpForce = pwr.force
        gameOptions.jumps = pwr.jump
        gameOptions.coinPercent = pwr.coins
 
        // full screen on enter
        this.input.keyboard.on("keydown-ENTER", function(){
            if(!that.scale.isFullscreen){
                that.scale.startFullscreen();
            }
        }, this);
    }
 
    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth = 0, posX = 0, posY = 0){
        this.addedPlatforms ++;
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio =  platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, TextureKeys.Platform);
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
 
        // if this is not the starting platform...
        if(this.addedPlatforms > 1){
 
            // is there a coin over the platform?
            if(Phaser.Math.Between(1, 100) <= gameOptions.coinPercent){
                if(this.coinPool.getLength()){
                    let coin = this.coinPool.getFirst();
                    coin.x = posX;
                    coin.y = posY - 96;
                    coin.alpha = 1;
                    coin.active = true;
                    coin.visible = true;
                    this.coinPool.remove(coin);
                }
                else{
                    let coin = this.physics.add.sprite(posX, posY - 96, "coin");
                    coin.setImmovable(true);
                    coin.setVelocityX(platform.body.velocity.x);
                    coin.anims.play("rotate");
                    coin.setDepth(2);
                    this.coinGroup.add(coin);
                }
            }
 
            // is there a fire over the platform?
            if(Phaser.Math.Between(1, 100) <= gameOptions.firePercent){
                if(this.firePool.getLength()){
                    let fire = this.firePool.getFirst();
                    fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                    fire.y = posY - 46;
                    fire.alpha = 1;
                    fire.active = true;
                    fire.visible = true;
                    this.firePool.remove(fire);
                }
                else{
                    let fire = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, TextureKeys.Enemy);
                    fire.setImmovable(true);
                    fire.setVelocityX(platform.body.velocity.x);
                    fire.setSize(8, 2, true)
                    fire.anims.play("move");
                    fire.setDepth(2);
                    this.fireGroup.add(fire);
                }
            }
        }
    }
 
    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    // and obviously if the player is not dying
    jump(){
        if((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))){
            if(this.player.body.touching.down){
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps ++;
 
            // stops animation
            this.player.anims.stop();
            //this.player.setFrame("Running_009");
        }
    }

    handleLost() {
        if (this.didLost) return; // to execute only once while update
        const lastScore = { coins: this.score, distance: this.distance }
        window.localStorage.setItem("lastScore", JSON.stringify(lastScore))
        this.coinGroup.clear()
        this.coinPool.clear()
        //this.scene.pause(SceneKeys.Game)
        this.scene.run(SceneKeys.GameOver)
        this.lives--
        this.didLost = true
    }
 
    update(){
        const that = this
 
        // game over
        if(this.player.y > game.config.height){
            this.handleLost()
        }
        else {
            ++this.distance;
        }

        this.scoreLabel.text = `❤️ ${this.lives}   🪙 ${this.score}   🏃🏽 ${this.distance}`
 
        this.player.x = gameOptions.playerStartPosition;
        this.bgmovement += gameOptions.mountainSpeed;
        this.background.setTilePosition(this.bgmovement);

 
        // recycling platforms
        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                that.platformGroup.killAndHide(platform);
                that.platformGroup.remove(platform);
            }
        }, this);
 
        // recycling coins
        this.coinGroup.getChildren().forEach(function(coin){
            if(coin.x < - coin.displayWidth / 2){
                that.coinGroup.killAndHide(coin);
                that.coinGroup.remove(coin);
            }
        }, this);
 
        // recycling fire
        this.fireGroup.getChildren().forEach(function(fire){
            if(fire.x < - fire.displayWidth / 2){
                that.fireGroup.killAndHide(fire);
                that.fireGroup.remove(fire);
            }
        }, this);
 
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
            //this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, game.config.height * gameOptions.platformVerticalLimit[1]);
        }
    }
};