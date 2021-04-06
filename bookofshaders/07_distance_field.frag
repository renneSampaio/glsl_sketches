#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
    vec2 st = (gl_FragCoord.xy)/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);
    float d = 0.0;

    st = st * 2. - 1.;

    d = length(max(abs(st) - .3, 0.0)) * abs(cos(u_time));
    d += length(min(abs(st)- .2,.0)) * sin(u_time);

    color = vec3(fract(d*10.0));
    color = vec3(step(0.2, d) * step(d, 0.4));
    // color = vec3(smoothstep(0.15, .2, d) * smoothstep(0.85, 0.2, d));

    gl_FragColor = vec4(color, 1.0);
}