#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
    float mouse_x = u_mouse.x/u_resolution.x;
    float mouse_y = u_mouse.y/u_resolution.y;

    vec2 st = (gl_FragCoord.xy)/u_resolution;

    gl_FragColor = vec4(st.x, st.y, 1.0, 1.0);
}