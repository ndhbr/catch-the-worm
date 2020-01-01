const SPIKE_SIZE = 32;
const SPIKE_PADDING = 20;

export enum Side {
    LEFT,
    RIGHT
}

export class DynamicSpikes extends Phaser.Physics.Arcade.Group {

    constructor(public scene: Phaser.Scene, public side: Side,
        public gameAreaBounds: Phaser.Geom.Rectangle) {
        super(scene.physics.world, scene, {
            immovable: true
        });
    }

    addSpikes() {
        let formular: number = this.gameAreaBounds.height / (SPIKE_SIZE + SPIKE_PADDING);
        let decimalPart: number = formular % 1;
        let numberSpikes: number = Math.floor(formular);
        let y: number = this.gameAreaBounds.top + (decimalPart * SPIKE_SIZE);
        let i: number;

        for (i = 0; i < numberSpikes; i++) {
            let triangle: Phaser.GameObjects.Triangle;
            let color = 0x0;

            if (this.side === Side.RIGHT) {
                triangle = this.scene.add.triangle(
                    this.gameAreaBounds.right,
                    y,
                    SPIKE_SIZE,
                    0,
                    0,
                    SPIKE_SIZE / 2,
                    SPIKE_SIZE,
                    SPIKE_SIZE,
                    color,
                    0.3
                );
            } else {
                triangle = this.scene.add.triangle(
                    this.gameAreaBounds.left - SPIKE_SIZE,
                    y,
                    0,
                    0,
                    SPIKE_SIZE,
                    SPIKE_SIZE / 2,
                    0,
                    SPIKE_SIZE,
                    color,
                    0.3
                );
            }

            triangle.setOrigin(0, 0);

            y += SPIKE_SIZE + SPIKE_PADDING;

            this.add(triangle);
        }

        this.children.each((child: Phaser.GameObjects.Triangle) => {
            let body = <Phaser.Physics.Arcade.Body> child.body;

            body.setSize(body.width / 2, body.height / 2, true);
        });
    }

    showSpikes(spikeNumber: number) {
        let x: number;
        let i: number;
        let showingSpikes: Phaser.GameObjects.GameObject[] = [];

        for (i = 0; i < spikeNumber; i++) {
            let randIndex = Phaser.Math.Between(0, this.children.entries.length-1);
            showingSpikes[i] = this.children.entries[randIndex];
        }

        if (this.side === Side.LEFT) {
            x = this.gameAreaBounds.left;
        } else {
            x = this.gameAreaBounds.right - SPIKE_SIZE;
        }

        this.scene.tweens.add({
             targets: showingSpikes,
             duration: 500,
             x: x
        });
    }

    hideSpikes() {
        let x: number;

        if (this.side === Side.LEFT) {
            x = this.gameAreaBounds.left - SPIKE_SIZE;
        } else {
            x = this.gameAreaBounds.right;
        }

        this.scene.tweens.add({
             targets: this.children.entries,
             duration: 500,
             x: x
        });
    }

    getMinSpikeCount() {
        return Math.floor(this.getLength() * 0.3);
    }

    getMaxSpikeCount() {
        return Math.floor(this.getLength() * 0.75);
    }
}