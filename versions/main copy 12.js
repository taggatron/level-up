import * as THREE from 'three';
import { OrbitControls } from '/Users/danieltagg/Desktop/levelup/dist/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// Create the scene
const scene = new THREE.Scene();

// Set up the renderer with antialiasing and higher resolution
const renderer = new THREE.WebGLRenderer({ antialias: true });
const resolutionMultiplier = 0.8; // Set to 1 for initial testing
renderer.setSize(window.innerWidth * resolutionMultiplier, window.innerHeight * resolutionMultiplier);
renderer.setPixelRatio(window.devicePixelRatio * resolutionMultiplier);
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFShadowMap; // Enable soft shadows PCFShadowMap is faster
document.body.appendChild(renderer.domElement);

// Create the camera with the original window dimensions for correct perspective
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Position the camera
camera.position.x = 4.95;
camera.position.z = -6.05;
camera.position.y = 4.41;

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional for smoother controls
controls.dampingFactor = 0.05; // Optional

// Add HDR environment map
const exrLoader = new EXRLoader();
exrLoader.load('/assets/hdr_environment.exr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
});

// Load textures
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('/wood_texture.jpg');
const stoneTexture = textureLoader.load('/stone_texture.jpg');
const boardTexture = textureLoader.load('/board_texture.jpg');
const levelUpTitleTexture = textureLoader.load('/levelup_title.jpg');
const wallTexture = textureLoader.load('/wall_texture.jpg');
const wallNormalMap = textureLoader.load('/wall_normal.png');
const wallLightMap = textureLoader.load('/wall_ao.jpg');
const wallMetallicMap = textureLoader.load('/wall_metallic.jpg');
const wallDisplacementMap = textureLoader.load('/wall_displacement.tiff');

const boardNormalMap = textureLoader.load('/board_normal.png'); // Load as PNG
const boardLightMap = textureLoader.load('/board_ao.jpg');
const boardMetallicMap = textureLoader.load('/board_metallic.jpg');
const boardDisplacementMap = textureLoader.load('/board_displacement.tiff');

const woodNormalMap = textureLoader.load('/wood_normal.png'); // Load as PNG
const woodLightMap = textureLoader.load('/wood_ao.jpg');

const stoneNormalMap = textureLoader.load('/stone_normal.png'); // Load as PNG
const stoneLightMap = textureLoader.load('/stone_ao.jpg');
const stoneMetallicMap = textureLoader.load('/stone_metallic.jpg');
const stoneDisplacementMap = textureLoader.load('/stone_displacement.tiff');

// Create materials
const boardMaterial = new THREE.MeshStandardMaterial({
    map: boardTexture,
    normalMap: boardNormalMap,
    aoMap: boardLightMap,
    metalnessMap: boardMetallicMap,
    displacementMap: boardDisplacementMap,
    displacementScale: 0.1,
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
    metalnessMap: stoneMetallicMap,
    displacementMap: stoneDisplacementMap,
    displacementScale: 0.1,
    aoMapIntensity: 1,
    normalScale: new THREE.Vector2(1, 1),
});

const levelUpTitleMaterial = new THREE.MeshStandardMaterial({
  map: levelUpTitleTexture,
  normalMap: boardNormalMap,
  aoMap: boardLightMap,
  aoMapIntensity: 1,
    normalScale: new THREE.Vector2(1, 1),
});

const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    normalMap: wallNormalMap,
    aoMap: wallLightMap,
    metalnessMap: wallMetallicMap,
    displacementMap: wallDisplacementMap,
    displacementScale: 0.1,
    aoMapIntensity: 1,
    normalScale: new THREE.Vector2(0.5, 1),
});

// Create the steps
const step1 = new THREE.Mesh(new THREE.BoxGeometry(3, 1.0, 1), boardMaterial);
const step2 = new THREE.Mesh(new THREE.BoxGeometry(3, 2.0, 1), boardMaterial);
const step3 = new THREE.Mesh(new THREE.BoxGeometry(3, 3.0, 1), boardMaterial);

// Position the steps (adjust y-position to be on top of the table)
step1.position.set(0, 0.5, -0.8); // Adjusted y position to align with table
step2.position.set(0, 1, 0.2); // Adjusted y position to align with table
step3.position.set(0, 1.5, 1.2); // Adjusted y position to align with table

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

// Debugging for cubeRenderTarget and cubeCamera
let cubeRenderTarget;
let cubeCamera;

