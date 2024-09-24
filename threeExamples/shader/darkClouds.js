import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AxesHelper(50000))
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

const { mesh, uniforms } = getShaderMesh()
scene.add(mesh)

animate()
function animate() {
    uniforms.iTime.value += 0.01
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

function getShaderMesh() {
    const uniforms = {
        iTime: {
            value: 0
        },
        iResolution: {
            value: new THREE.Vector2(1900, 1900)
        },
        iChannel0: {
            value: window.iChannel0
        }
    }
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.ShaderMaterial({
        uniforms,
        side: 2,
        depthWrite: false,
        transparent: true,
        vertexShader: `
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() { 
                vUv = uv; 
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `   precision highp float;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;

        
vec3 rY(vec3 p, float a) {
    vec3 q = p;
    float c = cos(a);
    float s = sin(a);
    q.x = c * p.x + s * p.z;
    q.z = -s * p.x + c * p.z;
    
    return q;
}

// returns a pair of values for the distances along the ray at which there are sphere intersections, or 0 if none
vec2 sphereIntersectionDistances(vec3 rayOrigin, vec3 rayDirection, vec3 sphereOrigin, float sphereRadius) {
    vec3 toCenter = sphereOrigin - rayOrigin;
    float toCenterAlongRay = dot(toCenter, rayDirection);
    
    float perpendicularDistanceSquared = dot(toCenter, toCenter) - toCenterAlongRay * toCenterAlongRay;
    float radiusSquared = sphereRadius * sphereRadius;
    
    if (perpendicularDistanceSquared > radiusSquared) { // ray doesn’t touch the sphere
        return vec2(0.);
    }
    
    float insideSphereAlongRay = sqrt(radiusSquared - perpendicularDistanceSquared); // half the length of the portion of the ray inside the sphere
    
    float intersection1 = toCenterAlongRay - insideSphereAlongRay;
    float intersection2 = toCenterAlongRay + insideSphereAlongRay;
    if (intersection1 > intersection2) {
        float t = intersection1;
        intersection1 = intersection2;
        intersection2 = t;
    }
    
    if (intersection1 < 0.) { // first intersection is before the start of the ray
        if (intersection2 < 0.) { // ditto second, though that… shouldn’t happen?
            return vec2(0.);
        } else {
            intersection1 = intersection2;
            intersection2 = 0.;
        }
    }
    
    return vec2(intersection1, intersection2);
}

// -----------------

// 3d noise by iq, from https://www.shadertoy.com/view/Xsl3Dl

// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


vec3 hash( vec3 p )
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
    vec3 i = floor( p );
    vec3 f = fract( p );
	
	vec3 u = f*f*(3.0-2.0*f);

    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}


// hash functions by David Hoskins, from https://www.shadertoy.com/view/4djSRW

// Creative Commons Attribution-ShareAlike 4.0 International Public License

float hash11(float p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

vec3 hash31(float p)
{
   vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
   p3 += dot(p3, p3.yzx + 33.33);
   return fract((p3.xxy + p3.yzz) * p3.zyx); 
}


// -----------------

float octavedNoise(vec3 position) {
    vec3 samplePosition = position * 2.;
    float noiseAmount = noise(samplePosition + iTime * vec3(0.0,0.2,0.0));
    samplePosition *= 1.99;
    noiseAmount += noise(samplePosition + iTime * vec3(0.05,-0.37,0.02)) * 0.51;
    noiseAmount /= 1.51;
    return noiseAmount;
}

float density(vec3 position) {
    float baseValue = 1.0 - pow(max(0.0, length(position)), 2.0);
    float noiseAmount = octavedNoise(position);
    
    return max(0.,min(1.,baseValue - max(0.,noiseAmount * 1.5)));
}

vec4 innerLightPositionAndIntensity() {
    float scaledTime = iTime * 6.1;
    float hashInput = floor(scaledTime) * 0.1;
    
    if (hash11(hashInput) < 0.8) return vec4(0.); // mask out most of the flashes
        
    vec3 hash = hash31(hashInput);
    float theta = hash.x * 6.283;
    float z = hash.y * 2. - 1.;
    float sinPhi = sin(acos(z));
    vec3 position = vec3(sinPhi * cos(theta), sinPhi * sin(theta), z) * (0.6 + hash.z * 0.2);
    
    float intensity = sin(fract(scaledTime) * 3.142);
    
    return vec4(position, intensity);
}


// marching logic adapted from Ryan Brucks's article here: https://shaderbits.com/blog/creating-a-volumetric-ray-tracer

vec4 march(vec3 origin, vec3 direction) {
    
    const int mainSteps = 30;
    const int shadowSteps = 10;
    const vec3 toLight = normalize(vec3(1.0,1.0,0.));
    const float mainDensityScale = 4.;
    
    const float shadowingThreshold = 0.001;
    const float shadowDensityScale = 3.;
    
    vec3 light = vec3(0.);
    float transmittance = 1.;
    
    vec3 samplePosition = origin;
   
    const float mainStepLength = 2. / float(mainSteps); // why does lowering this below 2 change the appearance?
    const float shadowStepLength = 1. / float(shadowSteps);
    
    const vec3 scaledShadowDensity = shadowDensityScale * shadowStepLength / vec3(0.8,0.7,1.0);
    
    const float shadowConstant = -log(shadowingThreshold) / scaledShadowDensity.z;
    
    const vec3 mainLightColor = vec3(0.6,0.8,1.);
    const vec3 innerLightColor = vec3(0.7,0.4,1.) * 4.;
    
    vec3 mainStepAmount = direction * mainStepLength;
    
    vec3 shadowStepAmount = toLight * shadowStepLength;
    
    vec4 innerLight = innerLightPositionAndIntensity();
    
    for(int i = 0; i < mainSteps; i++) {
        float localDensity = min(1.0, density(samplePosition) * mainDensityScale);
        if (localDensity > 0.001) {
            
            // - main light (directional)
            
            vec3 shadowSamplePosition = samplePosition;
            float shadowAccumulation = 0.;
            for(int j = 0; j < shadowSteps; j++) {
                shadowSamplePosition += shadowStepAmount;
                
                shadowAccumulation += min(1.0, density(shadowSamplePosition) * shadowDensityScale);
                if (shadowAccumulation > shadowConstant || dot(shadowSamplePosition, shadowSamplePosition) > 1.) break;
            }
            
            vec3 shadowTerm = exp(-shadowAccumulation * scaledShadowDensity);
            float stepDensity = min(1.,localDensity * mainStepLength);
            vec3 absorbedLight = shadowTerm * stepDensity;
            
            // accumulate directional light
            light += absorbedLight * transmittance * mainLightColor;
            
            
            // - inner light (point)
            
            shadowSamplePosition = samplePosition;
            shadowAccumulation = 0.;
            vec3 toInnerLight = innerLight.xyz - samplePosition;
            vec3 innerLightShadowStepAmount = normalize(toInnerLight) * shadowStepLength;
            
            for(int j = 0; j < shadowSteps; j++) {
                shadowSamplePosition += innerLightShadowStepAmount;
                
                shadowAccumulation += min(1.0, density(shadowSamplePosition) * shadowDensityScale);
                
                // bail out if we’ve accumulated enough or if we’ve gone outside the bounding sphere (squared length of the sample position > 1)
                if (shadowAccumulation > shadowConstant || dot(shadowSamplePosition, shadowSamplePosition) > 1.) break;
            }
            
            shadowTerm = exp(-shadowAccumulation * scaledShadowDensity);
            stepDensity = min(1.,localDensity * mainStepLength);
            absorbedLight = shadowTerm * stepDensity;
            
            // inverse-squared fade of the inner point light
            float attenuation = min(1.0, 1.0 / (dot(toInnerLight, toInnerLight) * 2. + 0.0001)) * innerLight.w;
            
            // accumulate point light
            light += absorbedLight * (transmittance * attenuation) * innerLightColor;
            
            // -
            
            transmittance *= (1. - stepDensity);

            if (transmittance < 0.01) {
                break;
            }
        }
        
        samplePosition += mainStepAmount;
    }
    
    return vec4(vec3(light), transmittance);
}



        void main(void) {
            
            vec2 uv = (vUv - 0.5) * 2.0;
            uv.x *= iResolution.x / iResolution.y;
    const vec3 cameraLookAt = vec3(0.0, 0.0, 0.0);
    vec3 cameraPosition = rY(vec3(0.0, 0.1, 1.0) * 2.5, iTime * 0.2);
    vec3 cameraForward = normalize(cameraLookAt - cameraPosition);
    vec3 cameraRight = cross(cameraForward, vec3(0.0, 1.0, 0.0));
    vec3 cameraUp = cross(cameraRight, cameraForward);
    
	vec3 rayDirection = normalize(uv.x * cameraRight + uv.y * cameraUp + 2.0 * cameraForward);
    
    // closest and farthest intersections, if any, with the bounding sphere
    vec2 rayDistances = sphereIntersectionDistances(cameraPosition, rayDirection, vec3(0.), 1.);
    
    vec3 backgroundColor = vec3(0.1) - length(uv) * 0.04; // vignette
    
    if (rayDistances.x != 0. && rayDistances.y != 0.) {
        vec3 farIntersection = cameraPosition + rayDirection * rayDistances.y;
        
        vec4 value = march(farIntersection, -rayDirection);
        gl_FragColor = vec4(mix(value.rgb, backgroundColor, value.w), 1.0);
        
        // containing ball
        /*
        vec3 nearIntersection = cameraPosition + rayDirection * rayDistances.x;
        gl_FragColor += pow(1.0 - abs(dot(rayDirection, nearIntersection)), 8.) * 0.3;
		*/
    } else {
        gl_FragColor = vec4(backgroundColor, 1.0);
    } 
        }`
    })
    const mesh = new THREE.Mesh(geometry, material);
    return {
        mesh,
        uniforms
    }
}