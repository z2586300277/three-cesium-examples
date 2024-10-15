import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(2, 1, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/')).load(HOST + '/files/model/car.glb', gltf => scene.add(gltf.scene))

const pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 0)

pointLight.position.set(0, 10, 0)

scene.add(pointLight)

const AmbientLight = new THREE.AmbientLight(0xffffff, 0.5)

scene.add(AmbientLight)

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

import {
    Color,
    Matrix4,
    Mesh,
    PerspectiveCamera,
    Plane,
    ShaderMaterial,
    UniformsUtils,
    Vector3,
    Vector4,
    WebGLRenderTarget,
    HalfFloatType,
} from "three";

class Reflector extends Mesh {
    constructor(geometry, options = {}) {
        super(geometry);

        this.isReflector = true;

        this.type = "Reflector";
        this.camera = new PerspectiveCamera();

        const scope = this;

        const color =
            options.color !== undefined
                ? new Color(options.color)
                : new Color(0x7f7f7f);
        const textureWidth = options.textureWidth || 512;
        const textureHeight = options.textureHeight || 512;
        const clipBias = options.clipBias || 0;
        const shader = options.shader || Reflector.ReflectorShader;
        const multisample =
            options.multisample !== undefined ? options.multisample : 4;

        //

        const reflectorPlane = new Plane();
        const normal = new Vector3();
        const reflectorWorldPosition = new Vector3();
        const cameraWorldPosition = new Vector3();
        const rotationMatrix = new Matrix4();
        const lookAtPosition = new Vector3(0, 0, -1);
        const clipPlane = new Vector4();

        const view = new Vector3();
        const target = new Vector3();
        const q = new Vector4();

        const textureMatrix = new Matrix4();
        const virtualCamera = this.camera;

        const renderTarget = new WebGLRenderTarget(
            textureWidth,
            textureHeight,
            { samples: multisample, type: HalfFloatType }
        );

        const material = new ShaderMaterial({
            name: shader.name !== undefined ? shader.name : "unspecified",
            uniforms: UniformsUtils.clone(shader.uniforms),
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            transparent: true,
        });

        material.uniforms["tDiffuse"].value = renderTarget.texture;
        material.uniforms["_opacity"].value = options.opacity || 1;
        material.uniforms["color"].value = color;
        material.uniforms["textureMatrix"].value = textureMatrix;

        this.material = material;
        this.count = 0;
        this.onBeforeRender = (renderer, scene, camera) => {
            this.count++;

            // if (this.count % 4 === 0) {
            //     return;
            // }

            reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
            cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

            rotationMatrix.extractRotation(scope.matrixWorld);

            normal.set(0, 0, 1);
            normal.applyMatrix4(rotationMatrix);

            view.subVectors(reflectorWorldPosition, cameraWorldPosition);

            // Avoid rendering when reflector is facing away

            if (view.dot(normal) > 0) return;

            view.reflect(normal).negate();
            view.add(reflectorWorldPosition);

            rotationMatrix.extractRotation(camera.matrixWorld);

            lookAtPosition.set(0, 0, -1);
            lookAtPosition.applyMatrix4(rotationMatrix);
            lookAtPosition.add(cameraWorldPosition);

            target.subVectors(reflectorWorldPosition, lookAtPosition);
            target.reflect(normal).negate();
            target.add(reflectorWorldPosition);

            virtualCamera.position.copy(view);
            virtualCamera.up.set(0, 1, 0);
            virtualCamera.up.applyMatrix4(rotationMatrix);
            virtualCamera.up.reflect(normal);
            virtualCamera.lookAt(target);

            virtualCamera.far = camera.far; // Used in WebGLBackground

            virtualCamera.updateMatrixWorld();
            virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

            // Update the texture matrix
            textureMatrix.set(
                0.5,
                0.0,
                0.0,
                0.5,
                0.0,
                0.5,
                0.0,
                0.5,
                0.0,
                0.0,
                0.5,
                0.5,
                0.0,
                0.0,
                0.0,
                1.0
            );
            textureMatrix.multiply(virtualCamera.projectionMatrix);
            textureMatrix.multiply(virtualCamera.matrixWorldInverse);
            textureMatrix.multiply(scope.matrixWorld);

            // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
            // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
            reflectorPlane.setFromNormalAndCoplanarPoint(
                normal,
                reflectorWorldPosition
            );
            reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

            clipPlane.set(
                reflectorPlane.normal.x,
                reflectorPlane.normal.y,
                reflectorPlane.normal.z,
                reflectorPlane.constant
            );

            const projectionMatrix = virtualCamera.projectionMatrix;

            q.x =
                (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
                projectionMatrix.elements[0];
            q.y =
                (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
                projectionMatrix.elements[5];
            q.z = -1.0;
            q.w =
                (1.0 + projectionMatrix.elements[10]) /
                projectionMatrix.elements[14];

            // Calculate the scaled plane vector
            clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

            // Replacing the third row of the projection matrix
            projectionMatrix.elements[2] = clipPlane.x;
            projectionMatrix.elements[6] = clipPlane.y;
            projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
            projectionMatrix.elements[14] = clipPlane.w;

            // Render
            scope.visible = false;

            const currentRenderTarget = renderer.getRenderTarget();

            const currentXrEnabled = renderer.xr.enabled;
            const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

            renderer.xr.enabled = false; // Avoid camera modification
            renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

            renderer.setRenderTarget(renderTarget);

            renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

            if (renderer.autoClear === false) renderer.clear();

            // filter

            options.filter.forEach((name) => {
                const mesh = scene.getObjectByName(name);
                mesh.visible = false;
            });

            renderer.render(scene, virtualCamera);

            options.filter.forEach((name) => {
                const mesh = scene.getObjectByName(name);
                mesh.visible = true;
            });

            renderer.xr.enabled = currentXrEnabled;
            renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

            renderer.setRenderTarget(currentRenderTarget);

            // Restore viewport

            const viewport = camera.viewport;

            if (viewport !== undefined) {
                renderer.state.viewport(viewport);
            }

            scope.visible = true;
        };

        this.getRenderTarget = function () {
            return renderTarget;
        };

        this.dispose = function () {
            renderTarget.dispose();
            scope.material.dispose();
        };
    }
}

Reflector.ReflectorShader = {
    name: "ReflectorShader",

    uniforms: {
        color: {
            value: null,
        },

        tDiffuse: {
            value: null,
        },

        textureMatrix: {
            value: null,
        },
        _opacity: {
            value: null,
        },
    },

    vertexShader: /* glsl */ `
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,

    fragmentShader: /* glsl */ `
		uniform vec3 color;
		uniform float _opacity;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( base.rgb , 0.1 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`,
};

/**
 * @description: 为mesh的材质增加反光效果
 * @param {*} mesh
 * @return {*}
 */
function addReflectorEffect(mesh, options = { filter: [] }) {
    const material = mesh.material;

    // material.isReflector = true;

    // material.type = "Reflector";
    const camera = new PerspectiveCamera();

    const textureWidth = options.textureWidth || 512;
    const textureHeight = options.textureHeight || 512;
    const clipBias = options.clipBias || 0;
    const shader = options.shader || Reflector.ReflectorShader;
    const multisample =
        options.multisample !== undefined ? options.multisample : 4;

    const reflectorPlane = new Plane();
    const normal = new Vector3();
    const reflectorWorldPosition = new Vector3();
    const cameraWorldPosition = new Vector3();
    const rotationMatrix = new Matrix4();
    const lookAtPosition = new Vector3(0, 0, -1);
    const clipPlane = new Vector4();

    const view = new Vector3();
    const target = new Vector3();
    const q = new Vector4();

    const textureMatrix = new Matrix4();
    const virtualCamera = camera;

    const renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, {
        samples: multisample,
        type: HalfFloatType,
    });

    const appendUniforms = {
        refDiffuse: { value: renderTarget.texture },
        // refOpacity: { value: options.opacity || 1 },
        refTextureMatrix: { value: textureMatrix },
    };

    material.onBeforeCompile = (shader) => {

        Object.assign(shader.uniforms, appendUniforms);
        shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `
            #include <common>
            uniform mat4 refTextureMatrix;
            varying vec4 refUv;
        `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <common>",
            `
            #include <common>
            uniform sampler2D refDiffuse;
            varying vec4 refUv;
        `
        );
        shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>
            refUv = refTextureMatrix * vec4( position, 1.0 );
        `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <dithering_fragment>",
            `
            #include <dithering_fragment>
            
            gl_FragColor.rgb += texture2DProj( refDiffuse, refUv ).rgb;
			gl_FragColor.a =  ${options.opacity || "1.0"};

        `
        );
        // uniform sampler2D refDiffuse;
        // varying vec4 vUv;
        // console.log(shader.fragmentShader);
    };

    mesh.material.onBeforeRender = (renderer, scene, camera) => {
        reflectorWorldPosition.setFromMatrixPosition(mesh.matrixWorld);
        cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

        rotationMatrix.extractRotation(mesh.matrixWorld);

        normal.set(0, 0, 1);
        normal.applyMatrix4(rotationMatrix);

        view.subVectors(reflectorWorldPosition, cameraWorldPosition);

        // Avoid rendering when reflector is facing away

        if (view.dot(normal) > 0) return;

        view.reflect(normal).negate();
        view.add(reflectorWorldPosition);

        rotationMatrix.extractRotation(camera.matrixWorld);

        lookAtPosition.set(0, 0, -1);
        lookAtPosition.applyMatrix4(rotationMatrix);
        lookAtPosition.add(cameraWorldPosition);

        target.subVectors(reflectorWorldPosition, lookAtPosition);
        target.reflect(normal).negate();
        target.add(reflectorWorldPosition);

        virtualCamera.position.copy(view);
        virtualCamera.up.set(0, 1, 0);
        virtualCamera.up.applyMatrix4(rotationMatrix);
        virtualCamera.up.reflect(normal);
        virtualCamera.lookAt(target);

        virtualCamera.far = camera.far; // Used in WebGLBackground

        virtualCamera.updateMatrixWorld();
        virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

        // Update the texture matrix
        textureMatrix.set(
            0.5,
            0.0,
            0.0,
            0.5,
            0.0,
            0.5,
            0.0,
            0.5,
            0.0,
            0.0,
            0.5,
            0.5,
            0.0,
            0.0,
            0.0,
            1.0
        );
        textureMatrix.multiply(virtualCamera.projectionMatrix);
        textureMatrix.multiply(virtualCamera.matrixWorldInverse);
        textureMatrix.multiply(mesh.matrixWorld);

        // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
        // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
        reflectorPlane.setFromNormalAndCoplanarPoint(
            normal,
            reflectorWorldPosition
        );
        reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

        clipPlane.set(
            reflectorPlane.normal.x,
            reflectorPlane.normal.y,
            reflectorPlane.normal.z,
            reflectorPlane.constant
        );

        const projectionMatrix = virtualCamera.projectionMatrix;

        q.x =
            (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
            projectionMatrix.elements[0];
        q.y =
            (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
            projectionMatrix.elements[5];
        q.z = -1.0;
        q.w =
            (1.0 + projectionMatrix.elements[10]) /
            projectionMatrix.elements[14];

        // Calculate the scaled plane vector
        clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

        // Replacing the third row of the projection matrix
        projectionMatrix.elements[2] = clipPlane.x;
        projectionMatrix.elements[6] = clipPlane.y;
        projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
        projectionMatrix.elements[14] = clipPlane.w;

        // Render
        // TODO : 于一体的反光 不能将自己隐去 只是不显示反射纹理
        mesh.visible = false;

        const currentRenderTarget = renderer.getRenderTarget();

        const currentXrEnabled = renderer.xr.enabled;
        const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

        renderer.xr.enabled = false; // Avoid camera modification
        renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

        renderer.setRenderTarget(renderTarget);

        renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

        if (renderer.autoClear === false) renderer.clear();

        // filter

        options.filter.forEach((name) => {
            const mesh = scene.getObjectByName(name);
            mesh.visible = false;
        });

        renderer.render(scene, virtualCamera);

        options.filter.forEach((name) => {
            const mesh = scene.getObjectByName(name);
            mesh.visible = true;
        });

        renderer.xr.enabled = currentXrEnabled;
        renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

        renderer.setRenderTarget(currentRenderTarget);

        // Restore viewport

        const viewport = camera.viewport;

        if (viewport !== undefined) {
            renderer.state.viewport(viewport);
        }

        mesh.visible = true;
    };
}

new GLTFLoader().load(FILE_HOST + '/files/model/floor.glb', gltf => {

    scene.add(gltf.scene)

    gltf.scene.traverse(child => {

        if (child.isMesh) {

            addReflectorEffect(child, {

                color: 0xffffff,

                clipBias: 0.003,

                filter: []

            })

        }

    })

})





