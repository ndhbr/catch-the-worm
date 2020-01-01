import { Side } from "./dynamic-spikes";

export class Worm extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, public gameAreaBounds: Phaser.Geom.Rectangle) {
        super(scene, -100, -100, 'worm');

        this.setState('dead');
        this.createAnimation();
        this.anims.play('worm');
    }

    createAnimation() {
        this.scene.anims.create({
			key: 'worm',
			frames: this.scene.anims.generateFrameNumbers('worm', {start: 0, end: 2}),
			frameRate: 3,
			repeat: -1
		});
    }

    setSide(side: Side) {
        let x: number = 0;
        let padding: number = 50;

        this.setState('living');

        let rotateAngle = Phaser.Math.Between(
            -15,
            15
        );

        this.setAngle(rotateAngle);

        if (side === Side.LEFT) {
            this.flipX = true;

            this.setRandomPosition(
                this.gameAreaBounds.left - x,
                this.gameAreaBounds.top + (padding*2),
                1,
                this.gameAreaBounds.height - (padding*4)
            );

            this.visible = true;

            this.scene.tweens.add({
                targets: this,
                duration: 250,
                x: this.gameAreaBounds.left + padding + x
            });
        } else {
            this.flipX = false;

            this.setRandomPosition(
                this.gameAreaBounds.right + x,
                this.gameAreaBounds.top + (padding*2),
                1,
                this.gameAreaBounds.height - (padding*4)
            );

            this.visible = true;

            this.scene.tweens.add({
                targets: this,
                duration: 250,
                x: this.gameAreaBounds.right - padding - x
            });
        }
    }

    isDead() {
        return (this.state === 'dead');
    }

    die() {
        this.setState('dead');
        this.visible = false;
    }
}