const SPIKE_SIZE = 32;

export class StaticSpikes extends Phaser.Physics.Arcade.Group {

    constructor(public scene: Phaser.Scene) {
        super(scene.physics.world, scene, {
            immovable: true
        });
    }

    addSpikes(width: number) {
        let numberSpikes: number = Math.floor(width / SPIKE_SIZE);
        let i: number;

        for (i = 1; i <= numberSpikes; i++) {
            let triangle = this.scene.add.triangle(
                i * SPIKE_SIZE,
                30,
                0,
                0,
                SPIKE_SIZE,
                0,
                SPIKE_SIZE / 2,
                SPIKE_SIZE,
                0x006f5c
            );
            triangle.setOrigin(0, 0);

            this.add(triangle);
        }

        for (i = 1; i <= numberSpikes; i++) {
            let triangle = this.scene.add.triangle(
                i * SPIKE_SIZE,
                this.scene.physics.world.bounds.height * 0.65,
                0,
                SPIKE_SIZE,
                SPIKE_SIZE,
                SPIKE_SIZE,
                SPIKE_SIZE / 2,
                0,
                0x006f5c
            );
            triangle.setOrigin(0, 0);

            this.add(triangle);
        }
    }
}