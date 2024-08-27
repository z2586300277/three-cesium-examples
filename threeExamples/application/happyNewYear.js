import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let smoothNoise = `
float N (vec2 st) { // https://thebookofshaders.com/10/
    return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
}

float smoothNoise( vec2 ip ){ // https://www.youtube.com/watch?v=zXsWftRdsvU
    vec2 lv = fract( ip );
  vec2 id = floor( ip );
  
  lv = lv * lv * ( 3. - 2. * lv );
  
  float bl = N( id );
  float br = N( id + vec2( 1, 0 ));
  float b = mix( bl, br, lv.x );
  
  float tl = N( id + vec2( 0, 1 ));
  float tr = N( id + vec2( 1, 1 ));
  float t = mix( tl, tr, lv.x );
  
  return mix( b, t, lv.y );
}
`;

class Background extends THREE.Mesh {
    constructor () {
        super(
            new THREE.SphereGeometry(500, 72, 36),
            new THREE.ShaderMaterial({
                side: THREE.BackSide,
                vertexShader: `
          varying vec3 vPos;
          void main(){
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
        `,
                fragmentShader: `
          varying vec3 vPos;
          void main(){
            float f = smoothstep(0., 50., vPos.y);
            vec3 baseCol = vec3(0.25, 0.75, 1) * 0.5;
            vec3 topCol = vec3(1, 0.5, 1) * 0.75;
            vec3 col = mix( baseCol, topCol, f);
            
            gl_FragColor = vec4(col, 1.);
          }
        `
            })
        );
    }
}

class Sun extends THREE.Mesh {
    constructor (gu) {
        super();
        this.gu = gu;
        this.geometry = new THREE.PlaneGeometry(1, 1, 1000, 1);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: this.gu.time,
                texYear: this.gu.texYear
            },
            vertexShader: `
        #define PI 3.14159265359
        uniform float time;
        varying vec3 vPos;
        
        float getX(float y){
          
          float x = sin(mod((y - time * 0.05) * 0.9 * PI * 2. * 9., PI * 2.));
          x *= sqrt(1. - y * y);
          return x;
        }
        
        void main(){
          float lengthFactor = uv.x;
          float e = 0.001;
          
          vec3 pos = vec3(getX(lengthFactor),lengthFactor,0.);
          vec3 pos2 = vec3(getX(lengthFactor + e), lengthFactor + e, 0.);
          vec2 tan = normalize(pos2.xy - pos.xy);
          
          pos *= 60.;
                    
          pos.xy += vec2(-tan.y, tan.x) * sign(position.y) * 1.;
          pos.z = -250.;
          
          vPos = pos;
        
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
        }
      `,
            fragmentShader: `
      
        uniform sampler2D texYear;
        varying vec3 vPos;
        
        void main(){
        
          vec2 tUv = (vPos.xy - vec2(-35., -10.)) / 70.;
          float dYear = texture(texYear, tUv).r;
        
          vec3 fogCol = vec3(0.25, 0.75, 1) * 0.5;
          vec3 sunCol = vec3(1, 0.875, 0.875);
          vec3 skyCol = vec3(1, 0.5, 1) * 0.75;
          vec3 col = mix(fogCol, sunCol, smoothstep(0., 30., vPos.y));
          col = mix(col, skyCol, smoothstep(50., 60., vPos.y));
          col = mix(col, vec3(1, 0.5, 0.75), dYear);
          gl_FragColor = vec4(col, 1);
          
        }
      `
        });
    }
}

