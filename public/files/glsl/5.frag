// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
// CC0: AI not included
// Tinkering around with old shaders.
// No AI and very little human intelligence used ;)

#define TIME            u_time
#define RESOLUTION      u_resolution
#define PI              3.141592654
#define TAU             (2.0*PI)

// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
  return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}
// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
//  Macro version of above to enable compile-time constants
#define HSV2RGB(c)  (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))

const float hoff = 0.58;
const vec3 dbcol = HSV2RGB(vec3(hoff+0.96, 0.8, 0.75));
const vec3 sbcol = HSV2RGB(vec3(hoff+0.95, 0.4, 1.0));
const vec3 gbcol = HSV2RGB(vec3(hoff+0.98, 0.9, 0.001));
const vec3 fbcol = HSV2RGB(vec3(hoff+0.95, 0.7, 2.0));

// License: Unknown, author: Claude Brezinski, found: https://mathr.co.uk/blog/2017-09-06_approximating_hyperbolic_tangent.html
float tanh_approx(float x) {
  //  Found this somewhere on the interwebs
  //  return tanh(x);
  float x2 = x*x;
  return clamp(x*(27.0 + x2)/(27.0+9.0*x2), -1.0, 1.0);
}

// License: Unknown, author: Matt Taylor (https://github.com/64), found: https://64.github.io/tonemapping/
vec3 aces_approx(vec3 v) {
  v = max(v, 0.0);
  v *= 0.6;
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.0, 1.0);

}

// License: MIT, author: Inigo Quilez, found: https://www.iquilezles.org/www/articles/smin/smin.htm
float pmin(float a, float b, float k) {
  float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}

// License: CC0, author: Mårten Rånge, found: https://github.com/mrange/glsl-snippets
float pabs(float a, float k) {
  return -pmin(a, -a, k);
}

float dot2(vec2 p) {
  return dot(p, p);
}

// License: MIT, author: Inigo Quilez, found: https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float heart(vec2 p) {
  p.x = pabs(p.x, 0.05);

  if( p.y+p.x>1.0 )
      return sqrt(dot2(p-vec2(0.25,0.75))) - sqrt(2.0)/4.0;
  return sqrt(min(dot2(p-vec2(0.00,1.00)),
                  dot2(p-0.5*max(p.x+p.y,0.0)))) * sign(p.x-p.y);
}

float df(vec2 p) {
  vec2 hp = p;
  const float hz = 1.0;
  hp /= hz;
  hp.y -= -0.6;
  float d = heart(hp)*hz;
  return d;
}

float hf(vec2 p) {
  float d = df(p);
  float h = (-20.0*d);
  h = tanh_approx(h);
  h -= 3.0*length(p);
  h = pmin(h, 0.0, 1.);
  h *= 0.25;
  return h;
}

vec3 nf(vec2 p) {
  vec2 v;
  vec2 w;
  vec2 e = vec2(4.0/RESOLUTION.y, 0);
  
  vec3 n;
  n.x = hf(p + e.xy) - hf(p - e.xy);
  n.y = hf(p + e.yx) - hf(p - e.yx);
  n.z = 2.0*e.x;
  
  return normalize(n);
}

vec2 hash(vec2 p) {
  p = vec2(dot (p, vec2 (127.1, 311.7)), dot (p, vec2 (269.5, 183.3)));
  return -1. + 2.*fract (sin (p)*43758.5453123);
}

float noise(vec2 p) {
  const float K1 = .366025404;
  const float K2 = .211324865;

  vec2 i = floor (p + (p.x + p.y)*K1);
    
  vec2 a = p - i + (i.x + i.y)*K2;
  vec2 o = step (a.yx, a.xy);    
  vec2 b = a - o + K2;
  vec2 c = a - 1. + 2.*K2;

  vec3 h = max (.5 - vec3 (dot (a, a), dot (b, b), dot (c, c) ), .0);

  vec3 n = h*h*h*h*vec3 (dot (a, hash (i + .0)),dot (b, hash (i + o)), dot (c, hash (i + 1.)));

  return dot (n, vec3 (70.));
}

float fbm(vec2 pos, float tm) {
  vec2 offset = vec2(cos(tm), sin(tm*sqrt(0.5)));
  float aggr = 0.0;
    
  aggr += noise(pos);
  aggr += noise(pos + offset) * 0.5;
  aggr += noise(pos + offset.yx) * 0.25;
  aggr += noise(pos - offset) * 0.125;
  aggr += noise(pos - offset.yx) * 0.0625;
    
  aggr /= 1.0 + 0.5 + 0.25 + 0.125 + 0.0625;
    
  float f = (aggr * 0.5) + 0.5;
  
  return f;
}

float divf(float offset, float f) {
  const float goff = 0.2;
  const float gfloor = 0.001;
  float r = abs(goff + offset - f);
  r = max(r, gfloor);
  return r;
}

vec3 lightning(vec2 pos, vec2 pp, float offset) {
  vec3 sub = 0.03*vec3(0.0, 1.0, 2.0).zyx*length(pp);

  float time = TIME+123.4;
  float stime = time/200.0;
  vec3 col = vec3(0.0);
  vec2 f = 10.0*cos(vec2(sqrt(0.5), 1.0)*stime)+vec2(0.0, -11.0)*stime;
  const float glow = 0.0125;
  const float goff = 0.2;
  const float gfloor = 0.001;
  for (float i = 0.0; i < 3.0; ++i) {
    vec3 gcol0 = (1.0+cos(0.50*vec3(0.0, 1.0, 2.0) +time+3.0*pos.x-0.33*i));
    vec3 gcol1 = (1.0+cos(1.25*vec3(0.0, 1.0, 2.0) +2.*time+pos.y+0.25*i));
    float btime = stime*85.0 + (i);
    float rtime = stime*75.0 + (i);
    float div1 = divf(offset, fbm((pos + f) * 3.0, rtime));
    float div2 = divf(offset, fbm((pos + f) * 2.0, btime));
    float d1 = offset * glow / div1;
    float d2 = offset * glow / div2;
    col += (d1 * gcol0)-sub;
    col += (d2 * gcol1)-sub;
  }
    
  return col;
}

vec3 effect(vec2 p, vec2 pp) {
  float aa = 4.0/RESOLUTION.y;
  float d = df(p);
  float h = hf(p);
  vec3 n = nf(p);
  const vec3 lp = vec3(-4.0, -5.0, 3.0);
  const vec3 ro = vec3(0.0, 0.0, 10.0);
  vec3 p3 = vec3(p, h); 
  vec3 rd = normalize(p3-ro);
  vec3 ld = normalize(lp-p3);
  vec3 r = reflect(rd, n);
  float diff = max(dot(ld, n), 0.0);
  vec3 dcol = dbcol*mix(vec3(0.15), vec3(1.0), diff);
  float spe = pow(max(dot(ld, r), 0.0), 3.0);
  vec3 scol = spe*sbcol;
  float gd = d+0.0;
  vec2 gp = p;
  vec3 gcol = lightning(gp, pp, gd);
  vec3 hcol = dcol;
  hcol += scol;
  vec3 col = vec3(0.0);
  col += gbcol/max(0.01*(dot2(p)-0.15), 0.0001);
  col += gcol;
  col = mix(col, hcol, smoothstep(0.0, -aa, d));
  col = mix(col, fbcol, smoothstep(0.0, -aa, abs(d+0.01)-0.01));
  col *= smoothstep(1.75, 0.5, length(pp));

  col = aces_approx(col); 
  col = sqrt(col); 
  return col;
}

void main() {
  vec2 q = gl_FragCoord.xy/RESOLUTION.xy;
  vec2 p = -1. + 2. * q;
  vec2 pp = p;
  p.x *= RESOLUTION.x/RESOLUTION.y;
  vec3 col = effect(p, pp); 
  gl_FragColor = vec4(col.xyz, 1.0);
}
