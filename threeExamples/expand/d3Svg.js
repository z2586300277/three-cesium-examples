import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as d3 from "d3";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

animate()

function animate() {

  requestAnimationFrame(animate)

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

const data = await d3.json(FILE_HOST + "other/volcano.json");
const n = data.width;
const m = data.height;
const width = 928;
const height = Math.round(m / n * width);
const path = d3.geoPath().projection(d3.geoIdentity().scale(width / n));
const contours = d3.contours().size([n, m]);
const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(data.values)).nice();

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

svg.append("g")
  .attr("stroke", "black")
  .selectAll()
  .data(color.ticks(20))
  .join("path")
  .attr("d", d => path(contours.contour(data.values, d)))
  .attr("fill", color);

const div = document.createElement('div');
div.style.position = 'absolute';
div.style.width = '300px';
div.appendChild(svg.node());
document.body.appendChild(div);

const svgString = new XMLSerializer().serializeToString(svg.node());

const svgData = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(svgData);

const loader = new SVGLoader();

loader.load(
  url,
  function (data) {
    const paths = data.paths;
    const group = new THREE.Group();

    // 过滤和清理路径数据
    const filteredPaths = paths.filter(path =>
      path.subPaths && path.subPaths.length > 0
    );

    filteredPaths.forEach((path, index) => {

      let pathColor = 0x00ff00; // 默认绿色

      if (path.userData && path.userData.style) {
        const fillMatch = path.userData.style.fill;
        if (fillMatch && fillMatch !== 'none') pathColor = fillMatch;
      }

      const material = new THREE.MeshBasicMaterial({
        color: pathColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });

      const shapes = SVGLoader.createShapes(path);

      shapes.forEach(shape => {
        const geometry = new THREE.ShapeGeometry(shape);
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -center.y, 0);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, index * 0.1); // 轻微分层避免z-fighting
        mesh.scale.setScalar(0.1); // 适当缩放
        group.add(mesh);
      });
    });

    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);
    scene.add(group);
  }
)