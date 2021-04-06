#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
    vec2 st = (gl_FragCoord.xy)/u_resolution;
    vec3 color = vec3(0.0);

    float dist = distance(st +0.1 * vec2(sin(u_time), cos(u_time)), vec2(0.5)) * 2.0;

    dist = smoothstep(0.8, 0.99, dist) - smoothstep(1.1, 1.5, dist);

    color = vec3(1.0 - dist);

    gl_FragColor = vec4(color, 1.0);
}