import { Translate } from "../classes/translate";
import { Background } from "../classes/background";
import { GameArea } from "../classes/game-area";
import { StaticSpikes } from "../classes/static-spikes";
import { Button } from "../classes/button";
import { Backdrop } from "../classes/backdrop";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {

    translate: Translate;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
        this.translate = new Translate(this);
    }

    public preload(): void {}

    public create(data: any): void {
        let background = new Background(this);
        let gameArea = new GameArea(this);
        let staticSpikes = new StaticSpikes(this, gameArea.getBounds());

        Backdrop.add(this);

        const logo = this.add.sprite(
            this.physics.world.bounds.centerX,
            140,
            'heading'
        );
        logo.setOrigin(0.5, 0.5);
        logo.setDepth(4);

        Button.generate(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.bottom - 250,
            this.translate.localise('MAIN_MENU', 'PLAY'),
            () => {
                this.scene.start('Game');
            }
        );

        Button.generate(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.bottom - 200,
            this.translate.localise('MAIN_MENU', 'SELECT_CHARACTER'),
            () => {
                this.launchScene('ChooseCharacter');
            }
        );

        Button.generate(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.bottom - 150,
            this.translate.localise('MAIN_MENU', 'LEADERBOARD'),
            () => {
                this.launchScene('Leaderboard');
            }
        );

        this.add.existing(background);
        this.add.existing(gameArea);

        staticSpikes.addSpikes();
    }

    public update(time: number): void {} 

    private launchScene(key: string) {
        if (this.scene.isSleeping(key)) {
            this.scene.wake(key);
        } else {
            this.scene.launch(key);
        }
    }
}
