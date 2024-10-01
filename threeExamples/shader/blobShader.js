import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from 'dat.gui'
import gsap from 'gsap'

var Theme = {
  primary: 0xFFFFFF,
  secundary: 0x292733,
  danger: 0xFF0000,
  darker: 0x000000
};


var scene, camera, renderer, mat;
var _width, _height;
var _primitive;
var shapeGroup = new THREE.Group();
var start = Date.now();

function createWorld() {
  _width = window.innerWidth;
  _height= window.innerHeight;
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(Theme.secundary);
  
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,10,26);
  
  renderer = new THREE.WebGLRenderer({antialias:false, alpha:false});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, renderer.domElement)
  
  document.body.appendChild(renderer.domElement);
  
  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  camera.updateProjectionMatrix();
  console.log('- resize -');
}

var primitiveElement = function() {
  this.mesh = new THREE.Object3D();
  mat = new THREE.ShaderMaterial( {
    side:THREE.DoubleSide,
    uniforms: {
      time: {
        type: "f",
        value: 0.1
      },
      pointscale: {
        type: "f",
        value: 0.2
      },
      decay: {
        type: "f",
        value: 0.3
      },
      size: {
        type: "f",
        value: 0.3
      },
      displace: {
        type: "f",
        value: 0.3
      },
      complex: {
        type: "f",
        value: 0.0
      },
      waves: {
        type: "f",
        value: 0.10
      },
      eqcolor: {
        type: "f",
        value: 0.0
      },
      rcolor: {
        type: "f",
        value: 0.0
      },
      gcolor: {
        type: "f",
        value: 0.0
      },
      bcolor: {
        type: "f",
        value: 0.0
      },
      fragment: {
        type: "i",
        value: true
      },
      redhell: {
        type: "i",
        value: true
      }
    },
    vertexShader: `
    vec3 mod289(vec3 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  
    vec4 mod289(vec4 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  
    vec4 permute(vec4 x)
    {
      return mod289(((x*34.0)+1.0)*x);
    }
  
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
  
    vec3 fade(vec3 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }
    
    // Classic Perlin noise
    float cnoise(vec3 P)
    {
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod289(Pi0);
      Pi1 = mod289(Pi1);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
  
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
  
      vec4 gx0 = ixy0 * (1.0 / 5.0);
      vec4 gy0 = fract(floor(gx0) * (1.0 / 5.0)) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  
      vec4 gx1 = ixy1 * (1.0 / 5.0);
      vec4 gy1 = fract(floor(gx1) * (1.0 / 5.0)) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  
      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
  
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
  
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
      return 2.2 * n_xyz;
    }
  
    // Classic Perlin noise, periodic variant
    float pnoise(vec3 P, vec3 rep)
    {
      vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
      vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
      Pi0 = mod289(Pi0);
      Pi1 = mod289(Pi1);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
  
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
  
      vec4 gx0 = ixy0 * (1.0 / 5.0);
      vec4 gy0 = fract(floor(gx0) * (1.0 / 5.0)) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  
      vec4 gx1 = ixy1 * (1.0 / 5.0);
      vec4 gy1 = fract(floor(gx1) * (1.0 / 5.0)) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  
      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
  
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
  
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
      return 1.5 * n_xyz;
    }
    
    // Turbulence By Jaume Sanchez => https://codepen.io/spite/
    
    varying vec2 vUv;
    varying float noise;
    varying float qnoise;
    varying float displacement;
    
    uniform float time;
    uniform float displace;
    uniform float pointscale;
    uniform float decay;
    uniform float size;
    uniform float complex;
    uniform float waves;
    uniform float eqcolor;
    uniform bool fragment;
  
    float turbulence( vec3 p) {
      float t = - 0.005;
      for (float f = 1.0 ; f <= 1.0 ; f++ ){
        float power = pow( 1.3, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
      }
      return t;
    }
  
    void main() {
  
      vUv = uv;
  
      noise = (2.0 *  - waves) * turbulence( decay * abs(normal + time));
      qnoise = (0.3 *  - eqcolor) * turbulence( decay * abs(normal + time));
      float b = pnoise( complex * (position) + vec3( (decay * 2.0) * time ), vec3( 100.0 ) );
      
      displacement = - atan(noise) + tan(b * displace);
  
      vec3 newPosition = (position) + (normal * displacement);
      gl_Position = (projectionMatrix * modelViewMatrix) * vec4( newPosition, abs(size) );
      gl_PointSize = (3.0);
    }
    `,
    fragmentShader:`
    varying float qnoise;
    varying float noise;
    
    uniform float time;
    uniform bool redhell;
    uniform float rcolor;
    uniform float gcolor;
    uniform float bcolor;
  
    void main() {
      float r, g, b;
      
      if (!redhell == true) {
        r = sin(qnoise + rcolor);
        g = normalize(qnoise + (gcolor / 2.0));
        b = tan(qnoise + bcolor);
      } else {
        r = normalize(qnoise + rcolor);
        g = cos(qnoise + gcolor);
        b = sin(qnoise + bcolor);
      }
      gl_FragColor = vec4(r, g, b, 1.0);
    }`
  });
  
  var wir_mat = new THREE.MeshBasicMaterial({color:Theme.darker});
  var geo = new THREE.IcosahedronGeometry(2, 60);
  var wir = new THREE.IcosahedronGeometry(2.3, 20);
  this.shape = new THREE.Mesh(geo, mat);
  this.point = new THREE.Points(wir, mat);
  
  shapeGroup.add(this.point);
  shapeGroup.add(this.shape);
  
  scene.add(shapeGroup);
}
function createPrimitive() {
  _primitive = new primitiveElement();
}

