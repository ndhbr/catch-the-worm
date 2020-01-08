import { Translate } from "../classes/translate";
import { Background } from "../classes/background";
import { GameArea } from "../classes/game-area";
import { StaticSpikes } from "../classes/static-spikes";
import { Button } from "../classes/button";
import { Backdrop } from "../classes/backdrop";
import { DefaultText } from "../classes/default-text";
import { ScoreLib } from "../lib/score";
import { FbStatsLib } from "../lib/fb-stats";
import { PlayerSwitch } from "../classes/player-switch";
import { FbAdsLib } from "../lib/fb-ads";
import { Animations } from "../lib/animations";
import { Base64Images } from "../lib/base64";
import { FbDataLib } from "../lib/fb-data";
import { Vignette } from "../classes/vignette";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {

    translate: Translate;

    playerSwitch: PlayerSwitch;

    wormsKilled: DefaultText;
    highscore: DefaultText;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
        this.translate = new Translate(this);
    }

    public preload(): void {}

    public async create(data: any): Promise<void> {
        let background = new Background(this);
        let gameArea = new GameArea(this);
        let staticSpikes = new StaticSpikes(this, gameArea.getBounds());
        let vignette = new Vignette(this).add();
        this.playerSwitch = new PlayerSwitch(this);

        Backdrop.add(this);

        const logo = this.add.sprite(
            this.physics.world.bounds.centerX,
            140,
            'heading'
        );
        logo.setOrigin(0.5, 0.5);
        logo.setDepth(5);
        logo.setScale(0.5);

        Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX - 84,
            this.physics.world.bounds.bottom - 150,
            'buttonPlay',
            () => {
                this.scene.start('Game', {playerKey: this.playerSwitch.getSelectedSpriteKey()});
            },
            true
        ).setDepth(5);

        Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX + 84,
            this.physics.world.bounds.bottom - 150,
            'buttonLeaderboard',
            () => {
                this.launchScene('Leaderboard');
            },
            true
        ).setDepth(5);

        Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX + 55,
            this.physics.world.bounds.bottom - 75,
            'buttonShare',
            async () => {
                await FBInstant.shareAsync({
                    intent: 'SHARE',
                    image: Base64Images.getShareImage(),
                    text: this.translate.localise('SHARE', 'SHARE')
                })
            },
            true
        ).setDepth(5).setScale(0.7);

        Button.generateImageButton(
            this,
            this.physics.world.bounds.centerX - 55,
            this.physics.world.bounds.bottom - 75,
            'buttonCompete',
            async () => {
                await FbDataLib.inviteFriends();
            },
            true
        ).setDepth(5).setScale(0.7);

        this.add.existing(background);
        this.add.existing(gameArea);
        this.add.existing(this.playerSwitch);

        staticSpikes.addSpikes();

        this.addCopyright();

        await ScoreLib.loadLeaderboards();
        this.addStats();

        this.events.on('bought-character', (newWormCount: number) => {
            this.loadStats();
        });
    }

    public update(time: number): void {} 

    private launchScene(key: string) {
        if (this.scene.isSleeping(key)) {
            this.scene.wake(key);
        } else {
            this.scene.launch(key);
        }
    }

    private addCopyright() {
		const copyright = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.bottom - 19,
			'Made with love by ndhbr.de',
			24
		);
		copyright.setOrigin(0.5, 0.5);
        copyright.setTint(0x888888);
        copyright.setInteractive();

        let counter: number = 0;
        copyright.on('pointerdown', async () => { // easter egg
            counter++;
            
            if (counter == 10) {
                await FbStatsLib.incrementWormsCatched(250);
                const wormCount = await FbStatsLib.getWormsCatched();
                this.wormsKilled.setText(wormCount + '');
                this.sound.play('menuSelect');
                FBInstant.logEvent('TRIGGERED_EASTER_EGG', 1);
            }
        });
    }

    private async addStats() {
        const padding = 10;
        const fontSize = 32;
        const startX = 50;
        let y = 225;

        const highscoreIcon = this.add.sprite(
            startX,
            y,
            'highscoreIcon'
        ).setDepth(5);

        this.highscore = new DefaultText(
            this, highscoreIcon.getBounds().right + padding, y,
            '', fontSize
        ).setOrigin(0, 0.5);

        y += 44;

        const wormsKilledIcon = this.add.sprite(
            startX, y,
            'wormsIcon'
        ).setDepth(5);

        this.wormsKilled = new DefaultText(
            this, wormsKilledIcon.getBounds().right + padding, y,
            '', fontSize, 0
        ).setOrigin(0, 0.5);

        this.loadStats();

        Animations.fadeIn(this, highscoreIcon);
        Animations.fadeIn(this, wormsKilledIcon);
    }

    private async loadStats() {
        const worms = await FbStatsLib.getWormsCatched();

        this.highscore.setText(await ScoreLib.getGlobalScore() + '');
        this.wormsKilled.setText(worms + '');

        Animations.fadeIn(this, this.highscore);
        Animations.fadeIn(this, this.wormsKilled);

        this.playerSwitch.addWormsCatched(worms);
    }
}
