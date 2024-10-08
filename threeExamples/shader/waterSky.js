import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' 

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50,DOM.clientWidth / DOM.clientHeight, 0.1, 100000)
camera.position.set(10,10,10)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true, logarithmicDepthBuffer: true  })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
renderer.setPixelRatio( window.devicePixelRatio * 2)
renderer.setClearColor( 0x000000 )
DOM.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const uniforms = {
    Mouse: {
        type: 'v2',
        value: new THREE.Vector2(0, 0)
    },
    Resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    Time: {
        type: 'f',
        value: 1.0
    }
}
DOM.addEventListener('mousemove',(event) => uniforms.Mouse.value = new THREE.Vector2(
    (event.offsetX / event.target.clientWidth) * 2 - 1,
    -(event.offsetY /  event.target.clientHeight) * 2 + 1
))
const geometry = new THREE.PlaneGeometry( 10, 10 );

var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: `
    void main() {
        gl_Position = vec4( position, 1.0 );
    }
    `,
    fragmentShader: `
    uniform vec2 Mouse;
    uniform vec2 Resolution;
    uniform float Time;

    const float DRAG_MULT = 0.048;
    const int ITERATIONS_RAYMARCH = 13;
    const int ITERATIONS_NORMAL = 48;


    vec2 wavedx(vec2 position, vec2 direction, float speed, float frequency, float timeshift) {
        float x = dot(direction, position) * frequency + timeshift * speed;
        float wave = exp(sin(x) - 1.0);
        float dx = wave * cos(x);
        return vec2(wave, -dx);
    }

    float getwaves(vec2 position, int iterations){
        float iter = 0.0;
        float phase = 6.0;
        float speed = 2.0;
        float weight = 1.0;
        float w = 0.0;
        float ws = 0.0;
        for(int i=0;i<iterations;i++){
            vec2 p = vec2(sin(iter), cos(iter));
            vec2 res = wavedx(position, p, speed, phase, Time);
            position += p * res.y * weight * DRAG_MULT;
            w += res.x * weight;
            iter += 12.0;
            ws += weight;
            weight = mix(weight, 0.0, 0.2);
            phase *= 1.18;
            speed *= 1.07;
        }
        return w / ws;
    }

    float raymarchwater(vec3 camera, vec3 start, vec3 end, float depth){
        vec3 pos = start;
        float h = 0.0;
        float hupper = depth;
        float hlower = 0.0;
        vec2 zer = vec2(0.0);
        vec3 dir = normalize(end - start);
        for(int i=0;i<318;i++){
            h = getwaves(pos.xz * 0.1, ITERATIONS_RAYMARCH) * depth - depth;
            if(h + 0.01 > pos.y) {
                return distance(pos, camera);
            }
            pos += dir * (pos.y - h);
        }
        return -1.0;
    }

    float H = 0.0;
    vec3 normal(vec2 pos, float e, float depth){
        vec2 ex = vec2(e, 0);
        H = getwaves(pos.xy * 0.1, ITERATIONS_NORMAL) * depth;
        vec3 a = vec3(pos.x, H, pos.y);
        return normalize(cross((a-vec3(pos.x - e, getwaves(pos.xy * 0.1 - ex.xy * 0.1, ITERATIONS_NORMAL) * depth, pos.y)), 
                            (a-vec3(pos.x, getwaves(pos.xy * 0.1 + ex.yx * 0.1, ITERATIONS_NORMAL) * depth, pos.y + e))));
    }
    mat3 rotmat(vec3 axis, float angle)
    {
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s, 
        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s, 
        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
    }

    vec3 getRay(vec2 uv){
        uv = (uv * 2.0 - 1.0) * vec2(Resolution.x / Resolution.y, 1.0);
        vec3 proj = normalize(vec3(uv.x, uv.y, 1.0) + vec3(uv.x, uv.y, -1.0) * pow(length(uv), 2.0) * 0.05);	
        if(Resolution.x < 600.0) return proj;
        vec3 ray = rotmat(vec3(0.0, -1.0, 0.0), 3.0 * ((Mouse.x + 0.5) * 2.0 - 1.0)) * rotmat(vec3(1.0, 0.0, 0.0), 0.5 + 1.5 * ((Mouse.y * 1.5) * 2.0 - 1.0)) * proj;
        return ray;
    }

    float intersectPlane(vec3 origin, vec3 direction, vec3 point, vec3 normal)
    { 
        return clamp(dot(point - origin, normal) / dot(direction, normal), -1.0, 9991999.0); 
    }

    vec3 extra_cheap_atmosphere(vec3 raydir, vec3 sundir){
        sundir.y = max(sundir.y, -0.07);
        float special_trick = 1.0 / (raydir.y * 1.0 + 0.1);
        float special_trick2 = 1.0 / (sundir.y * 11.0 + 1.0);
        float raysundt = pow(abs(dot(sundir, raydir)), 2.0);
        float sundt = pow(max(0.0, dot(sundir, raydir)), 8.0);
        float mymie = sundt * special_trick * 0.2;
        vec3 suncolor = mix(vec3(1.0), max(vec3(0.0), vec3(1.0) - vec3(5.5, 13.0, 22.4) / 22.4), special_trick2);
        vec3 bluesky= vec3(5.5, 13.0, 22.4) / 22.4 * suncolor;
        vec3 bluesky2 = max(vec3(0.0), bluesky - vec3(5.5, 13.0, 22.4) * 0.002 * (special_trick + -6.0 * sundir.y * sundir.y));
        bluesky2 *= special_trick * (0.24 + raysundt * 0.24);
        return bluesky2 * (1.0 + 1.0 * pow(1.0 - raydir.y, 3.0)) + mymie * suncolor;
    } 
    vec3 getatm(vec3 ray){
        return extra_cheap_atmosphere(ray, normalize(vec3(1.0))) * 0.5;
        
    }

    float sun(vec3 ray){
        vec3 sd = normalize(vec3(1.0));   
        return pow(max(0.0, dot(ray, sd)), 528.0) * 110.0;
    }
    vec3 aces_tonemap(vec3 color){	
        mat3 m1 = mat3(
            0.59719, 0.07600, 0.02840,
            0.35458, 0.90834, 0.13383,
            0.04823, 0.01566, 0.83777
        );
        mat3 m2 = mat3(
            1.60475, -0.10208, -0.00327,
            -0.53108,  1.10813, -0.07276,
            -0.07367, -0.00605,  1.07602
        );
        vec3 v = m1 * color;    
        vec3 a = v * (v + 0.0245786) - 0.000090537;
        vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
        return pow(clamp(m2 * (a / b), 0.0, 1.0), vec3(1.0 / 2.2));	
    }
    void main()
    {
        vec2 uv = gl_FragCoord.xy / Resolution.xy;
        
        float waterdepth = 2.1;
        vec3 wfloor = vec3(0.0, -waterdepth, 0.0);
        vec3 wceil = vec3(0.0, 0.0, 0.0);
        vec3 orig = vec3(0.0, 2.0, 0.0);
        vec3 ray = getRay(uv);
        float hihit = intersectPlane(orig, ray, wceil, vec3(0.0, 1.0, 0.0));
        if(ray.y >= -0.01){
            vec3 C = getatm(ray) * 2.0 + sun(ray);
            //tonemapping
            C = aces_tonemap(C);
            gl_FragColor = vec4( C,1.0);   
            return;
        }
        float lohit = intersectPlane(orig, ray, wfloor, vec3(0.0, 1.0, 0.0));
        vec3 hipos = orig + ray * hihit;
        vec3 lopos = orig + ray * lohit;
        float dist = raymarchwater(orig, hipos, lopos, waterdepth);
        vec3 pos = orig + ray * dist;

        vec3 N = normal(pos.xz, 0.001, waterdepth);
        vec2 velocity = N.xz * (1.0 - N.y);
        N = mix(vec3(0.0, 1.0, 0.0), N, 1.0 / (dist * dist * 0.01 + 1.0));
        vec3 R = reflect(ray, N);
        float fresnel = (0.04 + (1.0-0.04)*(pow(1.0 - max(0.0, dot(-N, ray)), 5.0)));
        
        vec3 C = fresnel * getatm(R) * 2.0 + fresnel * sun(R) + vec3(0.0293, 0.0698, 0.1717);
        //tonemapping
        C = aces_tonemap(C);
        
        gl_FragColor = vec4(C,1.0);
    }
    `
} );

material.side = THREE.DoubleSide

var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

render()
function render() {
    uniforms.Time.value += 0.03
    renderer.render(scene,camera)
     requestAnimationFrame(render)
}