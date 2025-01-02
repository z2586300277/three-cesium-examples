import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 0.6)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const uniforms = {

    iTime: {

        value: 0

    },

    iResolution: {

        value: new THREE.Vector2(box.clientWidth, box.clientHeight)

    }

}

const geometry = new THREE.PlaneGeometry(1, 1)

const material = new THREE.ShaderMaterial({

    uniforms,

    transparent: true,

    side: THREE.DoubleSide,

    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() { 
          vUv = uv; 
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
      }
  `,
    fragmentShader: `
    const float PI = 3.14159265359; 
        
    uniform float iTime;
    uniform vec2 iResolution; 
      
    varying vec2 vUv;
    
    vec3 firePalette(float i){
    
        float T = 1400. + 1300.*i; // Temperature range (in Kelvin).
        vec3 L = vec3(7.4, 5.6, 4.4); // Red, green, blue wavelengths (in hundreds of nanometers).
        L = pow(L,vec3(5)) * (exp(1.43876719683e5/(T*L)) - 1.);
        return 1. - exp(-5e8/L); // Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
    } 
    vec3 hash33(vec3 p){ 
        
        float n = sin(dot(p, vec3(7, 157, 113)));    
        return fract(vec3(2097152, 262144, 32768)*n); 
    }
    
    float voronoi(vec3 p){
    
        vec3 b, r, g = floor(p);
        p = fract(p); // "p -= g;" works on some GPUs, but not all, for some annoying reason.
        
        float d = 1.;  
        for(int j = -1; j <= 1; j++) {
            for(int i = -1; i <= 1; i++) {
                
                b = vec3(i, j, -1);
                r = b - p + hash33(g+b);
                d = min(d, dot(r,r));
                
                b.z = 0.0;
                r = b - p + hash33(g+b);
                d = min(d, dot(r,r));
                
                b.z = 1.;
                r = b - p + hash33(g+b);
                d = min(d, dot(r,r));
                    
            }
        }
        
        return d; // Range: [0, 1]
    }
    
    float noiseLayers(in vec3 p) {
    
        vec3 t = vec3(0., 0., p.z + iTime*1.5);
    
        const int iter = 5; // Just five layers is enough.
        float tot = 0., sum = 0., amp = 1.; // Total, sum, amplitude.
    
        for (int i = 0; i < iter; i++) {
            tot += voronoi(p + t) * amp; // Add the layer to the total.
            p *= 2.; // Position multiplied by two.
            t *= 1.5; // Time multiplied by less than two.
            sum += amp; // Sum of amplitudes.
            amp *= .5; // Decrease successive layer amplitude, as normal.
        }
        
        return tot/sum; // Range: [0, 1].
    }
    float distanceTo(vec2 src, vec2 dst) {
        float dx = src.x - dst.x;
        float dy = src.y - dst.y;
        float dv = dx * dx + dy * dy;
        return sqrt(dv);
    }
    
    
    void main() { 
        float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y)) * 2.0;  
        vec2 uv = (vUv-0.5) * 2.0;
        
        uv += vec2(sin(iTime*.5)*.25, cos(iTime*.5)*.125);
        
        vec3 rd = normalize(vec3(uv.x, uv.y, 3.1415926535898/8.));
    
        float cs = cos(iTime*.25), si = sin(iTime*.25); 
        rd.xy = rd.xy*mat2(cs, -si, si, cs);  
        float c = noiseLayers(rd*2.);
        
        c = max(c + dot(hash33(rd)*2. - 1., vec3(.015)), 0.);
    
        c *= sqrt(c)*1.5; // Contrast.
        vec3 col = firePalette(c); // Palettization.
        col = mix(col, col.zyx*.15 + c*.85, min(pow(dot(rd.xy, rd.xy)*1.2, 1.5), 1.)); // Color dispersion.
        col = pow(col, vec3(1.25)); // Tweaking the contrast a little.
    
        gl_FragColor = vec4(sqrt(clamp(col, 0., 1.)),  1.0 - pow(len, 2.0));
        
    }
    `
})

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

animate()

function animate() {

    uniforms.iTime.value += 0.01

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}