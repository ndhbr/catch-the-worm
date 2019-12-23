export class Player extends Phaser.Physics.Arcade.Sprite {

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

        this.startPosition = {
            x: scene.physics.world.bounds.centerX,
            y: scene.physics.world.bounds.height * 0.65 / 2
        };

        this.resetPosition();
    }

    resetPosition() {
        this.setPosition(this.startPosition.x, this.startPosition.y);
    }
}