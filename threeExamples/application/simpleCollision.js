import { Scene, Fog, Color, PerspectiveCamera, WebGLRenderer, DirectionalLight, AmbientLight, PlaneGeometry, MeshLambertMaterial, Mesh, GridHelper, Vector2, Line3, MeshStandardMaterial, Vector3, Box3, Matrix4, Clock, CapsuleGeometry, Box3Helper, } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
let scene, terrain, camera, controls, clock, renderer;
// 碰撞参数/三维世界参数
const params = {
    firstPerson: false,
    displayCollider: false,
    displayBVH: false,
    visualizeDepth: 10,
    gravity: -30,
    playerSpeed: 10,
    // 步长
    physicsSteps: 5,
};
// 分数布朗运动 用于生成随机地形
let fbm = `
    // https://github.com/yiwenl/glsl-fbm/blob/master/3d.glsl
    #define NUM_OCTAVES 6

    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

    float noise(vec3 p){
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);

        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);

        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);

        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));

        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

        return o4.y * d.y + o4.x * (1.0 - d.y);
    }


    float fbm(vec3 x) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100);
      for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }
  `;
let globalUniforms = {
    time: { value: 0 },
};
// 监听键盘初始值
let fwdPressed = false, bkdPressed = false, lftPressed = false, rgtPressed = false;
// player的速度 x,y,z三个方向上
let playerVelocity = new Vector3();
// 初始位置不在ground上
let playerIsOnGround = false;
let upVector = new Vector3(0, 1, 0);
let tempVector = new Vector3();
let tempVector2 = new Vector3();
let tempBox = new Box3();
let tempMat = new Matrix4();
let tempSegment = new Line3();
let init_scene = () => {
    scene = new Scene();
    scene.background = new Color(0.5, 1, 0.875);
    scene.fog = new Fog(scene.background, 20, 45);
    camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
    let vHeight = 3;
    camera.position.set(30, vHeight + 2, 20).setLength(15);
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, vHeight, 0);
    controls.update();
    // controls.minPolarAngle = Math.PI * 0.4;
    // controls.maxPolarAngle = Math.PI * 0.5;
    // controls.minDistance = 10;
    // controls.maxDistance = 20;
    controls.enableDamping = true;
    // controls.enablePan = false;
    let light = new DirectionalLight(0xffffff, 0.25);
    light.position.setScalar(1);
    scene.add(light, new AmbientLight(0xffffff, 0.75));
    clock = new Clock();
    // 键盘监听
    window.addEventListener("keydown", function (e) {
        switch (e.code) {
            case "KeyW":
                fwdPressed = true;
                break;
            case "KeyS":
                bkdPressed = true;
                break;
            case "KeyD":
                rgtPressed = true;
                break;
            case "KeyA":
                lftPressed = true;
                break;
            case "Space":
                if (playerIsOnGround) {
                    playerVelocity.y = 10.0;
                    playerIsOnGround = false;
                }
                break;
        }
    });
    window.addEventListener("keyup", function (e) {
        switch (e.code) {
            case "KeyW":
                fwdPressed = false;
                break;
            case "KeyS":
                bkdPressed = false;
                break;
            case "KeyD":
                rgtPressed = false;
                break;
            case "KeyA":
                lftPressed = false;
                break;
        }
    });
};
import { computeBoundsTree, MeshBVHHelper } from "three-mesh-bvh";

