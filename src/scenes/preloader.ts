import * as Phaser from 'phaser';

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

        this.load.image('close', 'assets/close.png');
        this.load.image('closeWhite', 'assets/close-white.png');
        this.load.image('heading', 'assets/heading.png');
        this.load.image('particle', 'assets/particle.png');

        this.load.bitmapFont('basis33', 'fonts/basis33_0.png', 'fonts/basis33.xml');
        this.preloadActiveLanguageFile();
    }

    public create(): void {
        this.scene.start('MainMenu');
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