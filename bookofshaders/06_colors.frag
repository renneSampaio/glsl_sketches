#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

vec3 colorA = vec3(0.149, 0.141, 0.912);
vec3 colorB = vec3(1.000, 0.0, 0.0);

float plot(vec2 st, float pct) {
    return smoothstep(pct - 0.01, pct, st.x) - smoothstep(pct, pct+0.01, st.x);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.y);

    pct.g = smoothstep(0.0, 0.9, st.y);
    pct.r = 1.0 - sin(st.y * PI);
    pct.b = sin(st.y * PI);

    color = mix(colorA, colorB, pct);

    color = mix(color, vec3(1.0, 0.0, 0.0), plot(st, pct.r));
    color = mix(color, vec3(0.0, 1.0, 0.0), plot(st, pct.g));
    color = mix(color, vec3(0.0, 0.0, 1.0), plot(st, pct.b));

	gl_FragColor = vec4(color, 1.0);
}