export class VignettePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {

    constructor(game: Phaser.Game) {
        
        super({
            game: game,
            renderer: game.renderer,
            vertShader: `
                attribute vec2 aVertexPosition;
                attribute vec2 aTextureCoord;
                uniform mat3 projectionMatrix;
                varying vec2 vTextureCoord;
                void main(void)
                {
                    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                    vTextureCoord = aTextureCoord;
                }
            `,
            fragShader: `
                precision mediump float;
                uniform sampler2D uSampler;
                uniform float time;
                uniform float alpha;
                uniform float size;
                uniform float amount;
                varying vec2 vTextureCoord;
        
                void main(void) {
                    vec4 color = texture2D(uSampler, vTextureCoord);
            
                    float dist = distance(vTextureCoord, vec2(0.5, 0.5));
            
                    color.rgb *= smoothstep(0.8, size * 1.0 * 0.799, dist * (alpha * amount + size));
                    gl_FragColor = color;
                }
            `
        });

        this.setFloat1('alpha', 1.0);
        this.setFloat1('size', 1);
        this.setFloat1('amount', 1);
    }
}