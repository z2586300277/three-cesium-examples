import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

const HOST = 'https://z2586300277.github.io/3d-file-server/examples/flowerAndHouse';

const box = document.getElementById('box');

const width = box.clientWidth;
const height = box.clientHeight;
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

const scene = new THREE.Scene();

const house = new THREE.Group();

const renderer = new THREE.WebGLRenderer();

function create() {
    renderer.setSize(width, height);
    //设置背景颜色
    renderer.setClearColor(0xcce0ff, 1);
    box.appendChild(renderer.domElement);

    camera.position.set(-500, 60, 0)
    camera.lookAt(scene.position);

    const light = new THREE.AmbientLight(0xCCCCCC);
    scene.add(light);

    const axisHelper = new THREE.AxesHelper(1000);
    scene.add(axisHelper);

    createGrass();
    
    createHouse();

    function createHouse() {
        createFloor();
        
        const sideWall = createSideWall();
        const sideWall2 = createSideWall();
        sideWall2.position.z = 300;

        createFrontWall();
        createBackWall();

        const roof = createRoof();
        const roof2 = createRoof();
        roof2.rotation.x = Math.PI / 2;
        roof2.rotation.y = Math.PI / 4 * 0.6;
        roof2.position.y = 130;
        roof2.position.x = -50;
        roof2.position.z = 155;

        createWindow();
        createDoor();

        createBed();
    }
   
    scene.add(house);

    scene.fog = new THREE.Fog(0xffffff, 10, 1500);
}

