import Phaser from "phaser";

export class ImageButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, bgTexture, textTexture, callback) {
        super(scene, x, y);

        const bg = scene.add.image(0,0,bgTexture);
        const text = scene.add.image(0,0,textTexture);
        this.add([bg, text])

        this.bg = bg;
        this.setSize(bg.width, bg.height);
        this.setScale(0.8);

        this.setInteractive({ useHandCursor: true })
            .on("pointerover", () => this.enterButtonHoverState())
            .on("pointerout", () => this.enterButtonRestState())
            .on("pointerdown", () => this.enterButtonActiveState())
            .on("pointerup", () => {
                this.enterButtonHoverState();
                callback();
            });
    }

    enterButtonHoverState() {
        this.bg.setTint(0xeaaa69);
    }

    enterButtonRestState() {
        this.bg.clearTint();
    }

    enterButtonActiveState() {
        this.bg.setTint(0xeaaa69);
    }
}

export class TextImageTile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, bgTexture, textContent, callback, style) {
        super(scene, x, y);

        const textStyle = {
            fontFamily: 'Arial, Times, serif',
			fontSize: `42px`,
			color: '#FFFFFF',
            strokeThickness: 2,
            shadowOffsetX: 1,
            shadowColor: '#000',
		};

        const bg = scene.add.image(0,0,bgTexture);
        const text = scene.add.text(0, 0, textContent, {...textStyle, ...style})
        
        text.setOrigin(0.5, 0.5);

        this.add([bg, text])

        this.setSize(bg.width, bg.height);
        this.setScale(0.8);
        this.bg = bg;

        this.setInteractive({ useHandCursor: true })
            .on("pointerover", () => this.enterButtonHoverState())
            .on("pointerout", () => this.enterButtonRestState())
            .on("pointerdown", () => this.enterButtonActiveState())
            .on("pointerup", () => {
                this.enterButtonHoverState();
                callback();
            });
    }

    enterButtonHoverState() {
        this.bg.setTint(0xeaaa69);
    }

    enterButtonRestState() {
        this.bg.clearTint();
    }

    enterButtonActiveState() {
        this.bg.setTint(0xeaaa69);
    }
}