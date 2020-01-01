export class Backdrop {

    public static add(scene: Phaser.Scene, intensity?: number) {
        let alpha = 0.5;

        if (intensity)
            alpha = intensity;

        const backdrop = scene.add.rectangle(
            scene.physics.world.bounds.centerX,
            scene.physics.world.bounds.centerY,
            scene.physics.world.bounds.width,
            scene.physics.world.bounds.height,
            0x0,
            alpha
        ).setInteractive();
        
        backdrop.setDepth(4);
    }
}