// Remove all import statements and use global THREE, GLTFLoader, FBXLoader, EXRLoader, OrbitControls
// (CDN scripts will be loaded in index.html)

// Create the scene
const scene = new THREE.Scene();

// Set up the renderer with antialiasing and full window size
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFShadowMap; // Enable soft shadows PCFShadowMap is faster
document.body.appendChild(renderer.domElement);

// Create the camera with the original window dimensions for correct perspective
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Position the camera
camera.position.x = 4.95;
camera.position.z = -6.05;
camera.position.y = 4.41;

// Add OrbitControls for camera movement
let controls;
if (typeof OrbitControls !== 'undefined') {
    controls = new OrbitControls(camera, renderer.domElement);
} else if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
} else {
    console.error('OrbitControls not found. Camera controls will not be available.');
}

if (controls) {
    controls.enableDamping = true; // Smooth camera movement
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below the ground

    // Set the target to look at the center of the stairs
    controls.target.set(0, 1, 0.2);
    controls.update();
}

// Keyboard controls for camera movement
const keys = {
    w: false, s: false, a: false, d: false,
    q: false, e: false, // Up and down movement
    shift: false // Speed modifier
};

const cameraSpeed = 0.1;
const fastSpeed = 0.3;

// Track key states
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = true;
        event.preventDefault(); // Prevent default browser behavior
    }
    if (event.key === 'Shift') {
        keys.shift = true;
        event.preventDefault();
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = false;
        event.preventDefault();
    }
    if (event.key === 'Shift') {
        keys.shift = false;
        event.preventDefault();
    }
});

// Function to update camera position based on keyboard input
function updateCameraMovement() {
    if (!controls) return;
    
    const speed = keys.shift ? fastSpeed : cameraSpeed;
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    // Get camera direction vectors
    camera.getWorldDirection(direction);
    right.crossVectors(camera.up, direction).normalize();
    
    // Forward/Backward (W/S)
    if (keys.w) {
        camera.position.addScaledVector(direction, speed);
        controls.target.addScaledVector(direction, speed);
    }
    if (keys.s) {
        camera.position.addScaledVector(direction, -speed);
        controls.target.addScaledVector(direction, -speed);
    }
    
    // Left/Right (A/D)
    if (keys.a) {
        camera.position.addScaledVector(right, speed);
        controls.target.addScaledVector(right, speed);
    }
    if (keys.d) {
        camera.position.addScaledVector(right, -speed);
        controls.target.addScaledVector(right, -speed);
    }
    
    // Up/Down (Q/E)
    if (keys.q && camera.position.y > 0.5) { // Prevent going below a minimum height
        camera.position.y -= speed;
        controls.target.y -= speed;
    }
    if (keys.e) {
        camera.position.y += speed;
        controls.target.y += speed;
    }
    
    controls.update();
}

// Prevent context menu on right click
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Prevent scrolling with mouse wheel when not over the canvas
document.addEventListener('wheel', (event) => {
    event.preventDefault();
}, { passive: false });

// Add HDR environment map
// Temporarily commented out due to EXRLoader issues
/*
const exrLoader = new EXRLoader();
exrLoader.load('/assets/hdr_environment.exr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
});
*/

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

// Point the camera towards stair step 1 (after step1 is created)
camera.lookAt(step1.position);

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


const prismMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00, // Green material
    side: THREE.DoubleSide // Render both sides of the faces
});


// Create a triangular-based prism geometry
const prismGeometry = new THREE.BufferGeometry();

// Define the vertices
const vertices = new Float32Array([
    // Base vertices
    0, 0, 0,   // Vertex 0
    1, 0, 0,   // Vertex 1
    0, 0, 1,   // Vertex 2
    // Top vertices
    0, 1, 0,   // Vertex 3 (corresponding to Vertex 0)
    1, 1, 0,   // Vertex 4 (corresponding to Vertex 1)
    0, 1, 1    // Vertex 5 (corresponding to Vertex 2)
]);

// Define the faces (triangles) using indices
const indices = [
    // Base face
    0, 1, 2,
    // Top face
    3, 4, 5,
    // Side face 1
    0, 1, 4,
    0, 4, 3,
    // Side face 2
    1, 2, 5,
    1, 5, 4,
    // Side face 3
    2, 0, 3,
    2, 3, 5
];

// Apply vertices and indices to the geometry
prismGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
prismGeometry.setIndex(indices);

// Compute normals for lighting calculations
prismGeometry.computeVertexNormals();

// Create the mesh
const prism = new THREE.Mesh(prismGeometry, prismMaterial);
prism.castShadow = true;



