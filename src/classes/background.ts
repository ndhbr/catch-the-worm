export class Background extends Phaser.GameObjects.Rectangle {

    constructor(scene: Phaser.Scene) { 
        super(
            scene,
            scene.physics.world.bounds.centerX,
            scene.physics.world.bounds.centerY,
            scene.physics.world.bounds.width * 1.2,
            scene.physics.world.bounds.height * 1.2,
            0x37474F
        );
    }
}