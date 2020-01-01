import { Side } from "./dynamic-spikes";

export class Player extends Phaser.Physics.Arcade.Sprite {

    startVelocity: number;
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    startPosition: {
        x: number,
        y: number
    };

    constructor(scene: Phaser.Scene, gameAreaBounds: Phaser.Geom.Rectangle,
        playerKey: string) {
        super(
            scene,
            -100,
            -100,
            playerKey,
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
            tint: 0x000000,
            alpha: 0.1,
            quantity: 1,
            frequency: 50,
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
        this.anims.play(this.texture.key);
    }

    createAnimation() {
        this.scene.anims.create({
			key: this.texture.key,
			frames: this.scene.anims.generateFrameNumbers(this.texture.key, {start: 0, end: 2}),
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
        this.setGravity(0, 0);
        this.startVelocity = Math.abs(this.startVelocity);
        this.setPosition(this.startPosition.x, this.startPosition.y);    
    }

    reset() {
        this.resetPosition();

        this.clearTint();
        this.emitter.start();
        this.setBounce(0, 0);
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