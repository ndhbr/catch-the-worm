export class Player extends Phaser.Physics.Arcade.Sprite {

    startVelocity: number;

    startPosition: {
        x: number,
        y: number
    };

    constructor(scene: Phaser.Scene) {
        super(
            scene,
            -100,
            -100,
            'player',
            0
        );

        this.startVelocity = 150;

        this.startPosition = {
            x: scene.physics.world.bounds.centerX,
            y: scene.physics.world.bounds.height * 0.65 / 2
        };

        this.setPosition(this.startPosition.x, this.startPosition.y);    
    }

    jump() {
        this.setVelocity(this.startVelocity, -300 );
    }

    resetPosition() {
        this.setVelocity(0, 0);
        this.setPosition(this.startPosition.x, this.startPosition.y);    
    }

    switchDirection() {
        if ((this.flipX && this.body.touching.left) ||
            (!this.flipX && this.body.touching.right)) {
            this.flipX = !this.flipX;
            this.startVelocity = -this.startVelocity;
            this.setVelocityX(this.startVelocity);
        }
    }
}