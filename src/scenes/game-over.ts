import { Backdrop } from "../classes/backdrop";
import { DefaultText } from "../classes/default-text";
import { Button } from "../classes/button";
import { Translate } from "../classes/translate";
import { FbAdsLib } from "../lib/fb-ads";
import { ScoreLib } from "../lib/score";
import { Animations } from "../lib/animations";
import { Base64Images } from "../lib/base64";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOver',
};

export class GameOverScene extends Phaser.Scene {

    translate: Translate;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
        this.translate = new Translate(this);
    }

    public preload(): void {}

    public create(data: any): void {
        Backdrop.add(this);
        FbAdsLib.incrementScoreCount(data.score);
        FbAdsLib.showInterstitial();

        const heading = new DefaultText(
            this,
            this.physics.world.bounds.centerX,
            120,
            'Game Over',
            48,
            1
        ).setOrigin(0.5);

        if (data.score != null) {
            let score = data.score;

            const scoreText = new DefaultText(
                this,
                this.physics.world.bounds.centerX,
                210,
                score + '',
                64,
                1
            ).setOrigin(0.5, 0.5);
        }

        Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.bottom - 225,
            'buttonShare',
            async () => {
                await FBInstant.shareAsync({
                    intent: 'SHARE',
                    image: Base64Images.getShareImage(),
                    text: this.translate.localise('SHARE', 'SHARE')
                })
            },
            true
        ).setDepth(4).setScale(0.7);

        Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX - 84,
            this.physics.world.bounds.bottom - 150,
            'buttonPlay',
            () => {
                this.scene.start('Game');
            },
            true
        ).setDepth(5);

        Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX + 84,
            this.physics.world.bounds.bottom - 150,
            'buttonHome',
            () => {
                this.scene.stop('Game');
                this.scene.start('MainMenu');
            },
            true
        ).setDepth(4);

        Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.bottom - 75,
            'buttonTheFloorIsLava',
            async () => {
                await FBInstant.switchGameAsync('566170080885812');
            },
            true
        ).setDepth(4).setScale(0.7);

        this.addBeatScore();
    }

    public update(time: number): void {}

    private async addBeatScore() {
        const beatScore = await ScoreLib.getHighestContextScore();

        if (beatScore != null) {
            const beatText = new DefaultText(
                this,
                this.physics.world.bounds.centerX,
                300,
                `${this.translate.localise('GAME_OVER', 'BEAT_TEXT_1')} ${beatScore.getPlayer().getName()}`
                + ` ${this.translate.localise('GAME_OVER', 'BEAT_TEXT_2')}: ${beatScore.getScore()}`,
                32,
                1
            );

            beatText.setOrigin(0.5, 0);
            beatText.setMaxWidth(this.physics.world.bounds.width - 50);

            Animations.weirdFadeIn(this, beatText);
        }
    }
}