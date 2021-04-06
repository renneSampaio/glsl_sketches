#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float box_step(in vec2 pos, in vec4 boundaries) {
    vec2 bl = step(vec2(1.0) - boundaries.xy, pos);
    vec2 tr = step(vec2(1.0) - boundaries.zw, 1.0 - pos);

    return (bl.x * bl.y * tr.x * tr.y);
}
float box_step_outline(in vec2 pos, in vec4 boundaries, float outline_size) {
    return box_step(pos, boundaries) - box_step(pos, boundaries - outline_size);
}

void main() {
    vec2 st = (gl_FragCoord.xy)/u_resolution;
    vec3 color = vec3(0.0);

    // st.x += sin(u_time) * 0.1;
    // st.y += cos(u_time) * 0.1;

    float bottom = step(0.1, st.y);
    float left = step(0.1, st.x);
    float top = 1.0 - step(0.9, st.y);
    float right = 1.0 - step(0.9, st.x);

    vec2 bl = smoothstep(vec2(0.0), vec2(0.3), st);
    vec2 tr = smoothstep(vec2(0.0), vec2(0.3), 1.0 - st);

    color = vec3(bl.x * bl.y * tr.x * tr.y);
    color = vec3(box_step_outline(st, vec4(0.9), 0.01));
    color += vec3(box_step_outline(st + vec2(0.1, 0.5), vec4(0.7), 0.01));

    gl_FragColor = vec4(color, 1.0);
}