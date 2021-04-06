#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float plot(vec2 st, float pct) {
    // performs Hermite interpolation
    // goes from first param to  second based third param
    // returns a value between 0 and 1

    float hw = 0.01;

    return smoothstep(pct - hw, pct, abs(st.y)) -
    smoothstep(pct, pct + hw/1.0, abs(st.y));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    float mouse_x = u_mouse.x/u_resolution.x;

    // float y = smoothstep(0.1, 0.5, st.x);
    // float y = sin(st.x * PI + (u_time * 1.0));1.0/4.0 + 0.5;
    // y = ceil(y) + floor(y);
    // float y = mod(st.x, 0.5);
    // float y = fract(st.x);
    // float y = ceil(st.x);
    // float y = sign(st.x);
    // float y = abs(st.x);
    // float y = clamp(st.x, 0.2, 0.8 + sin(u_time));
    float y = abs(sin(st.x * 10.0));

    vec3 color = vec3(y);

    float pct = plot(st, y);
    color = (1.0 - pct) * color + (pct * vec3(0.0, 1.0, 0.0));

    gl_FragColor = vec4(color, 1.0);
}