try {
    // Add cube camera for dynamic reflections
    cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
    });
    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    cubeCamera.position.copy(camera.position);
    scene.add(cubeCamera);
    console.log('Cube camera initialized:', cubeCamera);
} catch (error) {
    console.error('Error initializing CubeCamera:', error);
}

// Create materials
const reflectiveStoneMaterial = new THREE.MeshStandardMaterial({
    map: stoneTexture,
    normalMap: stoneNormalMap,
    aoMap: stoneLightMap,
    metalness: 0.8, // Increase metalness for reflectivity
    roughness: 0.1, // Lower roughness for shinier surface
    displacementMap: stoneDisplacementMap,
    displacementScale: 0.05, // Adjust displacement for subtle depth
});

if (cubeRenderTarget && cubeRenderTarget.texture) {
    reflectiveStoneMaterial.envMap = cubeRenderTarget.texture;
    console.log('envMap successfully assigned to reflectiveStoneMaterial');
} else {
    console.warn('envMap not properly assigned to reflectiveStoneMaterial');
}

// Create the floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), reflectiveStoneMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, -2.5, 0);
floor.receiveShadow = true; // Enable the floor to receive shadows
scene.add(floor);

// Log for debugging floor creation
console.log('Floor created with reflective material:', floor);


// Create the walls
const wallGeometry = new THREE.BoxGeometry(20, 5, 0.2); // Thin wall
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);

// Position the walls (excluding the side that faces the stairs)
wall1.position.set(0, -0.5, 10); // Front wall
wall2.position.set(-10, -0.5, 0); // Left wall
wall2.rotation.y = Math.PI / 2;
wall3.position.set(10, -0.5, 0);   // Right wall
wall3.rotation.y = -Math.PI / 2;

//Add walls to the scene
wall1.receiveShadow = true;
wall2.receiveShadow = true;
wall3.receiveShadow = true;

scene.add(wall1);
scene.add(wall2);
scene.add(wall3);


// Create shuffleboard object
const prismGeometry = new THREE.CylinderGeometry(0, 0.5, 2, 4, 1);
const prism = new THREE.Mesh(prismGeometry, levelUpTitleMaterial);
prism.rotation.z = Math.PI / 2; // Lay it horizontally
prism.castShadow = true;
scene.add(prism);

const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 32);
const handle = new THREE.Mesh(handleGeometry, levelUpTitleMaterial);
handle.rotation.z = Math.PI / 2; // Horizontal alignment
handle.position.set(0, 0.5, 0); // Position handle above the prism
handle.castShadow = true;
scene.add(handle);

prism.add(handle);

// Position the shuffleboard near the level-up board
prism.position.set(1.5, 1, 0.5);

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

const additionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
additionalLight1.position.set(-5, 8, -5);
additionalLight1.castShadow = true;
scene.add(additionalLight1);

const additionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
additionalLight2.position.set(0, 10, 0);
additionalLight2.castShadow = true;
scene.add(additionalLight2);

const gltfLoader = new GLTFLoader();

gltfLoader.load(
    '/assets/leveluptitle3dwords.glb',
    (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);

        model.position.sub(center); // Recenter the model to origin

        model.traverse((child) => {
             if(child.isMesh) {
                child.material = levelUpTitleMaterial;
            }
        });
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(1.5, 1, 0); // Adjusted for side positioning
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error("Error loading GLTF model", error);
    }
);

const fbxLoader = new FBXLoader();

fbxLoader.load(
    '/assets/PlantOrchid001.fbx',
    (fbx) => {
        // Adjust scale and position if necessary
        fbx.scale.set(0.05, 0.05, 0.05);
        fbx.position.set(0, -1.5, 9.5); // Position the plant near the front wall

        // Load and assign materials
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load('/assets/PlantOrchid001_COL_4K_METALNESS.jpg'),
            normalMap: textureLoader.load('/assets/PlantOrchid001_NRM_4K_METALNESS.jpg'),
            roughnessMap: textureLoader.load('/assets/PlantOrchid001_ROUGHNESS_4K_METALNESS.jpg'),
            metalnessMap: textureLoader.load('/assets/PlantOrchid001_METALNESS_4K_METALNESS.png'),
            aoMap: textureLoader.load('/assets/PlantOrchid001_SSS_4K_METALNESS.jpg'),
        });

        fbx.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = material;
            }
        });

        scene.add(fbx);
    },
    (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('Error loading FBX file:', error);
    }
);

