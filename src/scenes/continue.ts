import { Backdrop } from "../classes/backdrop";
import { DefaultText } from "../classes/default-text";
import { Button } from "../classes/button";
import { Translate } from "../classes/translate";
import { FbAdsLib } from "../lib/fb-ads";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Continue',
};

export class ContinueScene extends Phaser.Scene {

    translate: Translate;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
        this.translate = new Translate(this);
    }

    public preload(): void {}

    public create(data: any): void {
        let score: number = 0;

        if (data.score != null)
            score = data.score;
        
        Backdrop.add(this);

        const scoreText = new DefaultText(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY - 192,
            score + '',
            64,
            1
        ).setOrigin(0.5, 0.5);

        const continuePlaying = new DefaultText(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY - 96,
            this.translate.localise('CONTINUE', 'HEADING'),
            32,
            1
        ).setOrigin(0.5, 0.5);

        const continueButton = Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY,
            'buttonContinue',
            async () => {
                const showed = await FbAdsLib.showRewardedVideo();

                if (showed) {
                    this.events.emit('continue-game');
                    this.scene.stop();
                } else {
                    this.scene.stop();
                    this.scene.launch('GameOver', {score: score});
                }
            },
            true
        ).setDepth(4);

        const cancelButton = Button.generate(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY + 72,
            this.translate.localise('CONTINUE', 'CANCEL'),
            () => {
                this.scene.stop();
                this.scene.launch('GameOver', {score: score});
            }
        ).setFontSize(28);
    }
}