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
    float r = 0.0;
    float a = 0.0;
    st = st * 2. - 1.;

    r = length(st);
    a = atan(st.y, st.x);

    float num_div = 1.;
    
    a += sin(r * 10. + a*2.) + r * 5. + (u_time/num_div);

    float f = (sin(a*(num_div)));

    color = vec3((1. - smoothstep(f, f+0.9, r)));

    gl_FragColor = vec4(color, 1.0);
}