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
vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}
float rand(float x) {
    return fract(sin(dot(vec2(x,x), vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(rand(i), rand(i+1), smoothstep(0, 1, f)) * 2.0 - 1.;
}

float noise2D(in vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);

    // vec2 u = smoothstep(0, 1, f);
    vec2 u = f*f*f*(f*(f*6 - 15) + 10);

    return mix( mix( dot( random2(i + vec2(0, 0)), f - vec2(0, 0)),
                     dot( random2(i + vec2(1, 0)), f - vec2(1, 0)), u.x ),
                mix( dot( random2(i + vec2(0, 1)), f - vec2(0, 1)),
                     dot( random2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}

#define OCTAVES 6
float fbm(in vec2 st) {
    float v = 0.0;
    float amplitude = 1;
    float frequency = 2;

    for (int i = 0; i < OCTAVES; i++) {
        v += amplitude * pow(abs(noise2D(st + u_time * OCTAVES/100.)), 1);
        st *= frequency;
        amplitude *= 0.5;
    }

    return v;
}

float fbm2(in vec2 st) {
    float v = 0.0;
    float amplitude = 1;
    float frequency = 2;
    vec2 shift = vec2(100., 0.);

    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5),cos(0.5));

    for (int i = 0; i < OCTAVES; i++) {
        v += amplitude * noise2D(st);
        st = rot * st * frequency + shift;
        amplitude *= 0.5;
    }

    return v;
}

void main() {
    vec2 st = (gl_FragCoord.xy)/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);
    // st = st * 2. - 1.0;

    vec2 q = vec2(0.);
    q.x = fbm2(st + 0.0 * u_time);
    q.y = fbm2(st + vec2(1));
    
    vec2 r = vec2(0.);
    r.x = fbm2(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm2(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

    float f = fbm(st + r);

    color = mix(vec3(0.101961, 0.619608, 0.666667),
                vec3(0.666667, 0.666667, 0.498039),
                clamp((f*f) *4, 0.0, 1.0));
    
    color = mix(color,
                vec3(0.0,0.0,0.164706),
                clamp(length(q), 0.0, 1.0));
    
    color = mix(color,
                vec3(0.66667, 1.0, 1.0),
                clamp(length(r.x),0.0, 1.0));

    // color += f;

    gl_FragColor = vec4((f*f*f + 0.6 * f*f + .5 * f) * color, 1.0);
}