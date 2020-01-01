import * as Phaser from 'phaser';
import { PreloaderScene } from './scenes/preloader';
import { GameScene } from './scenes/game';
import { GameOverScene } from './scenes/game-over';
import { MainMenuScene } from './scenes/main-menu';
import { LeaderboardScene } from './scenes/leaderboard';
import { ChooseCharacterScene } from './scenes/choose-character';

import { ContinueScene } from './scenes/continue';
import { LoadingScene } from './scenes/loading';
import { VignettePipeline } from './shaders/vignette';

// DEBUG URL: https://www.facebook.com/embed/instantgames/2519737888241507/player?game_url=https%3A%2F%2Flocalhost%3A8080
const DEFAULT_HEIGHT = 720;
const DEFAULT_WIDTH = (window.innerWidth / window.innerHeight) * DEFAULT_HEIGHT;

const config: Phaser.Types.Core.GameConfig = {
    title: 'Neon Jump',
    type: Phaser.WEBGL,
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        PreloaderScene, MainMenuScene, GameScene, ContinueScene,
        GameOverScene, LeaderboardScene, ChooseCharacterScene,
        LoadingScene
    ],
	backgroundColor: '#2b2b2b',
	render: {
		pixelArt: false
    },
    // callbacks: {
    //     postBoot: game => {
    //         // @ts-ignore
    //         let customPipeline = game.renderer.addPipeline('VignettePipeline', new VignettePipeline(game));
    //     }
    // }
};

export class NeonJump extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
	}
}

window.onload = async () => {
	await FBInstant.initializeAsync()
	await FBInstant.startGameAsync();

	let game: NeonJump = new NeonJump(config);
};