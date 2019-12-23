export class Background extends Phaser.GameObjects.Rectangle {

    constructor(scene: Phaser.Scene) {
        super(
            scene,
            scene.physics.world.bounds.centerX,
            scene.physics.world.bounds.centerY,
            scene.physics.world.bounds.width,
            scene.physics.world.bounds.height,
            0x006f5c
        );
    }
}