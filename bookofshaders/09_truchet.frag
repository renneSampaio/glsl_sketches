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

vec2 tile(vec2 _st, float _zoom) {
    return fract(_st * _zoom);
}

vec2 rotateTilePattern(vec2 _st) {
    _st *= 2.0;

    float index = 0.0;
    index += step(1., mod(_st.x, 2.0));
    index += step(1., mod(_st.y, 2.0)) * 2.0;

    _st = fract(_st);

    // if (index == 1.0) {
    //     _st = rotate2d(_st, PI * 0.5);
    // }
    // else if (index == 2.0) {
    //     _st = rotate2d(_st, PI * -0.5);
    // }
    // else if (index == 3.0) {
    //     _st = rotate2d(_st, PI);
    // }
    _st = rotate2d(_st, u_time + ((_st.y+pow(index, 10.))/(_st.y + 0.1) * TAU));

    return _st;
}

vec2 brick_tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    _st.x += step(1.0, mod(_st.y, 2.0)) * 0.5;
    // _st.x += step(1.0, mod(_st.y, 2.0)) * step(fract(u_time/2.0), 0.5) * u_time;
    // _st.x += step(mod(_st.y, 2.0), 1.0) * step(fract(u_time/2.0), 0.5) * -u_time;
    // _st.y += step(1.0, mod(_st.x, 2.0)) * step(fract((u_time + 1.)/2.0), 0.5) * u_time;
    // _st.y += step(mod(_st.x, 2.0), 1.0) * step(fract((u_time + 1.)/2.0), 0.5) * -u_time;
    return fract(_st);
}

void main() {
    vec2 st = (gl_FragCoord.xy)/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);

    // st = brick_tile(st, 1.);
    st = rotateTilePattern(st);
    vec2 st2 = rotate2d(st, 1./1. * TAU + u_time);
    vec2 st3 = rotate2d(st, 1./(8. + abs(sin(u_time)) * 10.) * TAU + length(st2 - 0.5));

    color += cross(st, vec2(0.7).x);// - cross(st, 1.2);
    color += fract(box(st2, vec2(0.8)));
    // color -= box(st3, vec2(0.4));

    gl_FragColor = vec4(color, 1.0);
}