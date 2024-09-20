import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

const worldToScreenPosition = (pos, camera) => {
    // 三维坐标转换成屏幕坐标
    const worldVector = new THREE.Vector3(pos.x, pos.y, pos.z);
    const standardVector = worldVector.project(camera);
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;
    return {
        x: Math.round(standardVector.x * widthHalf + widthHalf),
        y: Math.round(-standardVector.y * heightHalf + heightHalf),
        z: 1,
    };
}

let renderer, scene, camera, orbitControls, transformControls;

let plane;
let raycaster = new THREE.Raycaster();
let intersects;
let mouse = new THREE.Vector2();
let markersGroup = new THREE.Group();
let markers = [];
let points = [];
let vec2Array = [];
let dashLine;
let line;
let canDrawLine = true;
let mesh;
let index = 0;
let distanceArray = [];
let distance = 0;
let totalDistance = 0;
let geometry = null;
let distanceDom = null;
let nextPoint = null;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);
    scene.add(markersGroup);

    camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        100
    );
    camera.position.set(10, 10, 10);

    //plane
    let planeGeo = new THREE.PlaneGeometry(40, 40, 40);
    let planeMat = new THREE.MeshBasicMaterial({ color: 0x6666666 });
    plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // orbit
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0.5, 0);
    orbitControls.update();
    orbitControls.enableDamping = true;

    // transform
    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener("dragging-changed", onDragChanged);
    transformControls.addEventListener("mouseUp", onDragend);
    transformControls.addEventListener("change", onDragChanging);
    scene.add(transformControls);
    function onDragChanged(event) {
        orbitControls.enabled = !event.value;
    }

    document.body.addEventListener("mousedown", onMousedown, false);
    document.body.addEventListener("mousemove", onMousemove, false);
    window.onresize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
}
function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
}
function onDragChanging(event) {
    if (points.length < 2) return;

    let point = mesh.position;
    let _idx = mesh._idx;
    updatePoints(points, _idx, point);

    totalDistance = updateDistanceArray(points, distanceArray);
    distanceDom.innerHTML = totalDistance.toFixed(2) + "m";
    const positions =
        "array" in line.geometry.attributes.position &&
        line.geometry.attributes.position.array;

    if (_idx === 0) {
        positions[0] = point.x;
        positions[1] = point.y;
        positions[2] = point.z;
    } else {
        let i = (2 * _idx - 1) * 3;
        positions[i] = point.x;
        positions[i + 1] = point.y;
        positions[i + 2] = point.z;
        positions[i + 3] = point.x;
        positions[i + 4] = point.y;
        positions[i + 5] = point.z;
    }

    line.geometry.attributes.position.needsUpdate = true;
}
function onDragend() {
    console.log(111);
    transformControls.detach();
}
function onMousedown(event) {
    raycaster.setFromCamera(mouse, camera);

    if (canDrawLine) {
        // 右键点击之后停止测距
        if (event.button === 2) {
            canDrawLine = false;
        }
        if (points.length > 0) {
            distanceArray.push(distance);
            totalDistance += distance;
            distance = 0
        }

        intersects = raycaster.intersectObject(plane);
        if (intersects.length === 0) return;
        let point = intersects[0].point;
        let newPoint = new THREE.Vector3(point.x, point.y, point.z);

        // 判断是否绘制完成
        if (points.length > 0 && canDrawLine === true) {
            points.push(newPoint, newPoint);
        } else {
            points.push(newPoint);
        }

        // 添加节点
        let marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 30, 30),
            new THREE.MeshBasicMaterial({ color: 0xff5fff })
        );
        marker._idx = index;
        marker.position.set(newPoint.x, newPoint.y, newPoint.z);
        markersGroup.add(marker);
        markers.push(marker);

        // 记录场景中点位的数量
        index++;

        if (!distanceDom) {
            distanceDom = document.createElement("span");
            distanceDom.style.position = "absolute";
            distanceDom.style.top = "0";
            distanceDom.style.color = "red";
            distanceDom.style.pointerEvents = "none";
            document.body.appendChild(distanceDom);
        }

        if (points.length > 1) {
            createLine(scene, points);
        }

        if (!canDrawLine) {
            scene.remove(dashLine);
            return;
        }

        // 如果存在虚线，更新虚线位置
        if (dashLine) {
            const positions =
                "array" in dashLine.geometry.attributes.position &&
                dashLine.geometry.attributes.position.array;

            positions[0] = positions[3];
            positions[1] = positions[4];
            positions[2] = positions[5];
            positions[3] = newPoint.x;
            positions[4] = newPoint.y;
            positions[5] = newPoint.z;

            dashLine.geometry.attributes.position.needsUpdate = true;
        } else {
            geometry = new THREE.BufferGeometry().setFromPoints([
                newPoint,
                newPoint,
            ]);
            dashLine = new THREE.LineSegments(
                geometry,
                new THREE.LineDashedMaterial({
                    color: 0xff5555,
                    transparent: true,
                    depthTest: false,
                    dashSize: 0.1,
                    gapSize: 1,
                })
            );
            dashLine.frustumCulled = false;
            dashLine.name = "dashLine";
            scene.add(dashLine);
        }
    } else {
        intersects = raycaster.intersectObject(markersGroup);
        if (intersects.length === 0) return;

        mesh = intersects[0].object;
        transformControls.attach(mesh);
    }
}
function updateLinePoints(line, point, arrayIndex) {
    const positions =
        "array" in line.geometry.attributes.position &&
        line.geometry.attributes.position.array;

    positions[arrayIndex] = point.x;
    positions[arrayIndex + 1] = point.y;
    positions[arrayIndex + 2] = point.z;

    line.geometry.attributes.position.needsUpdate = true;
}
function onMousemove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderer.domElement.offsetWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.offsetHeight) * 2 + 1;
    if (!canDrawLine) return;

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObject(plane);
    if (!intersects.length) return;

    nextPoint = intersects[0].point;
    if (points.length > 0) {
        const pre = points[points.length - 1];
        const v0 = new THREE.Vector3(pre.x, pre.y, pre.z);
        const v1 = new THREE.Vector3(nextPoint.x, nextPoint.y, nextPoint.z);
        distance = v0.distanceTo(v1);
    }

    if (!dashLine) return;
    updateLinePoints(dashLine, nextPoint, 3);
}
function createLine(scene, points) {
    if (line) scene.remove(line);
    geometry = new THREE.BufferGeometry().setFromPoints([...points]);
    line = new THREE.LineSegments(
        geometry,
        new THREE.LineBasicMaterial({
            color: 0xfff000,
            transparent: true,
            depthTest: false,
        })
    );
    line.renderOrder = 10;
    line.name = "line";
    line.onBeforeRender = () => {
        if (distanceDom) {
            let v = worldToScreenPosition(nextPoint, camera);
            distanceDom.style.left = v.x + 15 + "px";
            distanceDom.style.top = v.y - 15 + "px";
            distanceDom.innerHTML = (distance + totalDistance).toFixed(2) + "m";
        }
    };
    scene.add(line);
}
function updatePoints(points, index, point) {
    if (index === 0) {
        points[index] = point;
    } else if (index === points.length / 2) {
        points[points.length - 1] = point;
        nextPoint = points[points.length - 1];
    } else {
        points[2 * index - 1] = point;
        points[2 * index] = point;
    }
}
function updateDistanceArray(points, array) {
    let distance = 0;
    for (let i = 0; i < array.length; i++) {
        array[i] = points[2 * i].distanceTo(points[2 * i + 1]);
        distance += array[i];
    }
    return distance;
}
function dispose() {
    scene.traverse((e) => {
        if (e instanceof THREE.Mesh) {
            e.geometry.dispose();
            e.material.dispose();
        }
    });
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
}