export class ScoreWall extends Phaser.Physics.Arcade.Group {

    constructor(public scene: Phaser.Scene,
        public gameAreaBounds: Phaser.Geom.Rectangle) {
        super(scene.physics.world, scene, {
            immovable: true
        });
    }

    addWalls() {
        let width: number = 32;

        let measures = {
            left: {
                x: this.gameAreaBounds.left - width,
                y: 30,
                width: width,
                height: this.gameAreaBounds.height
            },
            right: {
                x: this.gameAreaBounds.right,
                y: 30,
                width: width,
                height: this.gameAreaBounds.height
            }
        };

        let left = this.scene.add.rectangle(
            measures.left.x,
            measures.left.y,
            measures.left.width,
            measures.left.height,
            0x37474F,
            1
        );

        let right = this.scene.add.rectangle(
            measures.right.x,
            measures.right.y,
            measures.right.width,
            measures.right.height,
            0x37474F,
            1
        );

        left.setOrigin(0, 0);
        right.setOrigin(0, 0);

        this.add(left);
        this.add(right);
    }
}