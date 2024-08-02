import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

var container;
var camera, scene, renderer;
var controls;

var shaderUniforms, shaderAttributes;

var particles = [];
var particleSystem;

var imageWidth = 640;
var imageHeight = 400;
var imageData = null;

var animationTime = 0;
var animationDelta = 0.005;

init();
// tick();

function init() {
  createScene();
  createControls();
  createPixelData();

  window.addEventListener('resize', onWindowResize, false);
}

function createScene() {
  container = document.getElementById('box');

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;
  camera.lookAt(scene.position)

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  container.appendChild(renderer.domElement);

  scene.add(new THREE.AxesHelper(1000));
  scene.add(new THREE.AmbientLight(0xffffff, 3));
}

function createControls() {
    
  controls = new TrackballControls(camera, renderer.domElement);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = true;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
}

function createPixelData() {
    var image = document.createElement("img");
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    
    image.crossOrigin = "Anonymous";
    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        imageWidth = image.width;
        imageHeight = image.height;
      
      context.fillStyle = context.createPattern(image, 'no-repeat');
      context.fillRect(0, 0, imageWidth, imageHeight);
      
      imageData = context.getImageData(0, 0, imageWidth, imageHeight).data;

      createPaticles();
      tick();
    };
    
    image.src = "https://img1.baidu.com/it/u=232967222,3421933282&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1722704400&t=2a6198148cf952fc93d92962d5d83d2e";
  }

  function createPaticles() {
    var colors = [];
    var weights = [0.2126, 0.7152, 0.0722];
    var c = 0;

    var geometry, material;
    var x, y;
    var zRange = 400;

    geometry = new THREE.BufferGeometry();
    var positions = [];
    var colors = [];

    x = imageWidth * -0.5;
    y = imageHeight * 0.5;

    shaderUniforms = {
      amplitude: {
        type: "f",
        value: 0.5
      },
      vertexColor: {
        type: "c",
        value: []
      }
    };

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: `
          uniform float amplitude;
          attribute vec3 customColor;
          varying vec3 vColor;
          void main() {
            vColor = customColor;
            vec4 pos = vec4(position, 1.0);
            pos.z *= amplitude;
            vec4 mvPosition = modelViewMatrix * pos;
            gl_PointSize = 2.0 * ( 300.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4( vColor, 1.0 );
          }
        `,
        vertexColors: true
      });
      
      var positions = [];
      var colors = [];
      for (var i = 0; i < imageHeight; i++) {
        for (var j = 0; j < imageWidth; j++) {
          var color = new THREE.Color();
          color.setRGB(imageData[c] / 255, imageData[c + 1] / 255, imageData[c + 2] / 255);
          var weight = color.r * weights[0] +
          color.g * weights[1] +
          color.b * weights[2];

        var vertex = new THREE.Vector3();
        vertex.x = x;
        vertex.y = y;
        vertex.z = (zRange * -0.5) + (zRange * weight);
          positions.push(vertex.x, vertex.y, vertex.z);
          colors.push(color.r, color.g, color.b);
          c += 4;
          x++;
        }
      
        x = imageWidth * -0.5;
        y--;
      }
      var geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
      particleSystem = new THREE.Points(geometry, shaderMaterial);
      scene.add(particleSystem);
  }

  function tick() {
    requestAnimationFrame(tick);
    update();
    render();
  }

  function update() {
    shaderUniforms.amplitude.value = Math.sin(animationTime);
    animationTime += animationDelta;
    controls.update();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }