#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
    float freq = 2.0;
    float amp = 10.0;
    float phase = 0.0;
    float t = sin((u_time + phase)* freq)/2.0 + 0.5;
    t *= amp;
    // t = 0.1;
	gl_FragColor = vec4(t, t, t, 1.0);
}