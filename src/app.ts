import * as Phaser from 'phaser';
import { GameScene } from './scenes/game';

// DEBUG URL: https://www.facebook.com/embed/instantgames/2519737888241507/player?game_url=https%3A%2F%2Flocalhost%3A8080
const DEFAULT_HEIGHT = 720;
const DEFAULT_WIDTH = (window.innerWidth / window.innerHeight) * DEFAULT_HEIGHT;

const config: Phaser.Types.Core.GameConfig = {
    title: 'Neon Jump',
    type: Phaser.AUTO,
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
            debug: true
        }
    },
	scene: [GameScene],
	backgroundColor: '#2b2b2b',
	render: {
		pixelArt: false
	}
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