const add_helper = () => {
    const grid = new GridHelper(50, 50);
    scene.add(grid);
    const bvh_helper = new MeshBVHHelper(terrain, params.visualizeDepth);
    scene.add(bvh_helper);
};
import { ImprovedNoise } from "three/examples/jsm/Addons.js";
import { MeshBVH, acceleratedRaycast } from "three-mesh-bvh";
// 启用 BVH 加速光线投射功能
Mesh.prototype.raycast = acceleratedRaycast;
const load_collision_environment = () => {
    var _a, _b;
    let perlin = new ImprovedNoise();
    let plane = new PlaneGeometry(50, 50, 500, 500);
    plane.rotateX(-Math.PI / 2);
    let { position } = plane.attributes;
    let uv = plane.attributes.uv;
    let v2 = new Vector2();
    for (let i = 0; i < position.count; i++) {
        v2.fromBufferAttribute(uv, i).multiplyScalar(15);
        let n = perlin.noise(v2.x, v2.y, 0.314);
        n = Math.abs(n);
        n = Math.pow(n, 3);
        position.setY(i, Math.min(n * 35, 10));
    }
    plane.computeVertexNormals();
    let material = new MeshLambertMaterial({
        color: 0xface8d,
        // wireframe:true
    });
    material.onBeforeCompile = (shader) => {
        shader.uniforms.time = globalUniforms.time;
        shader.vertexShader = `
        varying vec3 vPos;
        ${shader.vertexShader}
        `.replace(`#include <begin_vertex>`, `#include <begin_vertex> 
      vPos = position;`);
        shader.fragmentShader = `
            #define ss(a,b,c) smoothstep(a,b,c)
            uniform float time;
            varying vec3 vPos;
            ${fbm}
            ${shader.fragmentShader}
        `
            .replace(`vec4 diffuseColor = vec4( diffuse, opacity );`, `
      vec3 col = diffuse;

      float d = noise(vPos * vec3(0.05, 1, 0.05));
      col = mix(col + 0.2, vec3(1, 0.2, 0.01), d);

      vec3 strokePos = vPos * vec3(0.1, 3., 0.1);
      d = fbm(strokePos);
      float e = fwidth(strokePos.y);
      col = mix(col * (0.5 + 0.5 * ss(2., 8., vPos.y)), col, ss(0.4 - e, 0.4, abs(d)));

      col = mix(diffuse + 0.1, col, ss(0.5, 1.5, vPos.y));

      // wind
      float dw = noise(vec3(vPos.x, vPos.y, vPos.z + time) * vec3(0.1, 10, 0.1));
      d = ss(0.1, 0., abs(dw));
      d = max(d, ss(1., 0., abs(dw)));
      d = max(d, pow(abs(noise(vPos - vec3(0, 0, time))), 1.));
      d *= smoothstep(2., -0.5, abs(vPos.y));
      col = mix(col, diffuse + 0.25, d);

      vec4 diffuseColor = vec4( col, opacity );
      `)
            .replace(`#include <dithering_fragment>`, `
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.5, 1, 0.875), pow(ss(7., 10., vPos.y), 0.5));
      `);
    };
    terrain = new Mesh(plane, material);
    terrain.geometry.computeBoundsTree = computeBoundsTree;
    (_b = (_a = terrain.geometry).computeBoundsTree) === null || _b === void 0 ? void 0 : _b.call(_a);
    // terrain.geometry.computeBoundingBox();
    // if (terrain.geometry.boundingBox) {
    //   addBoxHelper(terrain.geometry.boundingBox);
    // }
    scene.add(terrain);
    ready = true;
};
let player;
const add_player = () => {
    player = new Mesh(new CapsuleGeometry(0.3, 0.3, 4, 8), new MeshStandardMaterial());
    // player.geometry.translate(0, 0, 0);
    // 胶囊体信息
    player.userData.capsuleInfo = {
        radius: 0.5,
        segment: new Line3(new Vector3(), new Vector3(0, -0.5, 0.0)),
    };
    player.castShadow = true;
    player.receiveShadow = true;
    player.userData.boundsTree = new MeshBVH(player.geometry);
    if (!Array.isArray(player.material)) {
        player.material.shadowSide = 2;
    }
    scene.add(player);
};
// 地形碰撞环境
/**
 * Bounding volume hierarchy (BVH)即层次包围体，
 * 在BVH中，所有的几何物体都会被包在bounding volume的叶子节点里面，
 * bounding volume外面继续包着一个更大的bounding volume，
 * 递归地包裹下去，最终形成的根节点会包裹着整个场景。
 */
