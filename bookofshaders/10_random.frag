#version 330
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

    vec2 uv = smoothstep(_size,_size+vec2(0.1),_st);
    uv *= smoothstep(_size, _size+vec2(0.3), vec2(1.1) - _st);    

    return uv.x * uv.y;
}

float cross(in vec2 _st, in float _size) {
    return box(_st, vec2(_size, _size/4.)) +
           box(_st, vec2(_size/4., _size));
}

float circle(in vec2 _st, in float _radius) {
    vec2 l = _st - vec2(0.5);
    return 1. - smoothstep(_radius - (_radius * 0.01),
                           _radius + (_radius * 0.01),
                           dot(l, l) * 4.);
}

vec2 rotate2d(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), -sin(_angle),
                sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 st = (gl_FragCoord.xy)/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);

    vec2 st1 = st * vec2(10., 100.) + vec2(0.0, 1.0);

    st1.x += random(floor(st1.yy)) + ((u_time) * random(floor(st1.yy)) * 20.);


    vec2 ipos1 = floor(st1.xx);
    vec2 fpos1 = fract(st1.yy);

    float rnd = random(ipos1);
    rnd = step(0.1 + 0.8 * u_mouse.x/u_resolution.x, rnd);

    color = 1. - vec3(rnd) * (step(distance(fpos1.y - 0.5, 0.5), 0.8));
    // color = vec3(fpos1, 1.0);

    gl_FragColor = vec4(color, 1.0);
}