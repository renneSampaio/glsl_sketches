#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TAU 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform sampler2D tex_wave;
uniform vec2 tex_waveResolution;

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

    float aspect = tex_waveResolution.y/tex_waveResolution.x;
    // st.x *= aspect;

    float scale = 0.5;
    float offset = 0.5;

    float angle = noise2D(st + u_time * 0.1) * PI;
    float radius = offset;


    st = st * 2. - 1.;
    st *= scale;
    float r = noise(length(st * 2.));
    st = abs(st);
    st = mod(st, 0.3);

    st = rotate2d(st, r * r * r + TAU -u_time/2.);
    st += u_mouse/u_resolution;
    
    color += texture2D(tex_wave, st).rgb;

    gl_FragColor = vec4(color, 1.0);
}