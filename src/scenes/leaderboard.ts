import { Backdrop } from "../classes/backdrop";
import { Button } from "../classes/button";
import { DefaultText } from "../classes/default-text";
import { Translate } from "../classes/translate";
import { Colors } from "../colors";
import { LeaderboardDialog } from "../classes/leaderboard-dialog";

enum Leaderboard {
	FRIENDS,
	WORLD
}

const BORDER_RADIUS: number = 12;
const BADGE_SIZE = {
    WIDTH: 256,
    HEIGHT: 56,
    X: -128,
    Y: -28
};

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Leaderboard',
};

export class LeaderboardScene extends Phaser.Scene {

	translate: Translate;

	leaderboardDialog: LeaderboardDialog;

    currentLeaderboard: Leaderboard;
	leaderboardEntriesGroup: Phaser.GameObjects.Group;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
        this.translate = new Translate(this);
		this.leaderboardDialog = new LeaderboardDialog(this);

		this.currentLeaderboard = Leaderboard.WORLD;
    }

    public preload(): void {}

    public create(data: any): void {
        const backdrop = this.add.rectangle(
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY,
            this.physics.world.bounds.width,
            this.physics.world.bounds.height,
            0x0,
            0.3
        ).setInteractive();

        const close = Button.generateImageButton(this, 50, 50, 'closeWhite',
            () => {
                this.scene.sleep();
            }
        );
        close.setDepth(5);

        this.addLeaderboardSwitch();

		this.leaderboardEntriesGroup = new Phaser.GameObjects.Group(this);
		this.loadLeaderboard(this.currentLeaderboard);

		// this.leaderboardDialog.addLeaderboard();
	}

    public update(time: number): void {}

    private addLeaderboardSwitch() {
		const container: Phaser.GameObjects.Container = this.add.container(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.bottom - 64
		);

		const world = new DefaultText(
			this,
			-105,
			0,
			this.translate.localise('LEADERBOARD', 'WORLD'),
			32
		).setInteractive();

		const friends = new DefaultText(
			this,
			10,
			0,
			this.translate.localise('LEADERBOARD', 'FRIENDS'),
			32
		).setInteractive();

		container.setDepth(4);

		if (this.currentLeaderboard === Leaderboard.WORLD) {
			world.setTint(Colors.ACTIVE);
		} else if (this.currentLeaderboard === Leaderboard.FRIENDS) {
			friends.setTint(Colors.ACTIVE);
		}

		world.on('pointerdown', () => {
			if (this.currentLeaderboard !== Leaderboard.WORLD) {
				// this.sound.play('menuSelect');

				this.currentLeaderboard = Leaderboard.WORLD;
				world.setTint(Colors.ACTIVE);
				friends.setTint(Colors.DEFAULT);
				this.loadLeaderboard(this.currentLeaderboard);
			}
		}, this);

		friends.on('pointerdown', () => {
			if (this.currentLeaderboard !== Leaderboard.FRIENDS) {
				// this.sound.play('menuSelect');

				this.currentLeaderboard = Leaderboard.FRIENDS;
				world.setTint(Colors.DEFAULT);
				friends.setTint(Colors.ACTIVE);
				this.loadLeaderboard(this.currentLeaderboard);
			}
		}, this);

		container.add(world);
        container.add(friends);
    }

    private async loadLeaderboard(scope: Leaderboard) {
        const leaderboard = await FBInstant.getLeaderboardAsync('global-score');
        let entries: FBInstant.LeaderboardEntry[];
        let i: number, currentY: number = 120;

        this.leaderboardEntriesGroup.clear(true, true);
        this.currentLeaderboard = scope;

        if (scope === Leaderboard.FRIENDS) {
            entries = await leaderboard.getConnectedPlayerEntriesAsync(8, 0);
        } else {
            entries = await leaderboard.getEntriesAsync(8, 0);
        }

        console.log(entries);

        for (i = 0; i < entries.length; i++) {
			this.leaderboardEntriesGroup.add(this.addLeaderboardBadge(this.physics.world.bounds.centerX, currentY, entries[i]));
            currentY += 64;
        }
    }

    private addLeaderboardBadge(x: number, y: number,
		leaderboardEntry: FBInstant.LeaderboardEntry): Phaser.GameObjects.Container {
		let currentLeaderboard: number = this.currentLeaderboard;
		let container: Phaser.GameObjects.Container = this.add.container(
			x,
			y
		);
		container.setDepth(4);

        const badge = this.add.graphics();
        badge.fillStyle(Colors.GAME_COLORS.BLUE_GREY);
        badge.fillRoundedRect(
			BADGE_SIZE.X,
            BADGE_SIZE.Y,
			BADGE_SIZE.WIDTH,
            BADGE_SIZE.HEIGHT,
            BORDER_RADIUS
        );

		let name = new DefaultText(
			this,
			BADGE_SIZE.X + 32,
			-24,
			(leaderboardEntry.getPlayer().getName()).substr(0, 11),
			32
		);

		const score = new DefaultText(
			this,
			BADGE_SIZE.X + 32,
            0,
            `${leaderboardEntry.getScore()}`,
			24
		);

		const ranking = new DefaultText(
			this,
			BADGE_SIZE.X + 6,
			BADGE_SIZE.Y + 5,
			`${leaderboardEntry.getRank()}`,
			48
		);

		container.add(badge);
		container.add(name);
		container.add(score);
		container.add(ranking);

		const profilePictureKey: string = `profilePicture${leaderboardEntry.getPlayer().getID()}`;

		if (!this.textures.exists(`${profilePictureKey}-masked`)) {
			console.log('Texture does not exist.');

			this.load.on(`filecomplete-image-${profilePictureKey}`,
			() => {
				if (container.visible) {
                    this.addRoundedPlayerPhoto(profilePictureKey, container);
				}
			}, this);

			this.load.image(profilePictureKey, leaderboardEntry.getPlayer().getPhoto());
			this.load.start();
		} else {
			console.log('Texture does already exist.');

            this.addRoundedPlayerPhoto(`${profilePictureKey}`, container);
		}

		return container;
	}

    private addProfilePictureToContainer(profilePictureKey: string,
        container: Phaser.GameObjects.Container)
		: Phaser.GameObjects.Sprite {

		const profilePicture = this.add.sprite(
			BADGE_SIZE.WIDTH/2 - 30,
			BADGE_SIZE.Y + 28,
			profilePictureKey
		);

		profilePicture.setScale(0.15);
		profilePicture.setDepth(4);

		container.add(profilePicture);

		return profilePicture;
    }

    private addRoundedPlayerPhoto(profilePictureKey: string,
        container: Phaser.GameObjects.Container) {

		let playerPhoto: Phaser.GameObjects.Image;

		if (!this.textures.exists(`${profilePictureKey}-masked`)) {
			let source = <HTMLCanvasElement>this.textures.get(profilePictureKey).getSourceImage();
			this.textures.remove(profilePictureKey);

			let photo = this.textures.createCanvas(`${profilePictureKey}-masked`, 44, 44);

			photo.context.beginPath();
			photo.context.arc(22, 22, 22, 0, Math.PI * 2, false);
			photo.context.clip();
			photo.draw(0, 0, source);
		}

        playerPhoto = this.add.image(
            BADGE_SIZE.WIDTH/2 - 30,
			BADGE_SIZE.Y + 28,
			`${profilePictureKey}-masked`
        );

        container.add(playerPhoto);

        return playerPhoto;
    }
}