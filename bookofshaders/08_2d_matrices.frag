#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TAU 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float box(in vec2 _st, in vec2 _size) {
    _size = vec2(.5) - _size*0.5;

    vec2 uv = smoothstep(_size,_size+vec2(0.001),_st);
    uv *= smoothstep(_size, _size+vec2(0.001), vec2(1.0) - _st);    

    return uv.x * uv.y;
}

float cross(in vec2 _st, in float _size) {
    return box(_st, vec2(_size, _size/4.)) +
           box(_st, vec2(_size/4., _size));
}

mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle),
                sin(_angle), cos(_angle));
}

void main() {
    vec2 st = (gl_FragCoord.xy)/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);
    st -= vec2(0.5);

    vec2 translate = vec2(cos(u_time), sin(u_time));
    st = rotate2d(sin(u_time) * PI) * st;
    st += translate * 0.35;
    st += vec2(0.5);

    color += vec3(st.x, st.y, 0.0);

    color += vec3(cross(st, 0.25));

    gl_FragColor = vec4(color, 1.0);
}