import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const box = document.getElementById('box');

const scene = new THREE.Scene();
/**
 * 花瓣分组
 */
const petal = new THREE.Group();

const width = box.clientWidth;
const height = box.clientHeight;
//窗口宽高比
const k = width / height;
//三维场景的显示的上下范围
const s = 200;
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);

const renderer = new THREE.WebGLRenderer();

function create() {
    //设置相机位置
    camera.position.set(0, 200, 500)
    camera.lookAt(scene.position)

    //设置渲染区域尺寸
    renderer.setSize(width, height)
    //设置背景颜色

    //body元素中插入canvas对象
    box.appendChild(renderer.domElement)

    // const axisHelper = new THREE.AxisHelper(1000);
    // scene.add(axisHelper)

    var flowerTexture1 = new THREE.TextureLoader().load("https://z2586300277.github.io/3d-file-server/examples/flowerAndHouse/img/flower1.png");
    var flowerTexture2 = new THREE.TextureLoader().load("https://z2586300277.github.io/3d-file-server/examples/flowerAndHouse/img/flower2.png");
    var flowerTexture3 = new THREE.TextureLoader().load("https://z2586300277.github.io/3d-file-server/examples/flowerAndHouse/img/flower3.png");
    var flowerTexture4 = new THREE.TextureLoader().load("https://z2586300277.github.io/3d-file-server/examples/flowerAndHouse/img/flower4.png");
    var flowerTexture5 = new THREE.TextureLoader().load("https://z2586300277.github.io/3d-file-server/examples/flowerAndHouse/img/flower5.png");
    var imageList = [flowerTexture1, flowerTexture2, flowerTexture3, flowerTexture4, flowerTexture5];

    for (let i = 0; i < 400; i++) {
        var spriteMaterial = new THREE.SpriteMaterial({
            map: imageList[Math.floor(Math.random() * imageList.length)],//设置精灵纹理贴图
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        petal.add(sprite);

        sprite.scale.set(40, 50, 1); 
        sprite.position.set(2000 * (Math.random() - 0.5), 500 * Math.random(), 2000 * (Math.random() - 0.5))
    }
    scene.add(petal)
}


function render() {
    petal.children.forEach(sprite => {
        sprite.position.y -= 5;
        sprite.position.x += 0.5;
        if (sprite.position.y < - height / 2) {
            sprite.position.y = height / 2;
        }
        if (sprite.position.x > 1000) {
            sprite.position.x = -1000
        }
    });

    renderer.render(scene, camera)

    requestAnimationFrame(render)
}

create()
render()

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;