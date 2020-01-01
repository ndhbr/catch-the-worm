import * as Phaser from 'phaser';
import { DefaultText } from '../classes/default-text';
import { Translate } from '../classes/translate';
import { Backdrop } from '../classes/backdrop';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Loading',
};

export class LoadingScene extends Phaser.Scene {

	translateService: Translate;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.translateService = new Translate(this);
	}

	public create(): void {
        Backdrop.add(this);

		const player = this.add.sprite(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY - 32,
			'player-red',
			0
		).setDepth(4);
		
		this.tweens.add({
			targets: player,
			y: this.physics.world.bounds.centerY - 64,
			duration: 500,
			yoyo: true,
			repeat: -1,
			ease: 'Power1'
		});

		const loading = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY + 32,
			this.translateService.localise('LOADING', 'LOADING'),
			32,
			1
		);
		loading.setOrigin(0.5, 0.5);
	}
}