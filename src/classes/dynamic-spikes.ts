const SPIKE_SIZE = 32;

export class DynamicSpikes extends Phaser.Physics.Arcade.Group {

    constructor(public scene: Phaser.Scene) {
        super(scene.physics.world, scene, {
            immovable: true
        });
    }
}