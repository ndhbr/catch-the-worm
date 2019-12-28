const SPIKE_SIZE = 32;
const SPIKE_PADDING = 10;

export class StaticSpikes extends Phaser.Physics.Arcade.Group {

    constructor(public scene: Phaser.Scene,
        public gameAreaBounds: Phaser.Geom.Rectangle) {
        super(scene.physics.world, scene, {
            immovable: true
        });
    }

    addSpikes() {
        let gameAreaPadding: number = 10;
        let formular = (this.gameAreaBounds.width - (gameAreaPadding*2)) / (SPIKE_SIZE + SPIKE_PADDING);
        let decimalPart = formular % 1;
        let numberSpikes: number = Math.floor(formular);
            
        let i: number = 0;
        let x: number = this.gameAreaBounds.left + SPIKE_SIZE * decimalPart;

        for (i = 0; i < numberSpikes; i++) {
            if (i == 0)
                x += gameAreaPadding;
            else
                x += SPIKE_PADDING / 2;

            let triangle = this.scene.add.triangle(
                x,
                30,
                0,
                0,
                SPIKE_SIZE,
                0,
                SPIKE_SIZE / 2,
                SPIKE_SIZE,
                0x0,
                0.3
            );
            triangle.setOrigin(0, 0);

            x += SPIKE_SIZE + (SPIKE_PADDING / 2);

            this.add(triangle);
        }

        x = this.gameAreaBounds.left + SPIKE_SIZE * decimalPart;

        for (i = 0; i < numberSpikes; i++) {
            if (i == 0)
                x += gameAreaPadding;
            else
                x += SPIKE_PADDING / 2 ;

            let triangle = this.scene.add.triangle(
                x,
                this.gameAreaBounds.height,
                0,
                SPIKE_SIZE,
                SPIKE_SIZE,
                SPIKE_SIZE,
                SPIKE_SIZE / 2,
                0,
                0x0,
                0.3
            );
            triangle.setOrigin(0, 0);

            x += SPIKE_SIZE + (SPIKE_PADDING / 2);

            this.add(triangle);
        }

        this.children.each((child: Phaser.GameObjects.Triangle) => {
            let body = <Phaser.Physics.Arcade.Body> child.body;

            body.setSize(body.width / 2, body.height / 2, true);
        })
    }
}