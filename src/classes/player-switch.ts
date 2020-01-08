import { DefaultText } from "./default-text";
import { Translate } from "./translate";
import { FbDataLib } from "../lib/fb-data";

enum Direction {
	LEFT,
	RIGHT
}

export enum PlayerNames {
	__START,
    red,
    redCircle,
    blue,
    blueCircle,
    green,
    grey,
    blackWhiteCircle,
    comingSoon,
	__END
}

export class PlayerSwitch extends Phaser.GameObjects.Container {

    translate: Translate;

    unlockedPlayers: PlayerNames[];

    activePlayer: PlayerNames;
    activePlayerCost: number;

    players:  Array<Phaser.Physics.Arcade.Sprite>;
    worms: number;
    wormsText: DefaultText;

	particles: Phaser.GameObjects.Particles.ParticleEmitterManager;

    constructor(scene: Phaser.Scene) {
        super(
            scene,
            scene.physics.world.bounds.centerX,
            scene.physics.world.bounds.centerY + 32
        );
        this.loadUnlockedCharacters();

        this.translate = new Translate(scene);
        this.players = [];

        const left = this.addControl(Direction.LEFT);
        const right = this.addControl(Direction.RIGHT);

        left.on('pointerdown', () => {
            this.scene.sound.play('menuSelect');

            this.drawPlayer(Direction.LEFT);
		});

		right.on('pointerdown', () => {
            this.scene.sound.play('menuSelect');

            this.drawPlayer(Direction.RIGHT);
        });

        this.add(left);
        this.add(right);

        this.addParticles();
        this.drawPlayer();
        this.addBuyListener();

        this.setDepth(4);
    }

    public getSelectedSpriteKey(): string {
		if (this.players[this.activePlayer].isTinted)
			return this.players[1].texture.key;

		return this.players[this.activePlayer].texture.key;
	}

    public addWormsCatched(worms: number) {
        this.worms = worms;
    }

    private addBuyListener() {
        let buyListener = this.scene.add.rectangle(
            0, 0, 64, 64, 0x000000, 0
        ).setInteractive();

        buyListener.on('pointerdown', this.buyPlayer.bind(this));

        buyListener.setDepth(10);

        this.add(buyListener);
    }

    private async loadUnlockedCharacters() {
        this.unlockedPlayers = await FbDataLib.loadUnlockedCharacters();
    }

    private addControl(type: Direction): Phaser.GameObjects.Sprite {
        let control: Phaser.GameObjects.Sprite;

        if (type === Direction.LEFT) {
            control = this.scene.add.sprite(
                -96,
                0,
                'playerSwitchTriangle'
            );
            control.flipX = true;
        } else {
            control = this.scene.add.sprite(
                96,
                0,
                'playerSwitchTriangle'
            );
        }

        control.setScale(0.5);
        control.setOrigin(0.5, 0.5);
        control.setInteractive();
        control.input.hitArea.setTo(
            -50,
            -50,
            200,
            200
        );

        return control;
    }

    private drawPlayer(direction?: Direction) {
        if (this.activePlayer == null) {
            this.activePlayer = PlayerNames.red;
        }

        if (direction != null) {
			if (this.players[this.activePlayer] != null) {
				this.players[this.activePlayer].setActive(false);
				this.players[this.activePlayer].setVisible(false);
            }
            
            if (direction == Direction.LEFT) {
				this.activePlayer--;

				if (this.activePlayer === PlayerNames.__START)
					this.activePlayer = PlayerNames.__END - 1;
			} else if (direction == Direction.RIGHT) {
				this.activePlayer++;

				if (this.activePlayer === PlayerNames.__END)
					this.activePlayer = PlayerNames.__START + 1;
			}
        }

        if (this.players[this.activePlayer] == null) {
            if (this.activePlayer !== PlayerNames.comingSoon) {
                this.players[this.activePlayer] = this.scene.physics.add.sprite(
                    0,
                    0,
                    `player-${PlayerNames[this.activePlayer]}`
                );
            } else {
				this.players[this.activePlayer] = this.scene.physics.add.sprite(
					0,
					0,
					'player-comingSoon'
				);
            }

            this.add(this.players[this.activePlayer]);
        } else {
			this.players[this.activePlayer].setActive(true);
			this.players[this.activePlayer].setVisible(true);
        }

        let lockStatus = this.lockPlayer(this.activePlayer);

		if (this.players[this.activePlayer].isTinted) {
			this.addWormsText(lockStatus);
		} else {
			this.removeWormsText();
        }
    }

