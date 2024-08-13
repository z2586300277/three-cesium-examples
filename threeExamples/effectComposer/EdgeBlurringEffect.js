
import * as THREE from "three";
import { Color, UniformsUtils } from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

scene.background = new Color(0xffffff);

const vertexShader = `
    precision highp float;
    precision highp int;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;
const fragmentShader = `
    precision highp float;
    precision highp int;

    uniform float edge;
    uniform float opacity;

    uniform sampler2D map;

    varying vec2 vUv;

    void main(){
      float edgeMin = edge;
      float edgeMax = 1.0 - edge;

      gl_FragColor = texture2D( map, vUv );

      if(vUv.x < edgeMin){
        if(vUv.y < edgeMin){ // 1
            gl_FragColor.a = (min(vUv.x / edgeMin, vUv.y / edgeMin)) * opacity;
        }
        else if(vUv.y >= edgeMin && vUv.y <= edgeMax){ // 4
            gl_FragColor.a = (vUv.x / edgeMin) * opacity;
        }
        else if(vUv.y > edgeMax){ // 7
            gl_FragColor.a = (min(vUv.x / edgeMin, 1.0 - ((vUv.y - edgeMax) / edgeMin))) * opacity;
        }
        else{
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // for debug
        }
      }
      else if(vUv.x >= edgeMin && vUv.x <= edgeMax){
            if(vUv.y < edgeMin){ // 2
                gl_FragColor.a = (vUv.y / edgeMin) * opacity;
            }
            else if(vUv.y >= edgeMin && vUv.y <= edgeMax){ // 5(center)
                gl_FragColor.a = 1.0 * opacity;
            }
            else if(vUv.y > edgeMax){ // 8
                gl_FragColor.a = (1.0 - ((vUv.y - edgeMax) / edgeMin)) * opacity;
            }
      }
      else if(vUv.x > edgeMax){
            float xNormal = 1.0 - ((vUv.x - edgeMax) / edgeMin);
        
            if(vUv.y < edgeMin){ // 3
                gl_FragColor.a = (min(vUv.y / edgeMin, xNormal)) * opacity;
            }
            else if(vUv.y >= edgeMin && vUv.y <= edgeMax){ // 6
                gl_FragColor.a = (xNormal) * opacity;
            }
            else if(vUv.y > edgeMax){ // 9
                gl_FragColor.a = (min(xNormal, 1.0 - ((vUv.y - edgeMax) / edgeMin))) * opacity;
            }
      }
    }
`;

const geometry = new THREE.PlaneGeometry(2, 4);

const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material2 = new THREE.RawShaderMaterial({
    uniforms: UniformsUtils.clone({
        map: { type: "t", value: null },
        edge: { type: "float", value: 0.1 },
        opacity: { type: "float", value: 1 },
    }),
    transparent: true,
    opacity: 1,
    alphaTest: 1,
    depthTest: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});

const cube = new THREE.Mesh(geometry, material1);
const rect = new THREE.Mesh(geometry, material2);
cube.position.set(-2, 0, 0);
rect.position.set(0, 0, 0);

scene.add(rect);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