// Add Raycaster and Mouse Vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedObject = null;
let isDragging = false;


// Create UI for display
const cameraCoords = document.createElement('div');
cameraCoords.style.position = 'absolute';
cameraCoords.style.top = '10px';
cameraCoords.style.left = '10px';
cameraCoords.style.color = 'white';
document.body.appendChild(cameraCoords);

const objectInfo = document.createElement('div');
objectInfo.style.position = 'absolute';
objectInfo.style.bottom = '10px';
objectInfo.style.left = '10px';
objectInfo.style.color = 'white';
objectInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
objectInfo.style.padding = '10px';
document.body.appendChild(objectInfo);

const objectList = document.createElement('div');
objectList.style.position = 'absolute';
objectList.style.top = '50px';
objectList.style.left = '10px';
objectList.style.color = 'white';
objectList.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
objectList.style.padding = '10px';
document.body.appendChild(objectList);

// Object management
const objectsMovableState = new Map(); // Track whether objects are movable

// Function to set names based on variable names
function setObjectName(variableName, object) {
    object.name = variableName;
}

// Example usage for naming objects
setObjectName('step1', step1);
setObjectName('step2', step2);
setObjectName('step3', step3);
setObjectName('tableTop', tableTop);
setObjectName('tableLeg1', tableLeg1);
setObjectName('tableLeg2', tableLeg2);
setObjectName('tableLeg3', tableLeg3);
setObjectName('tableLeg4', tableLeg4);
setObjectName('prism', prism);
setObjectName('handle', handle);

// Populate object list UI
function populateObjectList() {
    objectList.innerHTML = '<strong>Scene Objects:</strong><br>';

    scene.children.forEach((child) => {
        if (child.isMesh) {
            const isMovable = objectsMovableState.get(child) || false; // Default to non-movable

            const objectEntry = document.createElement('div');
            objectEntry.style.marginBottom = '5px';

            const objectName = document.createElement('span');
            objectName.textContent = `Object: ${child.name || 'Mesh'} `;

            const toggleButton = document.createElement('button');
            toggleButton.textContent = isMovable ? 'Disable Move' : 'Enable Move';
            toggleButton.style.marginLeft = '5px';

            toggleButton.addEventListener('click', () => {
                objectsMovableState.set(child, !isMovable);
                toggleButton.textContent = !isMovable ? 'Disable Move' : 'Enable Move';
            });

            objectEntry.appendChild(objectName);
            objectEntry.appendChild(toggleButton);
            objectList.appendChild(objectEntry);

            // Set default non-movable state
            objectsMovableState.set(child, false);
        }
    });
}


// Ensure UI is populated after adding all scene objects
populateObjectList();


// Event Listeners for interaction
window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (objectsMovableState.get(intersectedObject)) {
            selectedObject = intersectedObject;
            isDragging = true;
            updateObjectInfo(selectedObject);
        }
    }
});

window.addEventListener('mousemove', (event) => {
    if (isDragging && selectedObject) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(floor);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            selectedObject.position.set(point.x, selectedObject.position.y, point.z);
            updateObjectInfo(selectedObject);
        }
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    selectedObject = null;
});

// Update object information in the UI
function updateObjectInfo(object) {
    const position = object.position;
    const scale = object.scale;

    objectInfo.innerHTML = `
        <strong>Selected Object:</strong><br>
        Position: X: ${position.x.toFixed(2)}, Y: ${position.y.toFixed(2)}, Z: ${position.z.toFixed(2)}<br>
        Scale: X: ${scale.x.toFixed(2)}, Y: ${scale.y.toFixed(2)}, Z: ${scale.z.toFixed(2)}
    `;
}



// Animate Function
function animate() {
    requestAnimationFrame(animate);

    try {
        // Update cube camera for dynamic reflections
        if (cubeCamera && cubeRenderTarget) {
            floor.visible = false; // Hide floor during cube camera rendering
            cubeCamera.update(renderer, scene);
            floor.visible = true; // Show floor after rendering
        }

        controls.update(); // Update camera controls

        // Get camera coordinates for debugging
        const x = camera.position.x.toFixed(2);
        const y = camera.position.y.toFixed(2);
        const z = camera.position.z.toFixed(2);
        cameraCoords.textContent = `Camera Position: X: ${x}, Y: ${y}, Z: ${z}`;

        renderer.render(scene, camera);
    } catch (error) {
        console.error('Error during animation loop:', error);
    }
}

animate();
