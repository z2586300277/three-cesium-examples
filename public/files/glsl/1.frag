// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI	 	= 3.14159265358;
const float EPSILON	= 1e-3;
#define  EPSILON_NRM	(0.5 / u_resolution.x)
const int NUM_STEPS = 6;
const int ITER_GEOMETRY = 2;
const int ITER_FRAGMENT =5;
const float SEA_HEIGHT = 0.5;
const float SEA_CHOPPY = 3.0;
const float SEA_SPEED = 1.9;
const float SEA_FREQ = 0.24;
const vec3 SEA_BASE = vec3(0.11,0.19,0.22);
const vec3 SEA_WATER_COLOR = vec3(0.55,0.9,0.7);
#define SEA_TIME (iTime * SEA_SPEED)
mat2 octave_m = mat2(1.7,1.2,-1.2,1.4);
const float KEY_SP    = 32.5/256.0;
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
mat3 fromEuler(vec3 ang) {
	vec2 a1 = vec2(sin(ang.x),cos(ang.x));
    vec2 a2 = vec2(sin(ang.y),cos(ang.y));
    vec2 a3 = vec2(sin(ang.z),cos(ang.z));
    mat3 m;
    m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
	m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
	m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
	return m;
}
float hash( vec2 p ) {
    float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*83758.5453123);
}

float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
    vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( 
                mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), 
                        u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), 
                        u.x), 
                u.y);
}
float diffuse(vec3 n,vec3 l,float p) {
    return pow(dot(n,l) * 0.4 + 0.6,p);
}
float specular(vec3 n,vec3 l,vec3 e,float s) {    
    float nrm = (s + 8.0) / (3.1415 * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

vec3 getSkyColor(vec3 e) {
    e.y = max(e.y,0.0);
    vec3 ret;
    ret.x = pow(1.0-e.y,2.0);
    ret.y = 1.0-e.y;
    ret.z = 0.6+(1.0-e.y)*0.4;
    return ret;
}

float sea_octave(vec2 uv, float choppy) {
    uv += noise(uv);
    vec2 wv = 1.0-abs(sin(uv)); 
    vec2 swv = abs(cos(uv));  
    wv = mix(wv,swv,wv);
    return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
}
float map(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_GEOMETRY; i++) {
    	d = sea_octave((uv+u_time)*freq,choppy);
        h += d * amp; 
    	uv *=  octave_m;   
        freq *= 1.9; // bteitler: Exponentially increase frequency every iteration (on top of our permutation)
        amp *= 0.22; // bteitler: Lower the amplitude every frequency, since we are adding finer and finer detail
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}
float map_detailed(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    float d, h = 0.0;    
    for(int i = 0; i < ITER_FRAGMENT; i++) {
    	d = sea_octave((uv+u_time)*freq,choppy);
    	d += sea_octave((uv-u_time)*freq,choppy);
        h += d * amp; 
    	uv *= octave_m/1.2;
        freq *= 1.9; // bteitler: Exponentially increase frequency every iteration (on top of our permutation)
        amp *= 0.22; // bteitler: Lower the amplitude every frequency, since we are adding finer and finer detail
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}
vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
    float fresnel = 1.0 - max(dot(n,-eye),0.0);
    fresnel = pow(fresnel,3.0) * 0.45;
    vec3 reflected = getSkyColor(reflect(eye,n))*0.99;    
    vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.27; 
    vec3 color = mix(refracted,reflected,fresnel);
    float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
    color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.15 * atten;
    color += vec3(specular(n,l,eye,90.0))*0.5;
    return color;
}
vec3 getNormal(vec3 p, float eps) {
    vec3 n;
    n.y = map_detailed(p); // bteitler: Detailed height relative to surface, temporarily here to save a variable?
    n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y; // bteitler approximate X gradient as change in height along X axis delta
    n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y; // bteitler approximate Z gradient as change in height along Z axis delta
    n.y = eps; 
    return normalize(n);
}
float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
    float tm = 0.0;
    float tx = 500.0; 
    float hx = map(ori + dir * tx);
    if(hx > 0.0) return tx;   
    float hm = map(ori + dir * tm); 
    float tmid = 0.0;
    for(int i = 0; i < NUM_STEPS; i++) { 
        tmid = mix(tm,tx, hm/(hm-hx));
        p = ori + dir * tmid; 
                  
    	float hmid = map(p); 
        if(hmid < 0.0) { 
            tx = tmid;
            hx = hmid;
        } else {
            tm = tmid;
            hm = hmid;
        }
    }
    return tmid;
}

// main
void main( ) {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0; 
    uv.x *= u_resolution.x / u_resolution.y; 
    float time = u_time * 2.7;
    float roll = PI + sin(u_time)/14.0 + cos(u_time/2.0)/14.0 ;
    float pitch = PI*1.021 + (sin(u_time/2.0)+ cos(u_time))/40.0 
        + (1./u_resolution.y - .8)*PI/3.0  ;
    float yaw = 1./u_resolution.x * PI * 4.0;
    vec3 ang = vec3(roll,pitch,yaw);
    vec3 ori = vec3(0.0,3.5,time*3.0);
    vec3 dir = normalize(vec3(uv.xy,-1.6)); 
    dir = normalize(dir) * fromEuler(ang);
    vec3 p;
    heightMapTracing(ori,dir,p);
    vec3 dist = p - ori;
    vec3 n = getNormal(p,  dot(dist,dist)  * EPSILON_NRM  );
    vec3 light = normalize(vec3(0.0,1.0,0.8)); 
    vec3 seaColor = getSeaColor(p,n,light,dir,dist);
    vec3 color =seaColor;
    gl_FragColor = vec4(pow(color,vec3(0.75)), 1.0);

    



}