import { Colors } from "../colors";

const Random = Phaser.Math.Between;

const COLOR_PRIMARY = Colors.GAME_COLORS.BLUE_GREY;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class LeaderboardDialog {

    constructor(public scene: any) {}

    addLeaderboard() {
        var scrollMode = 0; // 0:vertical, 1:horizontal

        var tabs = this.scene.rexUI.add.tabs({
			x: this.scene.physics.world.bounds.centerX,
			y: 300,
			panel: this.scene.rexUI.add.gridTable({
				background: this.scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),
				table: {
					width: 250,
					height: 400,
					cellWidth: 120,
					cellHeight: 60,
					columns: 2,
					mask: {
						padding: 2,
					},
				},
				slider: {
					track: this.scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
					thumb: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
				},
				// scroller: true,
				createCellContainerCallback: function (cell) {
					var scene = cell.scene,
						width = cell.width,
						height = cell.height,
						item = cell.item,
						index = cell.index;

					return scene.rexUI.add.label({
							width: width,
							height: height,
							background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
							icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, item.color),
							text: scene.add.text(0, 0, item.id),
							space: {
								icon: 10,
								left: 15
							}
						});
				},
			}),
			topButtons: [
				this.createButton(this.scene,  'Welt'),
				this.createButton(this.scene, 'Freunde'),
				this.createButton(this.scene, 'X')
			],
			space: {
				topButtonsOffset: 20,
				topButton: 1
			},
		}).layout();

		tabs.on('button.click', function (button, index) {
			// Highlight button
			if (this._prevTypeButton) {
				this._prevTypeButton.getElement('background').setFillStyle(COLOR_DARK)
			}
			button.getElement('background').setFillStyle(COLOR_PRIMARY);
			this._prevTypeButton = button;

			if (index == 2) {
				// @ts-ignore
				tabs.hide();
			}

			// START OF GET ITEMS
			var data = [];
			var startIdx = Random(0, 100);
			for (var i = 0; i < 100; i++) {
				data.push({
					id: startIdx + i,
					color: Random(0, 0xffffff)
				});
			}
			// END OF GET ITEMS

			this.getElement('panel').setItems(data).scrollToTop();
		}, tabs);

		// Grid table
		tabs.getElement('panel')
		.on('cell.click', function (cellContainer, cellIndex) {
			// Clicked text
			// this.print.text += cellIndex + ': ' + cellContainer.text + '\n';
		}, this)
		.on('cell.over', function (cellContainer, cellIndex) {
			cellContainer.getElement('background')
				.setStrokeStyle(2, COLOR_LIGHT)
				.setDepth(1);
		}, this)
		.on('cell.out', function (cellContainer, cellIndex) {
			cellContainer.getElement('background')
				.setStrokeStyle(2, COLOR_DARK)
				.setDepth(0);
		}, this);

		tabs.emitButtonClick('top', 0); // Default

		return tabs;
    }

    getItems(count) {
		var data = [];
		var startIdx = Random(0, 100);
		for (var i = 0; i < count; i++) {
			data.push({
				id: startIdx + i,
				color: Random(0, 0xffffff)
			});
		}
		return data;
	}

	createButton(scene, text) {
		let radius = {
			tl: 20,
			tr: 20
		}

		return scene.rexUI.add.label({
			width: 50,
			height: 40,
			background: scene.rexUI.add.roundRectangle(0, 0, 50, 50, radius, COLOR_DARK),
			text: scene.add.text(0, 0, text, {
				fontSize: '18pt'
			}),
			space: {
				left: 10,
				right: 10
			}
		});
	}
}