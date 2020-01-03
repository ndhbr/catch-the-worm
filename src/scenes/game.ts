import { Background } from "../classes/background";
import { GameArea } from "../classes/game-area";
import { Player } from "../classes/player";
import { StaticSpikes } from "../classes/static-spikes";
import { ScoreWall } from "../classes/score-wall";
import { DynamicSpikes, Side } from "../classes/dynamic-spikes";
import { Controls } from "../classes/controls";
import { Score } from "../classes/score";
import { Colors } from "../colors";
import { Worm } from "../classes/worm";
import { ScoreLib } from "../lib/score";
import { FbStatsLib } from "../lib/fb-stats";
import { FbAdsLib } from "../lib/fb-ads";
import { DefaultText } from "../classes/default-text";
import { Translate } from "../classes/translate";
import { Animations } from "../lib/animations";

const GRAVITY_Y = 800;

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {

    translate: Translate;

    player: Player;
    score: Score;
    wormsCatched: number;
    wormCatchAllowed: boolean;

    staticSpikesCollider: Phaser.Physics.Arcade.Collider;

    hint: DefaultText;

    isGameOver: boolean;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
        this.translate = new Translate(this);
        this.isGameOver = false;
        this.wormsCatched = 0;
        // this.cameras.main.zoom = 0.8 ;
        this.setWormCatchAllowed(true);
    }

    public preload(): void {}

    public create(data: any): void {
        let background = new Background(this);
        let gameArea = new GameArea(this);
        this.player = new Player(this, gameArea.getBounds(), data.playerKey);
        let staticSpikes = new StaticSpikes(this, gameArea.getBounds());
        let leftSpikes = new DynamicSpikes(this, Side.LEFT, gameArea.getBounds());
        let rightSpikes = new DynamicSpikes(this, Side.RIGHT, gameArea.getBounds());
        let scoreWall = new ScoreWall(this, gameArea.getBounds());
        let controls = new Controls(this);
        let worm = new Worm(this, gameArea.getBounds());
        this.score = new Score(this, 0);
        this.score.syncWithLeaderboards();

        this.add.existing(background);
        this.add.existing(gameArea);
        this.add.existing(this.player);
        this.add.existing(worm);

        this.physics.add.existing(this.player, false);
        this.physics.add.existing(worm, false);

        staticSpikes.addSpikes();
        leftSpikes.addSpikes();
        rightSpikes.addSpikes();

        scoreWall.addWalls();

        this.staticSpikesCollider = this.physics.add.collider(staticSpikes, this.player, this.gameOver.bind(this));
        this.physics.add.collider(leftSpikes, this.player, this.gameOver.bind(this));
        this.physics.add.collider(rightSpikes, this.player, this.gameOver.bind(this));

        let spikeNumber: number = leftSpikes.getMinSpikeCount();
        this.physics.add.collider(scoreWall, this.player, () => {
            if (!this.isGameOver) {
                this.sound.play('hit');

                let side: Side = this.player.switchDirection();
                
                const currentScore = this.score.getScore();
    
                if (currentScore > 1 && (currentScore % 10) == 0 &&
                    spikeNumber < leftSpikes.getMaxSpikeCount()) {
                    spikeNumber += 1;
                }
    
                if (side === Side.LEFT) {
                    leftSpikes.showSpikes(spikeNumber);
                    rightSpikes.hideSpikes();
                } else {
                    rightSpikes.showSpikes(spikeNumber);
                    leftSpikes.hideSpikes();
                }

                if (worm.isDead()) {
                    this.setWormCatchAllowed(true);
                    worm.setSide(side);
                }
    
                this.score.incrementScore();
    
                this.cameras.main.shake(100, 0.01);

                let color = this.getRandomColor();
                background.fillColor = color;
                scoreWall.children.each((wall: Phaser.GameObjects.Rectangle) => {
                    wall.fillColor = color;
                });
            }
        });

        this.physics.add.overlap(worm, this.player, () => {
            if (this.wormCatchAllowed) {
                this.setWormCatchAllowed(false);

                this.sound.play('worm');
                worm.die();

                console.log('Catched Worm');
                
                this.wormsCatched++;
            }
        });

        controls.addJumpControl(() => {
            if (!this.isGameOver) {
                this.sound.play('jump');
                this.score.showScore();

                this.player.setGravity(0, GRAVITY_Y);
                this.player.jump();
            }

            this.hint.setVisible(false);
        });

		this.scene.get('Continue').events.on('continue-game', () => {
            leftSpikes.hideSpikes();
            rightSpikes.hideSpikes();

            this.showHint();

            this.score.hideScore();
            this.score.setVisible(true);

            this.staticSpikesCollider.active = true;

            this.player.reset();

            this.isGameOver = false;
        });

        this.addHint();
    }

    public update(time: number): void {
        let vector = new Phaser.Math.Vector2(
            this.player.body.velocity.x,
            this.player.body.velocity.y / 3
        );
        let angle = vector.angle();

        if (this.player.getDirection() === Side.RIGHT)
            this.player.setRotation(angle);
        else
            this.player.setRotation(angle - Math.PI);
    }

    private gameOver() {
        if (!this.isGameOver) {
            this.isGameOver = true;

            this.sound.play('death');
            this.cameras.main.shake(250, 0.03);

            // if ("vibrate" in navigator)
                // window.navigator.vibrate(250);
    
            this.player.setTint(0x555555);
            this.player.emitter.stop();
            this.player.setBounce(0.5);

            this.staticSpikesCollider.active = false;

            this.score.setVisible(false);
            this.score.commitScore();

            ScoreLib.setScore(this.score.getScore());
            FbStatsLib.incrementWormsCatched(this.wormsCatched);

            if (FbAdsLib.rewardedVideo != null) {
                this.scene.launch('Continue', {score: this.score.getScore()});
            } else {
                this.scene.launch('GameOver', {score: this.score.getScore()});
            }
        }
    }

    private getRandomColor(): number {
        const colors = Object.values(Colors.GAME_COLORS);
        const random = Phaser.Math.Between(0, colors.length - 1);

        return colors[random];
    }

    private addHint() {
        this.hint = new DefaultText(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY - 128,
            this.translate.localise('GAME', 'HINT'),
            32,
            1
        ).setOrigin(0.5, 0.5);

        this.hint.setMaxWidth(this.physics.world.bounds.width * 0.8);

        this.showHint();
    }

    private showHint() {
        Animations.fadeIn(this, this.hint, 250);
    }

    private setWormCatchAllowed(allowed: boolean) {
        this.wormCatchAllowed = allowed;
    }
}