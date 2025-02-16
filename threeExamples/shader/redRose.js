import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const flowerVs=`

uniform float uTime;
varying vec2 vUv;
void main(){
    gl_Position=vec4(position,1.);
    vUv=uv;
}
`;
const flowerFs=`


varying vec2 vUv;
uniform float uTime;
uniform float uAspectRatio;

float flower(vec3 p,  float r)
 {     
     vec3 n=normalize(p);
     
     float q=length(p);
     
     float rho=atan(length(vec2(n.x,n.z)),n.y)*15.0+q*10.01-uTime*4.;//vertical part of  cartesian to polar with some q warp

     float theta=atan(n.x,n.z)*5.0+p.y*3.0+rho*2.0-uTime ;//horizontal part plus some warp by z(bend up) and by rho(twist)
 
     return length(p) -(r+sin(theta)*0.5*(1.5-abs(dot(n,vec3(0,1,0)) )) //the 1-abs(dot()) is limiting the warp effect at poles
                        +sin(rho)*0.3  *(1.5-abs(dot(n,vec3(0,1,0)) )) );// 1.3-abs(dot()means putting some back in 
 }

vec2 map( in vec3 pos )
{
      
    return vec2( flower(pos, 0.750), 5.1 + (sin(uTime)/2.)) ;
    
}

vec2 castRay( in vec3 ro, in vec3 rd )
{
    float tmin = 1.0;
    float tmax = 20.0;
    
#if 0
    float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) tmax = min( tmax, tp1 );
    float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) tmin = max( tmin, tp2 );
                                                 else           tmax = min( tmax, tp2 ); }
#endif
    
	float precis = 0.01;
    float t = tmin;
    float m = -1.0;
    for( int i=0; i<400; i++ )
    {
	    vec2 res = map( ro+rd*t );
        if( res.x<precis || t>tmax ) break;
        t += res.x*0.05;
	    m = res.y;
    }

    if( t>tmax ) m=-1.0;
    return vec2( t, m );
}

vec3 calcNormal( in vec3 pos )
{
	vec3 eps = vec3( 0.001, 0.0, 0.0 );
	vec3 nor = vec3(
	    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
	    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
	    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
	return normalize(nor);
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<15; i++ )
    {
        float hr = 0.05 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec3 render( in vec3 ro, in vec3 rd )
{ 
    vec3 col = vec3(0.85, 0.8, .9) +rd.y*0.9;
    vec2 res = castRay(ro,rd);
    float t = res.x;
	float m = res.y;
    if( m>-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );
        vec3 ref = reflect( rd, nor );
        
        // material        
        col =0.60+ vec3(1.0,0.0,0.0);
		
        if( m<1.5 )
        {
            
            float f = mod( floor(5.0*pos.z) + floor(5.0*pos.x), 2.0);
            col = 0.4 + 0.1*f*vec3(1.0);
        }

        // lighitng        
        float occ = calcAO( pos, nor ) ;
		vec3  lig =  normalize( vec3(-0.6, 0.7, -0.5) );
		float amb =0.0;// clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
        float dif  = clamp( dot( nor, lig ), 0.0, 1.0 );
        float bac =0.0;// clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
        float dom = smoothstep( -0.1, 0.1, ref.y );
        float fre = 0.750;//pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
		float spe = 0.0;//pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);

		vec3 lin = vec3(0.0);
        lin += 1.20*dif*vec3(1.00,0.85,0.55);
		lin += 1.20*spe*vec3(1.00,0.85,0.55)*dif;
        lin += 0.20*amb*vec3(0.50,0.70,1.00)*occ;
        lin += 0.30*dom*vec3(0.50,0.70,1.00)*occ;
        lin += 0.30*bac*vec3(0.25,0.25,0.25)*occ;
        lin += 0.40*fre*vec3(1.00,1.00,1.00)*occ;
		col = col*lin;

    	col = mix( col, vec3(0.7,0.4,.3), 1.0-exp( -0.01*t*t ) );

    }

	return vec3( clamp(col,0.0,1.0) );
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void main(){
    vec2 q = vUv;
    vec2 p = -1.0+2.0*q;
	p.x *=  uAspectRatio;
    // vec2 mo = iMouse.xy/iResolution.xy;
		 
	float time = 15.0 + uTime*3.0;

	// camera	
    vec3 ro = vec3(0.0,4.0,4.0);
  
 	vec3 ta = vec3( -0.0, 0.0, 0.0 );
	
	// camera-to-world transformation
    mat3 ca = setCamera( ro, ta, 0.0 );
    
    // ray direction
	vec3 rd = ca * normalize( vec3(p.xy,3.0) );

    // render	
    vec3 col = render( ro, rd );

	//col = pow( col, vec3(0.7, 1., .9) );

    gl_FragColor=vec4( col, 1.0 );
}
`

// Debug
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: null,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
sizes.resolution = new THREE.Vector2(
  window.innerWidth * sizes.pixelRatio,
  window.innerHeight * sizes.pixelRatio
);
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 10, 0);
scene.add(camera);
/**
 * Renderer
 */
var renderer = new THREE.WebGLRenderer({
  antialias: window.devicePixelRatio < 2,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById("box").appendChild(renderer.domElement);
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


const plane=new THREE.PlaneGeometry(2,2,1,1);
const planeMaterial=new THREE.ShaderMaterial({
  vertexShader: flowerVs,
  fragmentShader: flowerFs,
  uniforms:{
    uTime:{value:0},
    uAspectRatio:{value:sizes.resolution.x/sizes.resolution.y}
  }
})
const planeMesh=new THREE.Mesh(plane,planeMaterial);
planeMesh.rotation.x=-Math.PI/2;
scene.add(planeMesh);

/**
 * Debugger
 */
const debugObject = {
  clearColor: "#1a1414",
};

/**
 * Animate
 */
const clock = new THREE.Clock();
let time = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  time = elapsedTime;
  controls.update();

  planeMaterial.uniforms.uTime.value=elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution.set(
    window.innerWidth * sizes.pixelRatio,
    window.innerHeight * sizes.pixelRatio
  );
  camera.aspect = sizes.width / sizes.height;
  planeMaterial.uniforms.uAspectRatio.value=sizes.resolution.x/sizes.resolution.y;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});
