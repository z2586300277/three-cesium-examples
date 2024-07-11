// Author:
// Title:

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define iTime u_time
#define iResolution u_resolution

// --------[ Original ShaderToy begins here ]---------- //
#define time iTime
#define PI acos(-1.)
#define TAU (PI * 2.)
#define saturate(x) clamp(x, 0., 1.)
#define SOL 0.
#define VOL 1.

float phase(float x) { return floor(x) + 0.5 + 0.5 * cos(TAU * 0.5 * exp(-5.0 * fract(x))); }

void rot(inout vec2 p, float t) { p = mat2(cos(t), sin(t), -sin(t), cos(t)) * p; }

vec3 pal(float x) { return mix(saturate(sin((vec3(0.333, 0.6666, 0) + x) * TAU)), vec3(1), 0.1); }

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.)) + min(0., max(q.x, max(q.y, q.z)));
}

void U(inout vec4 m, float d, float a, float b, float c) { m = d < m.x ? vec4(d, a, b, c) : m; }

vec4 map(vec3 p) {
    vec3 pos = p;
    // rot(p.xy, 0.2 * pos.z);
    vec4 m = vec4(1, VOL, 0, 0);
    float a = 12.;
    p = mod(p, a) - 0.5 * a;
    vec3 of = vec3(2.8, 1.7, 1.2);
    vec3 ro = vec3(0.3 + 0.1 * sin(phase(time) * 0.2 * TAU), 0.5, 0.4 + 0.05 * sin(phase(time)));
    p -= of;
    for (int i = 0; i < 6; i++) {
        p = abs(p + of) - of;
        rot(p.zy, TAU * ro.x);
        rot(p.xz, TAU * ro.y);
        rot(p.yx, TAU * ro.z);
    }

    U(m, sdBox(p, vec3(1, 1, 1)), SOL, 0.5, 1.);
    U(m, sdBox(p, vec3(0.1, 1.1, 1.1)), VOL, 0.3 + pos.z / 8., saturate(cos(TAU * (pos.z / 8. + time))));
    U(m, sdBox(p, vec3(1.1, 1.1, 0.1)), VOL, 0.8 + pos.z / 8., saturate(cos(TAU * (pos.z / 8. + time))));

    return m;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = vec2(fragCoord.x / iResolution.x, fragCoord.y / iResolution.y);
    uv -= 0.5;
    uv /= vec2(iResolution.y / iResolution.x, 1);

    vec3 col = vec3(0);
    vec3 ro = vec3(0, 0, time * 10.);
    vec3 ray = vec3(uv, 1);

    float t = 0.;
    for (int i = 0; i < 300; i++) {
        vec3 p = ro + t * ray;
        vec4 m = map(p);
        float d = m.x;
        if (m.y == SOL) {
            if (d < 0.001) {
                col += vec3(1) * float(i) * 0.01;
                break;
            }
            t += 0.5 * d;
        } else {
            col += clamp(pal(m.z) * m.w * 0.01 / abs(d), 0.0, 0.3);
            t += 0.25 * abs(d) + 0.01;
        }
    }

    col = mix(vec3(0), col, exp(-0.1 * t));

    col = saturate(col);

    fragColor = vec4(col, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}