const Random = Phaser.Math.Between;

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class LeaderboardDialog {

    constructor(public scene: Phaser.Scene) {}

    addLeaderboard() {
        var scrollMode = 0; // 0:vertical, 1:horizontal
		// @ts-ignore
        var gridTable = this.scene.rexUI.add.gridTable({
            x: this.scene.physics.world.bounds.centerX,
            y: 300,
            width: 300,
            height: 420,

            scrollMode: scrollMode,

			// @ts-ignore
			background: this.scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

            table: {
                cellWidth: undefined,
                cellHeight: 60,

                columns: 1,

                mask: {
                    padding: 0,
                },

                reuseCellContainer: true,
            },

            slider: {
				// @ts-ignore
				track: this.scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
				// @ts-ignore
                thumb: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },

			// @ts-ignore
            header: this.scene.rexUI.add.label({
                width: undefined,
                height: 30,
				orientation: scrollMode,
				// @ts-ignore
                background: this.scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
                text: this.scene.add.text(0, 0, 'Bestenliste'),
            }),

			// @ts-ignore
            footer: this.scene.rexUI.add.label({
                width: undefined,
                height: 30,
				orientation: scrollMode,
				// @ts-ignore
                background: this.scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
                text: this.scene.add.text(0, 0, 'Top 100'),
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                table: 10,
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: (cell, cellContainer) => {
                var scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
					index = cell.index;
					
                if (cellContainer === null) {
                    cellContainer = scene.rexUI.add.label({
                        width: width,
                        height: height,
                        orientation: scrollMode,
                        background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                        icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                        text: scene.add.text(0, 0, ''),

                        space: {
                            icon: 10,
                            left: 15,
                            top: 0,
                        }
                    });
                    console.log(cell.index + ': create new cell-container');
                } else {
                    console.log(cell.index + ': reuse cell-container');
                }

                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo
                cellContainer.getElement('text').setText(item.id); // Set text of text object
                cellContainer.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
                return cellContainer;
            },
            items: this.getItems(10)
		}).layout();

		gridTable
		.on('cell.over', function (cellContainer, cellIndex) {
			cellContainer.getElement('background')
				.setStrokeStyle(2, COLOR_LIGHT)
				.setDepth(1);
		}, this)
		.on('cell.out', function (cellContainer, cellIndex) {
			cellContainer.getElement('background')
				.setStrokeStyle(2, COLOR_DARK)
				.setDepth(0);
		}, this)
        //.drawBounds(this.add.graphics(), 0xff0000);
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
}