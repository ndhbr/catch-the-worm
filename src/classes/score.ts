import { FacebookInstantGamesLeaderboard } from "phaser";

export class Score extends Phaser.GameObjects.BitmapText {

    score: number;

    globalLeaderboard: FBInstant.Leaderboard;
    contextLeaderboard: FBInstant.Leaderboard;

    constructor(scene: Phaser.Scene, initScore?: number) {
        let score = 0;

        if (initScore)
            score = initScore;
        
        super(
            scene,
            scene.physics.world.bounds.centerX,
            scene.physics.world.bounds.centerY,
            'basis33',
            score + '',
            64,
            1
        );
        
        this.setOrigin(0.5, 0.5);
        this.setDepth(3);
        this.hideScore();
        
        this.score = score;

        scene.add.existing(this);
    }

    syncWithLeaderboards() {
        FBInstant.getLeaderboardAsync(
            `friends.${FBInstant.context.getID()}`
        ).then((leaderboard: FBInstant.Leaderboard) => {
            this.contextLeaderboard = leaderboard;
        });

        FBInstant.getLeaderboardAsync('global-score')
        .then((leaderboard: FBInstant.Leaderboard) => {
            this.globalLeaderboard = leaderboard;
        })
    }

    getScore(): number {
        return this.score;
    }

    setScore(score: number) {
        this.score = score;

        this.setText(this.score + '');
    }

    incrementScore() {
        this.score++;

        this.setText(this.score + '');
    }

    showScore() {
        if (this.alpha === 0) {
            const speed: number = 250;

            this.scene.tweens.add({
                targets: this,
                alphaTopLeft: { value: 1, duration: speed },
                alphaTopRight: { value: 1, duration: speed, delay: speed },
                alphaBottomLeft: { value: 1, duration: speed },
                alphaBottomRight: { value: 1, duration: speed }
            });
        }
    }

    hideScore() {
        this.alpha = 0;
    }

    async commitScore() {
        if (this.globalLeaderboard != null) {
            this.globalLeaderboard.setScoreAsync(this.score);
        }

        if (this.contextLeaderboard != null) {
            await this.contextLeaderboard.setScoreAsync(this.score);
            
            FBInstant.updateAsync({
                action: 'LEADERBOARD',
                name: `friends.${FBInstant.context.getID()}`
            });
        }
    }
}