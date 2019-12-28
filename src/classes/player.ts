import { Side } from "./dynamic-spikes";
import { runInThisContext } from "vm";

export class Player extends Phaser.Physics.Arcade.Sprite {

    startVelocity: number;
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    startPosition: {
        x: number,
        y: number
    };

    constructor(scene: Phaser.Scene, gameAreaBounds: Phaser.Geom.Rectangle) {
        super(
            scene,
            -100,
            -100,
            'player-red',
            0
        );

        this.startVelocity = 250;

        this.startPosition = {
            x: gameAreaBounds.centerX,
            y: gameAreaBounds.centerY
        };

        this.setPosition(this.startPosition.x, this.startPosition.y);

        let particles = scene.add.particles('particle');
        particles.setDepth(4);

        this.emitter = particles.createEmitter({
            speed: 100,
            lifespan: 1000,
            scale: { start: 0.5, end: 0 },
            tint: 0x0,
            alpha: 0.2,
            bounds: {
                x: gameAreaBounds.left,
                y: gameAreaBounds.top,
                width: gameAreaBounds.width,
                height: gameAreaBounds.height
            },
            bounce: 1,
            follow: this
        });

        this.setDepth(5);
        this.createAnimation();
        this.anims.play('player-red');
    }

    createAnimation() {
        this.scene.anims.create({
			key: 'player-red',
			frames: this.scene.anims.generateFrameNumbers('player-red', {start: 0, end: 2}),
			frameRate: 24,
			repeat: -1
		});
    }

    jump() {
        this.setVelocity(this.startVelocity, -350);
    }

    resetPosition() {
        this.setVelocity(0, 0);
        this.flipX = false;
        this.startVelocity = Math.abs(this.startVelocity);
        this.setPosition(this.startPosition.x, this.startPosition.y);    
    }

    getDirection(): Side {
        if (this.flipX)
            return Side.LEFT;
        else
            return Side.RIGHT;
    }

    switchDirection(): Side {
        if ((this.flipX && this.body.touching.left) ||
            (!this.flipX && this.body.touching.right)) {
            this.flipX = !this.flipX;
            this.startVelocity = -this.startVelocity;
            this.setVelocityX(this.startVelocity);

            if (this.flipX)
                return Side.LEFT;
            else
                return Side.RIGHT;
        }
    }
}