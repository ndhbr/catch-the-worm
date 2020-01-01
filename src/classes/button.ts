import { DefaultText } from './default-text';
import { Colors } from '../colors';

export class Button {

    constructor() {}

    public static generate(scene: Phaser.Scene, x: number, y: number,
		text: string, callback: () => void): DefaultText {
                const button = new DefaultText(
            scene,
            x,
            y,
            text,
            32,
            1
        );

        button.setOrigin(0.5, 0.5);
        button.setInteractive();

        button.on('pointerdown', () => {
            scene.sound.play('menuSelect');

            button.setTint(Colors.ACTIVE);
		}, this);

		button.on('pointerup', () => {
            button.clearTint();
            
			// this.scene.sound.play('menuSelect');
			callback();
		}, this);

        return button;
    }

    public static generateImageButton(scene: Phaser.Scene, x: number, y: number,
        key: string, callback: () => void, isSpritesheet?: boolean): Phaser.GameObjects.Sprite {
        const button = scene.add.sprite(
            x,
            y,
            key
        );

        button.setOrigin(0.5, 0.5);
        button.setInteractive();

        button.on('pointerdown', () => {
            button.setTint(Colors.ACTIVE);
            scene.sound.play('menuSelect');

            if (isSpritesheet)
                button.setFrame(1);
		}, this);

		button.on('pointerup', () => {
            button.clearTint();

            if (isSpritesheet)
                button.setFrame(0);
            
			// this.scene.sound.play('menuSelect');
			callback();
		}, this);

        return button;
    }
}