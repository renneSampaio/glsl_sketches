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

    float num_div = 10.;
    
    a += sin(r * 10. + a*10.) + r * 10. + (u_time/num_div);

    float f = 0.0;
    // float f = (sin(a*(num_div)));
    // f = abs(cos(a * num_div + sin(u_time) * 3.14)) * .5 - 0.1;
    f += abs(cos(a * 2.) * sin(a*2. + u_time)) * .8 - 0.1;
    f *= smoothstep(-0.5, 1.0, cos(a*10. + u_time + r*r)) * 0.2 + 0.1;

    // f *= step(r, 1.2);

    color = vec3((1. - (smoothstep(f, f+0.9, r))));

    gl_FragColor = vec4(color, 1.0);
}