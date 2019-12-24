export class ScoreWall extends Phaser.Physics.Arcade.Group {

    constructor(public scene: Phaser.Scene) {
        super(scene.physics.world, scene, {
            immovable: true
        });
    }

    addWalls() {
        let measures = {
            left: {
                x: (this.scene.physics.world.bounds.width * 0.1) / 2 - 10,
                y: 30,
                width: 10,
                height: this.scene.physics.world.bounds.height * 0.65
            },
            right: {
                x: (this.scene.physics.world.bounds.width * 0.9) + (this.scene.physics.world.bounds.width * 0.1) / 2,
                y: 30,
                width: 10,
                height: this.scene.physics.world.bounds.height * 0.65
            }
        };

        let left = this.scene.add.rectangle(
            measures.left.x,
            measures.left.y,
            measures.left.width,
            measures.left.height,
            0x006f5c
        );

        let right = this.scene.add.rectangle(
            measures.right.x,
            measures.right.y,
            measures.right.width,
            measures.right.height,
            0x006f5c
        );

        left.setOrigin(0, 0);
        right.setOrigin(0, 0);

        this.add(left);
        this.add(right);
    }
}