export class VignettePipeline2 extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {

    constructor(game: Phaser.Game) {
        
        super({
            game: game,
            renderer: game.renderer,
            vertShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,
            fragShader: `
                uniform float offset;
                uniform float darkness;
        
                uniform sampler2D tDiffuse;
        
                varying vec2 vUv;
        
                void main() {
                    vec4 texel = texture2D( tDiffuse, vUv );
                    vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );
                    gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );
                }
            `
        });

        this.setFloat1('tDiffuse', null);
        this.setFloat1('offset', 1.0);
        this.setFloat1('darkness', 1.0);
    }
}