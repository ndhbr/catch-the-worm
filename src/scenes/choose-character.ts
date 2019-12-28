import { Backdrop } from "../classes/backdrop";
import { Button } from "../classes/button";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'ChooseCharacter',
};

export class ChooseCharacterScene extends Phaser.Scene {
    
    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {}

    public preload(): void {}

    public create(data: any): void {
        Backdrop.add(this);

        const close = Button.generateImageButton(this, 50, 50, 'closeWhite',
            () => {
                this.scene.sleep();
            }
        );
        close.setDepth(5);
    }

    public update(time: number): void {} 
}