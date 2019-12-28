export class GameArea extends Phaser.GameObjects.Rectangle {

    constructor(scene: Phaser.Scene) {
        super(
            scene,
            scene.physics.world.bounds.centerX,
            30,
            scene.physics.world.bounds.width * 0.9,
            scene.physics.world.bounds.height * 0.9,
            0xffffff,
            0.1
        );

        this.setOrigin(0.5, 0);
    }
}