import { Background } from "../classes/background";
import { GameArea } from "../classes/game-area";
import { Player } from "../classes/player";
import { StaticSpikes } from "../classes/static-spikes";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
        // this.cameras.main.zoom = 0.6;
    }

    public preload(): void {
        this.load.image('player', 'assets/player.png');
    }

    public create(data: any): void {
        let background = new Background(this);
        let gameArea = new GameArea(this);
        let player = new Player(this);
        let staticSpikes = new StaticSpikes(this);

        this.add.existing(background);
        this.add.existing(gameArea);
        this.add.existing(player);
        this.physics.add.group()
        this.physics.add.existing(player, false);

        staticSpikes.addSpikes(gameArea.width);
        player.setGravity(0, 100);

        this.physics.add.collider(staticSpikes, player, () => {
            player.resetPosition();
        });
    }

    public update(time: number): void {}
}