    private async buyPlayer(): Promise<void> {
        if (this.worms >= this.activePlayerCost && this.players[this.activePlayer].isTinted) {
            try {
                this.scene.scene.launch('Loading');
                let newWormCount = await FbDataLib.buyCharacter(this.activePlayer, this.activePlayerCost);
                this.worms = newWormCount;

                this.players[this.activePlayer].clearTint();
                this.removeWormsText();

                this.unlockedPlayers = await FbDataLib.loadUnlockedCharacters();

                this.scene.events.emit('bought-character', this.worms);

                this.scene.scene.stop('Loading');

                FBInstant.logEvent('BOUGHT_CHARACTER', this.activePlayerCost);
            } catch (error) {
                console.error('Error buying character.');
            }
        } else {
            console.log('Too expensive or already buyed.');
        }
    }

    private lockPlayer(playerName: PlayerNames): number {
        const color = 0x666666;
        
        if (this.worms == null) {
            let i: number;

            for (i = 2; i < this.players.length + 1; i++) {
                if (this.players[i] != null)
                    this.players[i].setTint(color);
            }

            return -1;
        } else {
            switch (playerName) {
                case PlayerNames.red:
                    this.activePlayerCost = 0;
                    return -1;
                case PlayerNames.redCircle:
                    this.activePlayerCost = 75;
                    break;
                case PlayerNames.blue:
                    this.activePlayerCost = 150;
                    break;
                case PlayerNames.blueCircle:
                    this.activePlayerCost = 200;
                    break;
                case PlayerNames.green:
                    this.activePlayerCost = 250;
                    break;
                case PlayerNames.grey:
                    this.activePlayerCost = 1000;
                    break;
                case PlayerNames.blackWhiteCircle:
                    this.activePlayerCost = 1250;
                    break;
                case PlayerNames.comingSoon:
                    this.players[playerName].setTint(color);
                    return -2;
            }

            return this.checkLockStatus(playerName, color, this.activePlayerCost);
        }
    }

    private checkLockStatus(playerName: PlayerNames, color: number, wormsNeeded: number): number {
        if (this.unlockedPlayers.find(element => element === playerName) === undefined) {
            this.players[playerName].setTint(color);
           
            if (this.worms < wormsNeeded) {
                return wormsNeeded;
            } else {
                return -3;
            }
        }

        return -1;
    }

    private addParticles() {
        let particles = this.scene.add.particles('particle');
        particles.setDepth(3);

        particles.createEmitter({
            speed: 100,
            lifespan: 1000,
            scale: { start: 0.5, end: 0 },
            tint: 0x000000,
            alpha: 0.1,
            quantity: 1,
            frequency: 50,
            bounce: 1,
            x: 0,
            y: 0
        });

        this.add(particles);
    }

    private removeWormsText() {
        if (this.wormsText != null) {
            this.wormsText.destroy();
        }
    }

    private addWormsText(lockStatus: number) {
        let text = this.translate.localise('PLAYER_SWITCH', 'WORMS_NEEDED');

        if (lockStatus > -1) {
            text = `${this.translate.localise('PLAYER_SWITCH', 'CATCH_MORE_1')}` +
                ` ${this.activePlayerCost} ${this.translate.localise('PLAYER_SWITCH', 'CATCH_MORE_2')}`;
        } else if (lockStatus == -2) {
            text = this.translate.localise('PLAYER_SWITCH', 'COMING_SOON');
        } else if (lockStatus == -3) {
            text = this.translate.localise('PLAYER_SWITCH', 'BUY_NOW_1');
            text += this.activePlayerCost;
            text += this.translate.localise('PLAYER_SWITCH', 'BUY_NOW_2');
        }

        if (this.wormsText != null)
            this.wormsText.destroy();

        this.wormsText = new DefaultText(
            this.scene,
            0,
            80,
            text,
            24,
            1
        );

        this.wormsText.setMaxWidth(this.scene.physics.world.bounds.width - 50);
        this.wormsText.setOrigin(0.5, 0.5);
        this.add(this.wormsText);
    }
}