class SimpleFir extends THREE.Mesh {
    constructor (gu) {
        super();
        this.gu = gu;
        this.amount = 300;
        this.instCount = 1000;
        this.data = new Float32Array(this.instCount * this.amount * 4);
        this.curveData = new THREE.DataTexture(
            this.data,
            this.amount,
            this.instCount,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        let ig = new THREE.InstancedBufferGeometry().copy(
            new THREE.PlaneGeometry(1, 1, this.amount, 1).translate(0.5, 0, 0)
        );
        ig.instanceCount = this.instCount;
        ig.setAttribute(
            "instPos",
            new THREE.InstancedBufferAttribute(
                new Float32Array(
                    new Array(this.instCount)
                        .fill()
                        .map((p) => {
                            return [
                                (Math.random() * 0.95 + 0.05) *
                                (Math.random() < 0.5 ? -1 : 1) *
                                25,
                                0,
                                (Math.random() - 0.5) * 50
                            ];
                        })
                        .flat()
                ),
                3
            )
        );
        let im = new THREE.ShaderMaterial({
            wireframe: false,
            uniforms: {
                time: this.gu.time,
                curveData: { value: this.curveData }
            },
            vertexShader: `
          #include <common>
          #define S(a, b, c) smoothstep(a, b, c)
          uniform float time;
          uniform sampler2D curveData;
          
          attribute vec3 instPos;
          
          varying vec3 vPos;
          varying vec4 vmvPos;
          varying vec2 vUv;
          
          mat2 rot (float a) {return mat2(cos(a), sin(a), -sin(a), cos(a));}
          
          void main(){
            
            float t = time;
            
            // completeFactor
            vec3 iPos = vec3(instPos);
            iPos.z = -25. + mod(instPos.z + t * 2. + 25., 50.);
            float radiusFactor = S(25., 15., length(iPos.xz));
            // //////////////
          
            float curveFactor = uv.x;
            float widthFactor = S(0., 0.01, curveFactor) - step(radiusFactor, curveFactor);
            float instFactor = float(gl_InstanceID) / ${this.instCount - 1}.;
            
            vec4 cData = texture(curveData, vec2(curveFactor, instFactor));
            vec2 pt = cData.xy;
            vec2 tn = cData.wz * vec2(-1., 1.) * sign(position.y) * 0.02 * widthFactor;
            vec3 pos = vec3(pt + tn, 0.);
            
            // rotation to camera
            vec2 rotPos = cameraPosition.xz - iPos.xz;
            pos.xz *= rot(-(atan(rotPos.y, rotPos.x) - PI * 0.5));
            // //////////////////
            
            pos += iPos;
            
            vPos = pos;
            
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
            vmvPos = mvPosition;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
            fragmentShader: `
          #define S(a, b, c) smoothstep(a, b, c)
          
          varying vec3 vPos;
          varying vec4 vmvPos;
          varying vec2 vUv;
          
          void main() {
            
            
            float ditheringRadius = S(2., 0.5, -vmvPos.z);
            if(length(fract(-vmvPos.xyz * 100.) - 0.5) < ditheringRadius) discard;
            
            vec3 baseCol = vec3(0.25, 0.75, 1);
            vec3 col = mix(baseCol * 0.5, baseCol * 1.25, S(0., 1., vPos.y));
            col = mix(baseCol * 0.5, col, S(-0.2, 0., vPos.y)); // roots
            col = mix(vec3(1, 1, 1), col, S(0.01, 0.05, vUv.x)); // pinnacle
            gl_FragColor = vec4(col, 1);
          }
        `
        });

        this.geometry = ig;
        this.material = im;

        this.setCurveData();
    }

    setCurveData() {
        let pos = new THREE.Vector3();
        let tan = new THREE.Vector3();

        for (let iIdx = 0; iIdx < this.instCount; iIdx++) {
            let basePoints = [];
            basePoints.push(new THREE.Vector3(0, 1.1, 0));
            let layers = THREE.MathUtils.randInt(5, 10);
            let step = 1 / (layers - 1);
            for (let i = 0; i < layers; i++) {
                basePoints.push(new THREE.Vector3(-step * 0.5 * i, 1 - step * i, 0));
                if (i != 0)
                    basePoints.push(new THREE.Vector3(step * 0.5 * i, 1 - step * i, 0));
            }
            basePoints.push(new THREE.Vector3(0, -0.1, 0));
            let xReflect = Math.random() < 0.5 ? -1 : 1;
            basePoints.forEach((p) => {
                //p.y += 0.1;
                p.y *= layers > 5 ? 2 : layers > 8 ? 3 : 1.5;
                p.x *= xReflect;
            });

            let curve = new THREE.CatmullRomCurve3(
                basePoints,
                false,
                "catmullrom",
                1
            );

            for (let dIdx = 0; dIdx < this.amount; dIdx++) {
                let getFactor = dIdx / (this.amount - 1);
                curve.getPoint(getFactor, pos);
                curve.getTangent(getFactor, tan);
                let d = this.data;
                let curRow = iIdx * this.amount * 4;
                d[curRow + dIdx * 4 + 0] = pos.x;
                d[curRow + dIdx * 4 + 1] = pos.y;
                d[curRow + dIdx * 4 + 2] = tan.x;
                d[curRow + dIdx * 4 + 3] = tan.y;
            }
        }
        this.curveData.needsUpdate = true;
    }
}

class Road extends THREE.Mesh {
    constructor (gu) {
        super();
        this.gu = gu;
        this.geometry = new THREE.PlaneGeometry(1, 50, 1, 200).rotateX(
            -Math.PI * 0.5
        );
        this.material = new THREE.ShaderMaterial({
            wireframe: false,
            uniforms: {
                time: this.gu.time
            },
            vertexShader: `
        #define S(a, b, c) smoothstep(a, b, c)
        uniform float time;
        varying vec2 vUv;
        
        ${smoothNoise}
        
        void main(){
          vUv = uv;
          
          float t = time;
          vec2 rUv = uv * vec2(1., 10.);
          float nz = smoothNoise(vec2(rUv.y + t * 0.4, 1.1));
          nz -= 0.5;
          vec3 pos = position;
          pos.x *= 0.875 * S(0.5, 0.4, abs(uv.y -  0.5));
          pos.x += nz * 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
        }
      `,
            fragmentShader: `
        #define S(a, b, c) smoothstep(a, b, c)
        varying vec2 vUv;
        void main(){
          vec2 uv = vUv;
          vec3 col = vec3(0.25, 0.75, 1) * 0.875;
          float absX = abs(vUv.x - 0.5) * 2.;
          float wx = fwidth(absX);
          col = mix(col, vec3(1, 0.5, 1), S(0.05 + wx, 0.05, abs(absX - 0.5))); // magenta stripes
          gl_FragColor = vec4(col, 1.);
        }
      `
        });
    }
}

class Snow extends THREE.Points {
    constructor (gu) {
        super();
        this.gu = gu;
        this.geometry = new THREE.BufferGeometry().setFromPoints(
            new Array(50000).fill().map(p => {
                let v = new THREE.Vector3().random().subScalar(0.5).multiply(new THREE.Vector3(0.5, 1, 1)).multiplyScalar(50);
                v.y += 25;
                return v;
            })
        );
        this.material = new THREE.PointsMaterial({
            size: 0.2,
            color: new THREE.Color(0.75, 1, 1),
            onBeforeCompile: shader => {
                shader.uniforms.time = this.gu.time;
                shader.uniforms.texYear = this.gu.texYear;
                shader.vertexShader = `
            uniform float time;
            varying float vAppearance;
            ${shader.vertexShader}
          `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
              float z = -25. + mod(position.z + 25. + time * 2., 50.);
              transformed.z = z;
              float y = 50. - mod(abs(position.y - 50. - time * 0.25), 50.);
              transformed.y = y;
              vAppearance = smoothstep(5., 2.5, -vec3(modelViewMatrix * vec4(transformed, 1)).z);
            `
                );
                console.log(shader.vertexShader);
                shader.fragmentShader = `
            uniform sampler2D texYear;
            varying float vAppearance;
            ${shader.fragmentShader}
          `.replace(
                    `#include <clipping_planes_fragment>`,
                    `#include <clipping_planes_fragment>
              if (length(gl_PointCoord.xy - 0.5) > 0.5) discard;
            `
                ).replace(
                    `#include <color_fragment>`,
                    `#include <color_fragment>
              
              vec2 tUv = gl_PointCoord.xy;
              tUv.y = 1. - tUv.y + 0.05;
              float ytVal = texture(texYear, tUv).r;
              
              diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0, 1, 1) * 0.75, ytVal * vAppearance);
            `
                );
                console.log(shader.fragmentShader);
            }
        });
    }
}

