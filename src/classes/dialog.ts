const BORDER_RADIUS = 10;

import { DefaultText } from "../classes/default-text";

export class Dialog {

	constructor(private scene: Phaser.Scene) {}

    public static add(scene: Phaser.Scene, heading: string, text: string, yesText: string,
        yesCallback: () => void,
		noText?: string, noCallback?: () => void): Phaser.GameObjects.Container {
		const container = scene.add.container(
			scene.physics.world.bounds.centerX,
			scene.physics.world.bounds.centerY
		);

		const backdrop = scene.add.rectangle(
			0,
			0,
			scene.physics.world.bounds.width,
			scene.physics.world.bounds.height,
			0x000000,
			0
		);
		backdrop.setInteractive();

		const background = scene.add.graphics();
		background.fillStyle(0xffffff);

		const headerBackground = scene.add.graphics();
		headerBackground.fillStyle(0xffffff);
		headerBackground.fillRoundedRect(
			-150,
			-150,
			300,
			50,
			{
				tl: BORDER_RADIUS,
				tr: BORDER_RADIUS,
				bl: 0,
				br: 0
			}
		);

		const headingText = new DefaultText(
			scene,
			-140,
			-140,
			heading,
			32
		);
		headingText.setTint(0x000000);

		const mainText = new DefaultText(
			scene,
			-140,
			-92,
			text,
			24
		);
		mainText.setDepth(10);
		mainText.setMaxWidth(280);
		mainText.setTint(0x0);

		background.fillRoundedRect(
			-150,
			-100,
			300,
			mainText.height + 10,
			0
		);

		const closeButton = scene.add.sprite(
			125,
			-127,
			'closeWithoutBox'
		);
		closeButton.setInteractive();
		closeButton.on('pointerdown', () => {
			scene.sound.play('menuSelect');

			container.setActive(false);
			container.setVisible(false);
		});

		const actionBackground = scene.add.graphics();
		actionBackground.fillStyle(0xffffff);
		actionBackground.fillRoundedRect(
			-150,
			-150 + mainText.height + 60,
			300,
			50,
			{
				tl: 0,
				tr: 0,
				bl: BORDER_RADIUS,
				br: BORDER_RADIUS
			}
		);

		const actionYes = new DefaultText(
			scene,
			75,
			-150 + mainText.height + 85,
			yesText,
			32
		);
		actionYes.setOrigin(0.5);
		actionYes.setTint(0xf2b000);
		actionYes.setInteractive();
		actionYes.on('pointerdown', () => {
			// scene.sound.play('menuSelect');

			yesCallback();
		});

		let actionNo: DefaultText;
		if (noText != null) {
			actionNo = new DefaultText(
				scene,
				-75,
				-150 + mainText.height + 85,
				noText,
				32,
			);
			actionNo.setOrigin(0.5);
			actionNo.setTint(0xf2b000);
			actionNo.setInteractive();
			actionNo.on('pointerdown', () => {
				// scene.sound.play('menuSelect');

				if (noCallback != null) {
					noCallback();
				} else {
                    container.setActive(false);
                    container.setVisible(false);	
				}
			});
		}

		container.add(backdrop);
		container.add(background);
		container.add(headerBackground);
		container.add(headingText);
		container.add(closeButton);
		container.add(mainText);
		container.add(actionBackground);
		container.add(actionYes);

		if (actionNo != null)
			container.add(actionNo);

		container.setDepth(5);

        return container;
	}

	public static restoreDialog(container: Phaser.GameObjects.Container) {
		container.setActive(true);
		container.setVisible(true);
	}
}