var options = {
  perlin: {
    speed: 0.4,
    size: 0.7,
    perlins: 1.0,
    decay: 1.20,
    displace: 1.00,
    complex: 0.50,
    waves: 3.7,
    eqcolor: 10.0,
    rcolor: 1.5,
    gcolor: 1.5,
    bcolor: 1.5,
    fragment: true,
    points: true,
    redhell: true
  },
  perlinRandom: function() {
    gsap.to(this.perlin, 2, {
      //decay: Math.random() * 1.0,
      waves: Math.random() * 20.0,
      complex: Math.random() * 1.0,
      displace: Math.random() * 2.5,
    });
  },
  random: function() {
    //this.perlin.redhell = Math.random() >= 0.5; // 10 1 0.1 1.2
    gsap.to(this.perlin, 1, {
      eqcolor: 11.0,
      rcolor: Math.random() * 1.5,
      gcolor: Math.random() * 0.5,
      bcolor: Math.random() * 1.5,
    });
  },
  normal: function() {
    this.perlin.redhell = true; // 10 1 0.1 1.2
    gsap.to(this.perlin, 1, {
      //speed: 0.12,
      eqcolor: 10.0,
      rcolor: 1.5,
      gcolor: 1.5,
      bcolor: 1.5,
    });
  },
  darker: function() {
    this.perlin.redhell = false; // 10 1 0.1 1.2
    gsap.to(this.perlin, 1, {
      //speed: 0.5,
      eqcolor: 9.0,
      rcolor: 0.4,
      gcolor: 0.05,
      bcolor: 0.6,
    });
  },
  volcano: function() {
    this.perlin.redhell = false; // 10 1 0.1 1.2
    //this.perlin.speed = 0.83;
    
    gsap.to(this.perlin, 1, {
      size: 0.7,
      waves: 0.6,
      complex: 1.0,
      displace: 0.3,
      eqcolor: 9.0,
      rcolor: 0.85,
      gcolor: 0.05,
      bcolor: 0.32,
    });
  },
  cloud: function() {
    this.perlin.redhell = true; // 10 1 0.1 1.2
    //this.perlin.speed = 0.1;
    
    gsap.to(this.perlin, 1, {
      size: 1.0,
      waves :20.0,
      complex: 0.1,
      displace: 0.1,
      eqcolor: 4.0,
      rcolor: 1.5,
      gcolor: 0.7,
      bcolor: 1.5,
    });
  },
  tornasol: function() {
    this.perlin.redhell = true; // 10 1 0.1 1.2
    //this.perlin.speed = 0.25;
    
    gsap.to(this.perlin, 1, {
      size: 1.0,
      waves: 3.0,
      complex: 0.65,
      displace: 0.5,
      eqcolor: 9.5,
      rcolor: 1.5,
      gcolor: 1.5,
      bcolor: 1.5,
    });
  }
}

