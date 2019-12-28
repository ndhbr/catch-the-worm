import { Background } from "../classes/background";
import { GameArea } from "../classes/game-area";
import { Player } from "../classes/player";
import { StaticSpikes } from "../classes/static-spikes";
import { ScoreWall } from "../classes/score-wall";
import { DynamicSpikes, Side } from "../classes/dynamic-spikes";
import { Controls } from "../classes/controls";
import { Score } from "../classes/score";
import { Colors } from "../colors";

const GRAVITY_Y = 800;

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {

    player: Player;
    score: Score;

    staticSpikesCollider: Phaser.Physics.Arcade.Collider;

    isGameOver: boolean;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
        this.isGameOver = false;
        // this.cameras.main.zoom = 0.8 ;
    }

    public preload(): void {}

    public create(data: any): void {
        let background = new Background(this);
        let gameArea = new GameArea(this);
        this.player = new Player(this, gameArea.getBounds());
        let staticSpikes = new StaticSpikes(this, gameArea.getBounds());
        let leftSpikes = new DynamicSpikes(this, Side.LEFT, gameArea.getBounds());
        let rightSpikes = new DynamicSpikes(this, Side.RIGHT, gameArea.getBounds());
        let scoreWall = new ScoreWall(this, gameArea.getBounds());
        let controls = new Controls(this);
        this.score = new Score(this, 0);
        this.score.syncWithLeaderboards();

        this.add.existing(background);
        this.add.existing(gameArea);
        this.add.existing(this.player);

        this.physics.add.existing(this.player, false);

        staticSpikes.addSpikes();
        leftSpikes.addSpikes();
        rightSpikes.addSpikes();

        scoreWall.addWalls();

        this.staticSpikesCollider = this.physics.add.collider(staticSpikes, this.player, this.gameOver.bind(this));
        this.physics.add.collider(leftSpikes, this.player, this.gameOver.bind(this));
        this.physics.add.collider(rightSpikes, this.player, this.gameOver.bind(this));

        this.physics.add.collider(scoreWall, this.player, () => {
            if (!this.isGameOver) {
                let side: Side = this.player.switchDirection();
                let spikeNumber: number = 3;
                const currentScore = this.score.getScore();
    
                if (currentScore > 1 && currentScore % 10  == 0 &&
                    spikeNumber < leftSpikes.getMaxSpikeCount()) {
                    spikeNumber += 1; // TODO
                }
    
                if (side === Side.LEFT) {
                    leftSpikes.showSpikes(spikeNumber);
                    rightSpikes.hideSpikes();
                } else {
                    rightSpikes.showSpikes(spikeNumber);
                    leftSpikes.hideSpikes();
                }
    
                this.score.incrementScore();
    
                this.cameras.main.shake(100, 0.01);
                window.navigator.vibrate(100);
    
                let color = this.getRandomColor();
                background.fillColor = color;
                scoreWall.children.each((wall: Phaser.GameObjects.Rectangle) => {
                    wall.fillColor = color;
                });
            }
        });

        controls.addJumpControl(() => {
            if (!this.isGameOver) {
                this.score.showScore();
                this.player.setGravity(0, GRAVITY_Y);
                this.player.jump();
            }
        });
    }

    public update(time: number): void {
        let speed = this.player.body.velocity.y;

        if (!this.isGameOver) {
            speed /= 1000;
        } else {
            speed /= 10;
        }

        if (this.player.getDirection() === Side.RIGHT)
            this.player.setRotation(speed);
        else
            this.player.setRotation(-speed);
    }

    private gameOver() {
        if (!this.isGameOver) {
            this.isGameOver = true;
            this.cameras.main.shake(250, 0.03);
            window.navigator.vibrate(250);
    
            this.player.setTint(0x555555);
            this.player.emitter.stop();
            this.player.setBounce(0.5);

            this.staticSpikesCollider.active = false;

            this.score.setVisible(false);
            this.score.commitScore();

            this.scene.launch('GameOver', {score: this.score.getScore()});
        }
    }

    private getRandomColor(): number {
        const colors = Object.values(Colors.GAME_COLORS);
        const random = Phaser.Math.Between(0, colors.length - 1);

        return colors[random];
    }
}