const addBoxHelper = (box) => {
    const helper = new Box3Helper(box);
    scene.add(helper);
};
// 检测碰撞
let ready, bvh_tree;
const detect_collision = () => {
    bvh_tree = terrain.geometry.boundsTree;
    player.geometry.computeBoundingBox();
    // adjust player position based on collisions
    const capsuleInfo = player.userData.capsuleInfo;
    tempBox.makeEmpty();
    tempMat.copy(terrain.matrixWorld).invert();
    tempSegment.copy(capsuleInfo.segment);
    // get the position of the capsule in the local space of the collider
    tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);
    tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);
    // get the axis aligned bounding box of the capsule
    tempBox.expandByPoint(tempSegment.start);
    tempBox.expandByPoint(tempSegment.end);
    tempBox.min.addScalar(-capsuleInfo.radius);
    tempBox.max.addScalar(capsuleInfo.radius);
    addBoxHelper(tempBox);
    bvh_tree.shapecast({
        intersectsBounds: (box) => box.intersectsBox(tempBox),
        intersectsTriangle: (tri) => {
            // check if the triangle is intersecting the capsule and adjust the
            // capsule position if it is.
            const triPoint = tempVector;
            const capsulePoint = tempVector2;
            const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint);
            if (distance < capsuleInfo.radius) {
                const depth = capsuleInfo.radius - distance;
                const direction = capsulePoint.sub(triPoint).normalize();
                tempSegment.start.addScaledVector(direction, depth);
                tempSegment.end.addScaledVector(direction, depth);
            }
        },
    });
};
function reset() {
    playerVelocity.set(0, 0, 0);
    player.position.set(0, 15, 0);
    camera.position.sub(controls.target);
    controls.target.copy(player.position);
    camera.position.add(player.position);
    controls.update();
}
// 渲染器
const render = () => {
    requestAnimationFrame(render);
    const delta = Math.min(clock.getDelta(), 0.1);
    const physicsSteps = params.physicsSteps;
    if (ready) {
        for (let i = 0; i < physicsSteps; i++) {
            update_player(delta / physicsSteps);
        }
    }
    controls.update();
    renderer.render(scene, camera);
};
// 控制器
function update_player(delta) {
    // player是否在地面上
    if (playerIsOnGround) {
        // 在 y方向速度
        playerVelocity.y = delta * params.gravity;
    }
    else {
        // 不在 y方向速度
        playerVelocity.y += delta * params.gravity;
    }
    // 更新位置
    player.position.addScaledVector(playerVelocity, delta);
    // move the player
    // 当前的水平旋转角度
    const angle = controls.getAzimuthalAngle();
    if (fwdPressed) {
        // tempVector：行进方向
        tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle);
        player.position.addScaledVector(tempVector, params.playerSpeed * delta);
    }
    if (bkdPressed) {
        tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle);
        player.position.addScaledVector(tempVector, params.playerSpeed * delta);
    }
    if (lftPressed) {
        tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle);
        player.position.addScaledVector(tempVector, params.playerSpeed * delta);
    }
    if (rgtPressed) {
        tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle);
        player.position.addScaledVector(tempVector, params.playerSpeed * delta);
    }
    player.updateMatrixWorld();
    detect_collision();
    // get the adjusted position of the capsule collider in world space after checking
    // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
    // the origin of the player model.
    const newPosition = tempVector;
    newPosition.copy(tempSegment.start).applyMatrix4(terrain.matrixWorld);
    // check how much the collider was moved
    const deltaVector = tempVector2;
    deltaVector.subVectors(newPosition, player.position);
    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    playerIsOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25);
    const offset = Math.max(0.0, deltaVector.length() - 1e-5);
    deltaVector.normalize().multiplyScalar(offset);
    // adjust the player model
    player.position.add(deltaVector);
    if (!playerIsOnGround) {
        deltaVector.normalize();
        playerVelocity.addScaledVector(deltaVector, -deltaVector.dot(playerVelocity));
    }
    else {
        playerVelocity.set(0, 0, 0);
    }
    // 掉下去了
    if (player.position.y < -25) {
        reset();
    }
}
init_scene();
load_collision_environment();
add_player();
add_helper();
render();