let scene = new THREE.Scene();
//scene.background = new THREE.Color("white");
let camera = new THREE.PerspectiveCamera(
    30,
    innerWidth / innerHeight,
    0.01,
    1000
);
camera.position.set(0, 0.25, 10).setLength(3);
let camShift = new THREE.Vector3(0, 0.25, 0);
camera.position.add(camShift);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.enablePan = false;
controls.target.copy(camShift);
controls.update();
// controls.maxDistance = controls.getDistance();
// controls.maxPolarAngle = controls.getPolarAngle();
// controls.minPolarAngle = controls.getPolarAngle();

//scene.add(new THREE.GridHelper(50, 10));

let gu = {
    time: { value: 0 },
    texYear: {
        value: (() => {

            function createTexture(text) {
                let c = document.createElement("canvas");
                c.width = 1024;
                c.height = 1024;
                let unit = (val) => val * c.height * 0.01;

                let ctx = c.getContext("2d");
                ctx.filter = `blur(${unit(0.5)}px)`;
                ctx.font = `${unit(80)}px TulpenOne`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.fillStyle = "#fff";
                ctx.fillText(text, unit(50), unit(50));

                let tex = new THREE.CanvasTexture(c);
                return tex;
            }

            return Math.random() > 0.5 ? createTexture("年") : createTexture("乐")
        })()
    }
};

let background = new Background();
scene.add(background);

let sun = new Sun(gu);
scene.add(sun);

let simpleFir = new SimpleFir(gu);
scene.add(simpleFir);

let road = new Road(gu);
scene.add(road);

let snow = new Snow(gu);
scene.add(snow);

let clock = new THREE.Clock();
let t = 0;

renderer.setAnimationLoop(() => {
    let dt = clock.getDelta();
    t += dt;
    gu.time.value = t;
    controls.update();
    renderer.render(scene, camera);
});