// Add a cylinder to one of the non-hypotenuse faces
const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red material
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

// Position the cylinder perpendicular to the face (0, 1, 3)
cylinder.position.set(-0.5, 0.5, 0.5); // Centered on the face
cylinder.rotation.z = Math.PI / 2; // Align perpendicular to the face
cylinder.castShadow = true;

// Group the pyramid and cylinder into one object
const combinedObject = new THREE.Group();
combinedObject.add(prism);
combinedObject.add(cylinder);
combinedObject.position.set(3,3,2);

// Add the combined object to the scene
scene.add(combinedObject);


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

// Temporarily commented out due to GLTFLoader and FBXLoader issues
/*
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

// Load the Counterpusher GLB model
gltfLoader.load(
    '/assets/counterpusher.glb',
    (gltf) => {
        const model = gltf.scene;

        // Apply main texture and board-related textures
        const mainTexture = textureLoader.load('/lvltitleholder.jpg');
        const boardTexture = textureLoader.load('/board_texture.jpg');
        const boardNormalMap = textureLoader.load('/board_normal.png');
        const boardMetallicMap = textureLoader.load('/board_metallic.jpg');

        const customMaterial = new THREE.MeshStandardMaterial({
            map: mainTexture,
            normalMap: boardNormalMap,
            aoMap: boardLightMap,
            metalnessMap: boardMetallicMap,
            normalScale: new THREE.Vector2(1, 1),
        });

        // Traverse the model to apply the material
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = customMaterial;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Adjust scale and position if necessary
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 0, 0);

        // Assign name to the model
        model.name = 'Counter Pusher';

        // Add the model to the scene
        scene.add(model);
        populateObjectList(); // Refresh UI list after adding the model
    },
    undefined,
    (error) => {
        console.error('Error loading Counterpusher model:', error);
    }
);
*/


// Add Camera Coordinates Display
const cameraCoords = document.createElement('div');
cameraCoords.style.position = 'absolute';
cameraCoords.style.top = '10px';
cameraCoords.style.left = '10px';
cameraCoords.style.color = 'white';
document.body.appendChild(cameraCoords);

// Add Controls Help Display
const controlsHelp = document.createElement('div');
controlsHelp.style.position = 'absolute';
controlsHelp.style.top = '10px';
controlsHelp.style.right = '10px';
controlsHelp.style.color = 'white';
controlsHelp.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
controlsHelp.style.padding = '10px';
controlsHelp.style.fontSize = '12px';
controlsHelp.style.borderRadius = '5px';
controlsHelp.innerHTML = `
    <strong>Camera Controls:</strong><br>
    Mouse: Orbit camera<br>
    W/S: Move forward/back<br>
    A/D: Move left/right<br>
    Q/E: Move down/up<br>
    Shift: Move faster<br>
    Scroll: Zoom in/out
`;
document.body.appendChild(controlsHelp);

// Add Object Information Display
const objectInfo = document.createElement('div');
objectInfo.style.position = 'absolute';
objectInfo.style.bottom = '10px';
objectInfo.style.left = '10px';
objectInfo.style.color = 'white';
objectInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
objectInfo.style.padding = '10px';
if (!document.body.contains(objectInfo)) {
    console.warn('objectInfo element is not correctly appended to the DOM. Appending now.');
    document.body.appendChild(objectInfo);
}

let selectedObject;

// Add Object List Display
const objectList = document.createElement('div');
objectList.style.position = 'absolute';
objectList.style.top = '50px';
objectList.style.left = '10px';
objectList.style.color = 'white';
objectList.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
objectList.style.padding = '10px';
document.body.appendChild(objectList);

// Add Position Controls for X, Y, Z
const positionControls = document.createElement('div');
positionControls.style.position = 'absolute';
positionControls.style.bottom = '50px';
positionControls.style.right = '10px';
positionControls.style.color = 'white';
positionControls.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
positionControls.style.padding = '10px';
positionControls.style.display = 'none';
document.body.appendChild(positionControls);

const createPositionInput = (axis) => {
    const container = document.createElement('div');
    const label = document.createElement('span');
    label.textContent = `${axis.toUpperCase()}: `;
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.1';
    input.style.width = '60px';

    container.appendChild(label);
    container.appendChild(input);
    positionControls.appendChild(container);
    return input;
};

const xInput = createPositionInput('x');
const yInput = createPositionInput('y');
const zInput = createPositionInput('z');

// Add Update Position Button
const updateButton = document.createElement('button');
updateButton.textContent = 'Update Position';
updateButton.style.marginTop = '10px';
positionControls.appendChild(updateButton);

