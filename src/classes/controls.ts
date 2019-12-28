export class Controls {

    constructor(public scene: Phaser.Scene) {}

    public addJumpControl(callback: () => void) {
        this.scene.input.keyboard.on('keydown-SPACE', () => {
            callback();
        });

        let touchArea = this.scene.add.rectangle(
            this.scene.physics.world.bounds.centerX,
            this.scene.physics.world.bounds.centerY,
            this.scene.physics.world.bounds.width,
            this.scene.physics.world.bounds.height,
            0x0,
            0
        ).setInteractive();

        touchArea.on('pointerdown', () => {
            callback();
        });
    }
}