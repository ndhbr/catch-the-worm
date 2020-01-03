import * as Phaser from 'phaser';
import { FbAdsLib } from '../lib/fb-ads';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Preloader'
};

export class PreloaderScene extends Phaser.Scene {

    constructor() {
        super(sceneConfig);
    }

    public preload(): void {
        this.load.spritesheet('player-red', 'assets/player-red.png',
            { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('player-redCircle', 'assets/player-red-circle.png',
            { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('player-blue', 'assets/player-blue.png',
            { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('player-blueCircle', 'assets/player-blue-circle.png',
            { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('player-green', 'assets/player-green.png',
            { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('player-grey', 'assets/player-grey.png',
            { frameWidth: 32, frameHeight: 32 });

        this.load.image('player-comingSoon', 'assets/player-comingSoon.png');

        this.load.spritesheet('worm', 'assets/worm-alt.png',
            { frameWidth: 24, frameHeight: 60 });

        this.load.spritesheet('buttonPlay', 'assets/play-button.png',
            { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet('buttonLeaderboard', 'assets/leaderboard-button.png',
            { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet('buttonContinue', 'assets/continue-button.png',
            { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet('buttonShare', 'assets/share-button.png',
            { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet('buttonHome', 'assets/home-button.png',
            { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet('buttonCompete', 'assets/compete-button.png',
            { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet('buttonTheFloorIsLava', 'assets/the-floor-is-lava-button.png',
            { frameWidth: 128, frameHeight: 64 });

        this.load.image('wormsIcon', 'assets/worms-killed.png');
        this.load.image('highscoreIcon', 'assets/highscore-icon.png');
        
        this.load.image('playerSwitchTriangle', 'assets/player-switch-triangle.png');
        this.load.image('closeWhite', 'assets/close-white.png');
        this.load.image('heading', 'assets/heading.png');
        this.load.image('particle', 'assets/particle-alt.png');

        this.load.bitmapFont('basis33', 'fonts/basis33_0.png', 'fonts/basis33.xml');

		this.load.audio('jump', 'assets/sounds/jump.wav');
		this.load.audio('death', 'assets/sounds/death.wav');
		this.load.audio('hit', 'assets/sounds/hit.wav');
		this.load.audio('menuSelect', 'assets/sounds/menu_select.wav');
        this.load.audio('worm', 'assets/sounds/worm.wav');

        this.preloadActiveLanguageFile();
    }

    public create(): void {
        this.scene.start('MainMenu');

        FbAdsLib.loadInterstitial();
        FbAdsLib.loadRewardedVideo();
    }

    private preloadActiveLanguageFile() {
		let language = FBInstant.getLocale();
		language = language.substr(0, 2).toLowerCase();

		switch(language) {
			case 'de':
			case 'en':
				break;
			default:
				language = 'en';
				break;
        }
        
		this.load.json('language-file', `assets/lang/${language}.json`);
    }
}