function createGUI() {
  var gui = new dat.GUI();
    
  var perlinGUI = gui.addFolder('Shape Setup');
  perlinGUI.add(options, 'perlinRandom').name('• Random Shape');
  perlinGUI.add(options.perlin, 'speed', 0.1, 1.0).name('Speed').listen();
  perlinGUI.add(options.perlin, 'size', 0.0, 3.0).name('Size').listen();
  //perlinGUI.add(options.perlin, 'decay', 0.0, 1.0).name('Decay').listen();
  perlinGUI.add(options.perlin, 'waves', 0.0, 20.0).name('Waves').listen();
  perlinGUI.add(options.perlin, 'complex', 0.1, 1.0).name('Complex').listen();
  perlinGUI.add(options.perlin, 'displace', 0.1, 2.5).name('Displacement').listen();
  //perlinGUI.open();
  
  var colorGUI = gui.addFolder('Color');
  colorGUI.add(options, 'random').name('• Random colors');
  colorGUI.add(options, 'normal').name('• Normal colors');
  colorGUI.add(options, 'darker').name('• Dark colors');
  colorGUI.add(options.perlin, 'eqcolor', 0.0, 30.0).name('Hue').listen();
  colorGUI.add(options.perlin, 'rcolor', 0.0, 2.5).name('R').listen();
  colorGUI.add(options.perlin, 'gcolor', 0.0, 2.5).name('G').listen();
  colorGUI.add(options.perlin, 'bcolor', 0.0, 2.5).name('B').listen();
  colorGUI.add(options.perlin, 'redhell', true).name('Electroflow');
  
  //colorGUI.open();
  
  gui.add(options, 'volcano').name('• Volcano');
  gui.add(options, 'tornasol').name('• Tornasol');
  gui.add(options, 'cloud').name('• Cotton Candy');
  gui.add(options.perlin, 'points', true).name('Points');
}

function animation() {
  var performance = Date.now() * 0.003;
  
  //_primitive.shape.visible = !options.perlin.points;
  _primitive.point.visible = options.perlin.points;
  
  mat.uniforms['time'].value = (options.perlin.speed / 1000) * (Date.now() - start);
  
  mat.uniforms['pointscale'].value =    options.perlin.perlins;
  mat.uniforms['decay'].value =         options.perlin.decay;
  mat.uniforms['size'].value =          options.perlin.size;
  mat.uniforms['displace'].value =      options.perlin.displace;
  mat.uniforms['complex'].value =       options.perlin.complex;
  mat.uniforms['waves'].value =         options.perlin.waves;
  mat.uniforms['fragment'].value =      options.perlin.fragment;
  
  mat.uniforms['redhell'].value =       options.perlin.redhell;
  mat.uniforms['eqcolor'].value =       options.perlin.eqcolor;
  mat.uniforms['rcolor'].value =        options.perlin.rcolor;
  mat.uniforms['gcolor'].value =        options.perlin.gcolor;
  mat.uniforms['bcolor'].value =        options.perlin.bcolor;

  requestAnimationFrame(animation);
  renderer.render(scene, camera);
}

createWorld();
createGUI();
createPrimitive();
animation();