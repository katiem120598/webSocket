#ifdef GL_ES
precision mediump float;
#endif

// Define constant values
#define TAU 6.2831853071
#define THICKNESS 0.25

// Define uniforms that can be passed to this shader.
// We will use 'book of shaders' naming convention.
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_waveform_tex;
uniform sampler2D u_spectrum_tex;

void main() {
    // Normalized coordinates
    vec2 n = gl_FragCoord.xy / u_resolution.xy;

    // Map the location of this pixel to the uniform textures.
    // This will give us the values of the waveform and spectrum
    // as vec4s. 
    vec4 wave = texture2D(u_waveform_tex, n);
    vec4 spec = texture2D(u_spectrum_tex, n);



    // Now let's play with these values! 

    // // Render waveform as vertical bars
    // float g = wave.x;
    // vec4 clr = vec4(g, g, g, 1.0)

    // // Same, but snapped to B&W
    // float v = wave.x;
    // float g = step(0.5, v);
    // vec4 clr = vec4(g, g, g, 1.0);

    // // Same, but with a slight gray inerpolation between [.4,.6]
    // float v = wave.x;
    // float g = smoothstep(.4, .6, v);
    // vec4 clr = vec4(g, g, g, 1.0);
    
    // // Render the wave form as a "thick" wave
    // float v = wave.x;
    // float g = min(smoothstep(v - THICKNESS, v, n.y), smoothstep(v + THICKNESS, v, n.y));
    // vec4 clr = vec4(g, g, g, 1.0);
    
    // // Render spectrum as full vertical bars
    // float g = spec.x;
    // vec4 clr = vec4(g, g, g, 1.0);

    // // Render spectrum as sharp vertical bars with value height
    // float v = spec.x;
    // float g = 1.0 - step(v, n.y);
    // vec4 clr = vec4(g, g, g, 1.0);

    // // Render spectrum as thick wave with value height
    // float v = spec.x;
    // float g = min(smoothstep(v - THICKNESS, v, n.y), smoothstep(v + THICKNESS, v, n.y));
    // vec4 clr = vec4(g, g, g, 1.0);

    // Combine the two waves! 
    float wv = wave.x;
    float wg = min(smoothstep(wv - THICKNESS, wv, n.y), smoothstep(wv + THICKNESS, wv, n.y));
    float sv = spec.x;
    float sg = min(smoothstep(sv - THICKNESS, sv, n.y), smoothstep(sv + THICKNESS, sv, n.y));
    vec4 clr = vec4(wg, sg, 0.0, 1.0);



    // Output the color
    gl_FragColor = clr;
}