updateButton.addEventListener('click', () => {
    if (selectedObject) {
        console.log('Updating position for:', selectedObject.name); // Debugging log
        selectedObject.position.x = parseFloat(xInput.value);
        selectedObject.position.y = parseFloat(yInput.value);
        selectedObject.position.z = parseFloat(zInput.value);
        updateObjectInfo(selectedObject);
    } else {
        console.warn('No object selected to update position.'); // Debugging log
    }
});

// Update Position Inputs Dynamically
function updatePositionInputs(object) {
    if (object) {
        console.log('updatePositionInputs called for object:', object.name); // Debugging log
        xInput.value = object.position.x.toFixed(2);
        yInput.value = object.position.y.toFixed(2);
        zInput.value = object.position.z.toFixed(2);
        if (positionControls.style.display !== 'block') {
            console.log('Setting positionControls display to block.');
        }
        positionControls.style.display = 'block';
    } else {
        if (positionControls.style.display !== 'none') {
            console.log('Hiding positionControls.');
        }
        positionControls.style.display = 'none';
    }
}

// Update Object Information Display
function updateObjectInfo(object) {
    if (!object) {
        console.error('updateObjectInfo called with null or undefined object.');
        return;
    }
    const position = object.position;
    const scale = object.scale;

    objectInfo.innerHTML = `
        <strong>Selected Object:</strong><br>
        Position: X: ${position.x.toFixed(2)}, Y: ${position.y.toFixed(2)}, Z: ${position.z.toFixed(2)}<br>
        Scale: X: ${scale.x.toFixed(2)}, Y: ${scale.y.toFixed(2)}, Z: ${scale.z.toFixed(2)}
    `;

    console.log('Updated objectInfo with object:', object.name); // Debugging log
    updatePositionInputs(object);
}

// Combine Select and Move Functionality
function selectObject(object) {
    if (object) {
        console.log('Object selected:', object.name); // Debugging log
        selectedObject = object;
        updateObjectInfo(selectedObject);
        positionControls.style.display = 'block';
    } else {
        console.warn('Attempted to select an undefined object.'); // Debugging log
    }
}

// Object management
const objectsMovableState = new Map(); // Track whether objects are movable

// Function to set names based on variable names
function setObjectName(variableName, object) {
    object.name = variableName;
}

// Example usage for naming objects
setObjectName('Stair Step 1', step1);
setObjectName('Stair Step 2', step2);
setObjectName('Stair Step 3', step3);
setObjectName('Table Top', tableTop);
setObjectName('Table Leg Front Right', tableLeg1);
setObjectName('Table Leg Front Left', tableLeg2);
setObjectName('Table Leg Back Right', tableLeg3);
setObjectName('Table Leg Back Left', tableLeg4);
setObjectName('Triangular Prism', prism);
setObjectName('Floor', floor);

// Assign names to imported 3D objects
if (typeof importedObjects !== 'undefined') {
    importedObjects.forEach((object, index) => {
        setObjectName(`Imported Object ${index + 1}`, object);
    });
}

// Populate Object List UI
function populateObjectList() {
    objectList.innerHTML = '<strong>Scene Objects:</strong><br>';

    scene.children.forEach((child) => {
        if (child.isMesh || child.name === 'Counter Pusher') { // Include Counter Pusher by name
            const objectEntry = document.createElement('div');
            objectEntry.style.marginBottom = '5px';

            const objectName = document.createElement('span');
            objectName.textContent = `Object: ${child.name || 'Mesh'} `;

            // Add "Select Object" button
            const selectButton = document.createElement('button');
            selectButton.textContent = 'Select';
            selectButton.style.marginLeft = '5px';

            selectButton.addEventListener('click', () => {
                console.log('Select button clicked for:', child.name); // Debugging log
                selectObject(child);
                console.log('UI should update for selected object:', child.name); // Debugging log
            });

            objectEntry.appendChild(objectName);
            objectEntry.appendChild(selectButton);
            objectList.appendChild(objectEntry);
        }
    });
}


populateObjectList();



// Animate Function
function animate() {
    requestAnimationFrame(animate);

    try {
        // Update keyboard camera movement
        updateCameraMovement();
        
        // Update camera controls
        if (controls) {
            controls.update();
        }

        // Update cube camera for dynamic reflections
        if (cubeCamera && cubeRenderTarget) {
            floor.visible = false; // Hide floor during cube camera rendering
            cubeCamera.update(renderer, scene);
            floor.visible = true; // Show floor after rendering
        }

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

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
