import './style.css'
import * as THREE from 'three'
// import {
//     OrbitControls
// } from 'three/examples/jsm/controls/OrbitControls.js'
import {ObjectControls} from 'threejs-object-controls/ObjectControls.js'
import * as dat from 'lil-gui'
import VertexShader from './shaders/vertex.glsl'
import FragmentShader from './shaders/fragment.glsl'
import { Vector3 } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// controls
var earthcontrols;

/**
 * main page
 */

// earth
let earth_g = new THREE.SphereGeometry(1, 10, 10);
let earth_m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
let earth = new THREE.Mesh(earth_g, earth_m);
earth.position.x = 1.4;
scene.add(earth);

// light
const light = new THREE.AmbientLight(0x000000); // soft white light
scene.add(light);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height 
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera( 30, sizes.width / sizes.height, .1, 1000 );
camera.position.x = 2
camera.position.y = 2
// camera.position.z = 1
scene.add(camera)
const camerahelper = new THREE.CameraHelper( camera );
scene.add( camerahelper );

// Controls

// earthcontrols = new ObjectControls(camera, canvas, earth);
// earthcontrols.setDistance(8, 200); // sets the min - max distance able to zoom
// earthcontrols.setZoomSpeed(1); // sets the zoom speed ( 0.1 == slow, 1 == fast)
// earthcontrols.disableZoom();

// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.enableZoom = false
// controls.enablePan = false
// controls.enableRotate = false
// controls.screenSpacePanning = false
// controls.object = camera;
// controls.target.set(0,-1.2,0);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update material
    // material.uniforms.uTime.value = elapsedTime

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()