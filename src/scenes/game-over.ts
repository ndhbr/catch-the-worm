import { Backdrop } from "../classes/backdrop";
import { DefaultText } from "../classes/default-text";
import { Button } from "../classes/button";
import { Translate } from "../classes/translate";

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

        const continueButton = Button.generate(
            this,
            this.physics.world.bounds.centerX,
            300,
            this.translate.localise('GAME_OVER', 'CONTINUE'),
            () => {
                // TODO: Continue
            }
        );

        const playAgain = Button.generate(
            this,
            this.physics.world.bounds.centerX,
            380,
            this.translate.localise('GAME_OVER', 'PLAY_AGAIN'),
            () => {
                this.scene.start('Game');
            }
        );

        let menuDialog: Phaser.GameObjects.Container;
        const menu = Button.generate(
            this,
            this.physics.world.bounds.centerX,
            430,
            this.translate.localise('GAME_OVER', 'MENU'),
            () => {
                console.log('Test');
                this.scene.stop('Game');
                this.scene.start('MainMenu');
            }
        );
    }

    public update(time: number): void {

    }
}