export class Backdrop {

    public static add(scene: Phaser.Scene) {
        const backdrop = scene.add.rectangle(
            scene.physics.world.bounds.centerX,
            scene.physics.world.bounds.centerY,
            scene.physics.world.bounds.width,
            scene.physics.world.bounds.height,
            0x0,
            0.3
        ).setInteractive();
        
        backdrop.setDepth(4);
    }
}