function createGrass() {
    const geometry = new THREE.PlaneGeometry( 10000, 10000);

    const texture = new THREE.TextureLoader().load(HOST+'/img/grass.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 100, 100 );

    const grassMaterial = new THREE.MeshBasicMaterial({map: texture});

    const grass = new THREE.Mesh( geometry, grassMaterial );

    grass.rotation.x = -0.5 * Math.PI;

    scene.add( grass );
}

function createFloor() {
    const geometry = new THREE.PlaneGeometry( 200, 300);

    const texture = new THREE.TextureLoader().load(HOST + '/img/wood.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 2, 2 );

    const material = new THREE.MeshBasicMaterial({map: texture});

    const floor = new THREE.Mesh( geometry, material );

    floor.rotation.x = -0.5 * Math.PI;
    floor.position.y = 1;
    floor.position.z = 150;

    house.add(floor);
}

function createSideWall() {
    const shape = new THREE.Shape();
    shape.moveTo(-100, 0);
    shape.lineTo(100, 0);
    shape.lineTo(100,100);
    shape.lineTo(0,150);
    shape.lineTo(-100,100);
    shape.lineTo(-100,0);

    const extrudeGeometry = new THREE.ExtrudeGeometry( shape );

    const texture = new THREE.TextureLoader().load(HOST+'/img/wall.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.01, 0.005 );

    var material = new THREE.MeshBasicMaterial( {map: texture} );

    const sideWall = new THREE.Mesh( extrudeGeometry, material ) ;

    house.add(sideWall);

    return sideWall;
}

function createFrontWall() {
    const shape = new THREE.Shape();
    shape.moveTo(-150, 0);
    shape.lineTo(150, 0);
    shape.lineTo(150,100);
    shape.lineTo(-150,100);
    shape.lineTo(-150,0);

    const window = new THREE.Path();
    window.moveTo(30,30)
    window.lineTo(80, 30)
    window.lineTo(80, 80)
    window.lineTo(30, 80);
    window.lineTo(30, 30);
    shape.holes.push(window);

    const door = new THREE.Path();
    door.moveTo(-30, 0)
    door.lineTo(-30, 80)
    door.lineTo(-80, 80)
    door.lineTo(-80, 0);
    door.lineTo(-30, 0);
    shape.holes.push(door);

    const extrudeGeometry = new THREE.ExtrudeGeometry( shape ) 

    const texture = new THREE.TextureLoader().load(HOST+'/img/wall.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.01, 0.005 );

    const material = new THREE.MeshBasicMaterial({map: texture} );

    const frontWall = new THREE.Mesh( extrudeGeometry, material ) ;

    frontWall.position.z = 150;
    frontWall.position.x = 100;
    frontWall.rotation.y = Math.PI * 0.5;

    house.add(frontWall);
}

function createBackWall() {
    const shape = new THREE.Shape();
    shape.moveTo(-150, 0)
    shape.lineTo(150, 0)
    shape.lineTo(150,100)
    shape.lineTo(-150,100);

    const extrudeGeometry = new THREE.ExtrudeGeometry( shape ) 

    const texture = new THREE.TextureLoader().load(HOST+'/img/wall.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.01, 0.005 );

    const material = new THREE.MeshBasicMaterial({map: texture});

    const backWall = new THREE.Mesh( extrudeGeometry, material) ;

    backWall.position.z = 150;
    backWall.position.x = -100;
    backWall.rotation.y = Math.PI * 0.5;

    house.add(backWall);
}

function createRoof() {
    const geometry = new THREE.BoxGeometry( 120, 320, 10 );

    const texture = new THREE.TextureLoader().load(HOST+'/img/tile.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 5, 1);
    texture.rotation = Math.PI / 2;
    const textureMaterial = new THREE.MeshBasicMaterial({ map: texture});

    const colorMaterial = new THREE.MeshBasicMaterial({ color: 'grey' });

    const materials = [
        colorMaterial,
        colorMaterial,
        colorMaterial,
        colorMaterial,
        colorMaterial,
        textureMaterial
    ];

    const roof = new THREE.Mesh( geometry, materials );

    house.add(roof);

    roof.rotation.x = Math.PI / 2;
    roof.rotation.y = - Math.PI / 4 * 0.6;
    roof.position.y = 130;
    roof.position.x = 50;
    roof.position.z = 155;
    
    return roof;
}

function createWindow() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 50)
    shape.lineTo(50,50)
    shape.lineTo(50,0);
    shape.lineTo(0, 0);

    const hole = new THREE.Path();
    hole.moveTo(5,5)
    hole.lineTo(5, 45)
    hole.lineTo(45, 45)
    hole.lineTo(45, 5);
    hole.lineTo(5, 5);
    shape.holes.push(hole);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape);

    var extrudeMaterial = new THREE.MeshBasicMaterial({ color: 'silver' });

    var mesh = new THREE.Mesh( extrudeGeometry, extrudeMaterial ) ;
    mesh.rotation.y = Math.PI / 2;
    mesh.position.y = 30;
    mesh.position.x = 100;
    mesh.position.z = 120;

    house.add(mesh);

    return mesh;
}

function createDoor() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 80);
    shape.lineTo(50,80);
    shape.lineTo(50,0);
    shape.lineTo(0, 0);

    const hole = new THREE.Path();
    hole.moveTo(5,5);
    hole.lineTo(5, 75);
    hole.lineTo(45, 75);
    hole.lineTo(45, 5);
    hole.lineTo(5, 5);
    shape.holes.push(hole);

    const extrudeGeometry = new THREE.ExtrudeGeometry( shape );

    const material = new THREE.MeshBasicMaterial( { color: 'silver' } );

    const door = new THREE.Mesh( extrudeGeometry, material ) ;

    door.rotation.y = Math.PI / 2;
    door.position.y = 0;
    door.position.x = 100;
    door.position.z = 230;

    house.add(door);
}

function createBed() {
    var loader = new FBXLoader();
    loader.load(HOST + '/bed.fbx', function ( object ) {
        object.position.x = 40;
        object.position.z = 80;
        object.position.y = 20;

        house.add( object );
    } );
}

const clock = new THREE.Clock();

const controls = new FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.05;
controls.movementSpeed = 100;
controls.lookVertical = false;

create()
render()

function render() {
    const delta = clock.getDelta();
    controls.update(delta);

    renderer.render(scene, camera);
    requestAnimationFrame(render)
}