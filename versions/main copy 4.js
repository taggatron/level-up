import * as THREE from 'three';
import { OrbitControls } from '/Users/danieltagg/Desktop/levelup/dist/three/examples/jsm/controls/OrbitControls.js';

// Create the scene
const scene = new THREE.Scene();

// Set up the renderer with antialiasing and higher resolution
const renderer = new THREE.WebGLRenderer({ antialias: true });
const resolutionMultiplier = 1; // Set to 1 for initial testing
renderer.setSize(window.innerWidth * resolutionMultiplier, window.innerHeight * resolutionMultiplier);
renderer.setPixelRatio(window.devicePixelRatio * resolutionMultiplier);
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFShadowMap; // Enable soft shadows PCFShadowMap is faster
document.body.appendChild(renderer.domElement);

// Create the camera with the original window dimensions for correct perspective
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Position the camera
camera.position.z = 5;
camera.position.y = 1.5;

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional for smoother controls
controls.dampingFactor = 0.05; // Optional

// Load textures
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('/wood_texture.jpg');
const stoneTexture = textureLoader.load('/stone_texture.jpg');
const boardTexture = textureLoader.load('/board_texture.jpg');

const boardNormalMap = textureLoader.load('/board_normal.png'); // Load as PNG
const boardLightMap = textureLoader.load('/board_ao.jpg'); 

const woodNormalMap = textureLoader.load('/wood_normal.png'); // Load as PNG
const woodLightMap = textureLoader.load('/wood_ao.jpg'); 

const stoneNormalMap = textureLoader.load('/stone_normal.png'); // Load as PNG
const stoneLightMap = textureLoader.load('/stone_ao.jpg'); 


// Create materials
const boardMaterial = new THREE.MeshStandardMaterial({
    map: boardTexture,
    normalMap: boardNormalMap,
    aoMap: boardLightMap,
    aoMapIntensity: 1,
    normalScale: new THREE.Vector2(1, 1),
});

const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    normalMap: woodNormalMap,
    aoMap: woodLightMap,
    aoMapIntensity: 1,
    normalScale: new THREE.Vector2(1, 1),
});

const stoneMaterial = new THREE.MeshStandardMaterial({
    map: stoneTexture,
    normalMap: stoneNormalMap,
    aoMap: stoneLightMap,
    aoMapIntensity: 1,
    normalScale: new THREE.Vector2(1, 1),
});

// Create the steps
const step1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1.0, 1), boardMaterial);
const step2 = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 1), boardMaterial);
const step3 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), boardMaterial);




// Position the steps
step1.position.set(0, 0.0, -0.8);
step2.position.set(0, 0.0, 0.2);
step3.position.set(0, 0.0, 1.2);



// Add steps to the scene
step1.castShadow = true;
step2.castShadow = true;
step3.castShadow = true;


scene.add(step1);
scene.add(step2);
scene.add(step3);



// Create the table
const tableTop = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 5), woodMaterial);
tableTop.receiveShadow = true; // Enable the floor to receive shadows
const tableLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0.2), woodMaterial);
const tableLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0.2), woodMaterial);
const tableLeg3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0.2), woodMaterial);
const tableLeg4 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0.2), woodMaterial);

// Position the table
tableTop.position.set(0, -0.5, 0);
tableLeg1.position.set(2, -1.5, 2);
tableLeg2.position.set(2, -1.5, -2);
tableLeg3.position.set(-2, -1.5, 2);
tableLeg4.position.set(-2, -1.5, -2);

// Add table to the scene
tableTop.castShadow = true;
tableLeg1.castShadow = true;
tableLeg2.castShadow = true;
tableLeg3.castShadow = true;
tableLeg4.castShadow = true;

scene.add(tableTop);
scene.add(tableLeg1);
scene.add(tableLeg2);
scene.add(tableLeg3);
scene.add(tableLeg4);


// Create the floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), stoneMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, -2.5, 0);
floor.receiveShadow = true; // Enable the floor to receive shadows
scene.add(floor);


// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows for the directional light
directionalLight.shadow.mapSize.width = 1024; // Reduced shadow map resolution
directionalLight.shadow.mapSize.height = 1024; // Reduced shadow map resolution
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.bias = -0.001;
scene.add(directionalLight);


// Render loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Update camera controls

    renderer.render(scene, camera);
}

animate();