export class Score extends Phaser.GameObjects.BitmapText {

    score: number;

    constructor(scene: Phaser.Scene, initScore?: number) {
        let score = 0;

        if (initScore)
            score = initScore;
        
        super(
            scene,
            scene.physics.world.bounds.centerX,
            scene.physics.world.bounds.height * 0.65 / 2,
            '',
            score + '',
            48,
            1
        );

        this.score = score;
    }
}