export class Vignette {

    constructor(public scene: Phaser.Scene) {
        if (!scene.textures.exists('gradient')) {
            const width = scene.physics.world.bounds.width;
            const height = scene.physics.world.bounds.height;
    
            const texture = scene.textures.createCanvas(
                'gradient',
                width,
                height
            );
            const context = texture.getContext();
            
            var grd = context.createRadialGradient(
                width / 2,
                height / 2,
                height * 0.1,
                width / 2,
                height / 2,
                height / 2
            );
            grd.addColorStop(0, 'rgba(0,0,0,0)');
            grd.addColorStop(1, 'rgba(0,0,0,0.3)');
    
            context.fillStyle = grd;
            context.fillRect(0, 0, width, height);
    
            texture.refresh();
        }
    }

    add() {
        const vignette = this.scene.add.sprite(
            this.scene.physics.world.bounds.centerX,
            this.scene.physics.world.bounds.centerY,
            'gradient'
        );
        vignette.setDepth(5);
    }
}