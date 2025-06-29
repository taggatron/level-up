// Babylon.js version of the original Three.js scene
// Babylon.js and loaders are loaded via CDN in index.html, so no imports are needed here.

// Create canvas and engine
const canvas = document.createElement('canvas');
canvas.id = 'renderCanvas';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
document.body.appendChild(canvas);
const engine = new BABYLON.Engine(canvas, true);

// Create scene
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

// Camera (ArcRotate for orbit, Universal for WASD)
const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(-5.67, 7.36, -14.27), scene);
camera.setTarget(new BABYLON.Vector3(0, 1, 0.2));
camera.attachControl(canvas, true);
camera.speed = 0.3;

// Camera controls (WASDQE + Shift for speed)
const keys = { w: false, s: false, a: false, d: false, q: false, e: false, shift: false };
const cameraSpeed = 0.1;
const fastSpeed = 0.3;
window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
    if (event.key === 'Shift') keys.shift = true;
});
window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
    if (event.key === 'Shift') keys.shift = false;
});

scene.onBeforeRenderObservable.add(() => {
    const speed = keys.shift ? fastSpeed : cameraSpeed;
    const forward = camera.getDirection(BABYLON.Axis.Z);
    const right = camera.getDirection(BABYLON.Axis.X);
    if (keys.w) camera.position.addInPlace(forward.scale(speed));
    if (keys.s) camera.position.addInPlace(forward.scale(-speed));
    if (keys.a) camera.position.addInPlace(right.scale(-speed));
    if (keys.d) camera.position.addInPlace(right.scale(speed));
    if (keys.q && camera.position.y > 0.5) camera.position.y -= speed;
    if (keys.e) camera.position.y += speed;
});

// Prevent context menu and scrolling
window.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('wheel', e => e.preventDefault(), { passive: false });

// Environment map (.env)
const envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData('/assets/pine_picnic_4k.env', scene);
scene.environmentTexture = envTexture;
scene.createDefaultSkybox(envTexture, true, 1000);

// Texture loader helper
function loadTexture(path) {
    return new BABYLON.Texture(path, scene);
}

// Materials
const boardMaterial = new BABYLON.StandardMaterial('boardMat', scene);
boardMaterial.diffuseTexture = loadTexture('/board_texture.jpg');
boardMaterial.bumpTexture = loadTexture('/board_normal.png');
boardMaterial.ambientTexture = loadTexture('/board_ao.jpg');
boardMaterial.metallicTexture = loadTexture('/board_metallic.jpg');
boardMaterial.displacementTexture = loadTexture('/board_displacement.tiff');

const woodMaterial = new BABYLON.StandardMaterial('woodMat', scene);
woodMaterial.diffuseTexture = loadTexture('/wood_texture.jpg');
woodMaterial.bumpTexture = loadTexture('/wood_normal.png');
woodMaterial.ambientTexture = loadTexture('/wood_ao.jpg');

const stoneMaterial = new BABYLON.StandardMaterial('stoneMat', scene);
stoneMaterial.diffuseTexture = loadTexture('/stone_texture.jpg');
stoneMaterial.bumpTexture = loadTexture('/stone_normal.png');
stoneMaterial.ambientTexture = loadTexture('/stone_ao.jpg');
stoneMaterial.metallicTexture = loadTexture('/stone_metallic.jpg');
stoneMaterial.displacementTexture = loadTexture('/stone_displacement.tiff');

const levelUpTitleMaterial = new BABYLON.StandardMaterial('levelUpTitleMat', scene);
levelUpTitleMaterial.diffuseTexture = loadTexture('/levelup_title.jpg');
levelUpTitleMaterial.bumpTexture = loadTexture('/board_normal.png');
levelUpTitleMaterial.ambientTexture = loadTexture('/board_ao.jpg');

const wallMaterial = new BABYLON.StandardMaterial('wallMat', scene);
wallMaterial.diffuseTexture = loadTexture('/wall_texture.jpg');
wallMaterial.bumpTexture = loadTexture('/wall_normal.png');
wallMaterial.ambientTexture = loadTexture('/wall_ao.jpg');
wallMaterial.metallicTexture = loadTexture('/wall_metallic.jpg');
wallMaterial.displacementTexture = loadTexture('/wall_displacement.tiff');

// Lighting
const ambientLight = new BABYLON.HemisphericLight('ambient', new BABYLON.Vector3(0, 1, 0), scene);
ambientLight.intensity = 1.5;
const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(5, 10, 7.5), scene);
dirLight.intensity = 1;
dirLight.position = new BABYLON.Vector3(5, 10, 7.5);
const shadowGenerator = new BABYLON.ShadowGenerator(2048, dirLight);
shadowGenerator.useBlurExponentialShadowMap = true;
shadowGenerator.blurKernel = 32;
const addLight1 = new BABYLON.DirectionalLight('addLight1', new BABYLON.Vector3(-5, 8, -5), scene);
addLight1.intensity = 0.8;
addLight1.position = new BABYLON.Vector3(-5, 8, -5);
const addLight2 = new BABYLON.DirectionalLight('addLight2', new BABYLON.Vector3(0, 10, 0), scene);
addLight2.intensity = 0.6;
addLight2.position = new BABYLON.Vector3(0, 10, 0);

// Steps (moved after shadowGenerator is defined)
let step1, step2, step3;
step1 = BABYLON.MeshBuilder.CreateBox('Stair Step 1', {width:4, height:1, depth:1}, scene);
step1.position.set(0, 0.5, -0.8);
step1.material = boardMaterial;
step1.receiveShadows = true;
shadowGenerator.addShadowCaster(step1, true);
step2 = BABYLON.MeshBuilder.CreateBox('Stair Step 2', {width:4, height:2, depth:1}, scene);
step2.position.set(0, 1, 0.2);
step2.material = boardMaterial;
step2.receiveShadows = true;
shadowGenerator.addShadowCaster(step2, true);
step3 = BABYLON.MeshBuilder.CreateBox('Stair Step 3', {width:4, height:3, depth:1}, scene);
step3.position.set(0, 1.5, 1.2);
step3.material = boardMaterial;
step3.receiveShadows = true;
shadowGenerator.addShadowCaster(step3, true);

// Table
BABYLON.SceneLoader.ImportMesh('', '/assets/', 'Table.glb', scene, (meshes) => {
    const table = meshes[0].parent || meshes[0];
    table.position.set(0, -2.6, -0.5); // Updated position from image
    table.scaling.set(6, 3, 8); // Updated scale from image
    table.rotation.set(0, 0, 0);
    table.name = 'Table';
    table.receiveShadows = false;
    shadowGenerator.addShadowCaster(table, true);
    populateObjectList();
});

// Floor (reflective stone)
const floor = BABYLON.MeshBuilder.CreateGround('Floor', {width:20, height:20}, scene);
floor.position.set(0, -2.5, 0);
floor.receiveShadows = true;
const reflectiveStoneMaterial = new BABYLON.PBRMaterial('reflectiveStone', scene);
reflectiveStoneMaterial.albedoTexture = loadTexture('/stone_texture.jpg');
reflectiveStoneMaterial.bumpTexture = loadTexture('/stone_normal.png');
reflectiveStoneMaterial.ambientTexture = loadTexture('/stone_ao.jpg');
reflectiveStoneMaterial.metallicTexture = loadTexture('/stone_metallic.jpg');
reflectiveStoneMaterial.microSurfaceTexture = loadTexture('/stone_displacement.tiff');
reflectiveStoneMaterial.environmentTexture = envTexture;
reflectiveStoneMaterial.reflectivityColor = new BABYLON.Color3(1, 1, 1);
reflectiveStoneMaterial.metallic = 1.0;
reflectiveStoneMaterial.roughness = 0.1;
floor.material = reflectiveStoneMaterial;

// Walls with window cutouts and window models
const wallHeight = 15; // Tripled from 5 to 15
const wallWidth = 20;
const wallDepth = 0.2;
const windowWidth = 9; // Larger width
const windowHeight = 4; // Larger height
const windowY = 2; // Closer to the floor
const windowZOffset = 0.01; // To avoid z-fighting

// Helper to create wall with window cutout using CSG
function createWallWithWindow(name, width, height, depth, windowCenter, windowSize, position, rotation) {
    // Main wall
    const wall = BABYLON.MeshBuilder.CreateBox(name + '_base', {width, height, depth}, scene);
    // Window cutout
    const windowBox = BABYLON.MeshBuilder.CreateBox(name + '_window', {width: windowSize[0], height: windowSize[1], depth: depth + 0.05}, scene);
    windowBox.position = windowCenter.clone();
    // CSG subtraction
    const wallCSG = BABYLON.CSG.FromMesh(wall);
    const windowCSG = BABYLON.CSG.FromMesh(windowBox);
    const wallWithCutout = wallCSG.subtract(windowCSG).toMesh(name, wall.material, scene);
    wallWithCutout.position = position.clone();
    if (rotation) wallWithCutout.rotation = rotation.clone();
    wallWithCutout.material = wallMaterial;
    wall.dispose();
    windowBox.dispose();
    return wallWithCutout;
}

// Wall 1 (back) - NO WINDOW CUTOUT
const wall1 = BABYLON.MeshBuilder.CreateBox('Wall 1', {width: wallWidth, height: wallHeight, depth: wallDepth}, scene);
wall1.position = new BABYLON.Vector3(0, wallHeight/2 - 2.5, 10);
wall1.rotation = new BABYLON.Vector3(0, 0, 0);
wall1.material = wallMaterial;
// Wall 2 (left)
const wall2WindowCenter = new BABYLON.Vector3(0, windowY, 0);
const wall2 = createWallWithWindow('Wall 2', wallWidth, wallHeight, wallDepth, wall2WindowCenter, [windowWidth, windowHeight], new BABYLON.Vector3(-10, wallHeight/2 - 2.5, 0), new BABYLON.Vector3(0, Math.PI/2, 0));
// Wall 3 (right)
const wall3WindowCenter = new BABYLON.Vector3(0, windowY, 0);
const wall3 = createWallWithWindow('Wall 3', wallWidth, wallHeight, wallDepth, wall3WindowCenter, [windowWidth, windowHeight], new BABYLON.Vector3(10, wallHeight/2 - 2.5, 0), new BABYLON.Vector3(0, -Math.PI/2, 0));

// Import and place window models in each cutout
typeof BABYLON.SceneLoader !== 'undefined' && BABYLON.SceneLoader.ImportMesh('', '/assets/', 'windows.glb', scene, (meshes) => {
    // Place for wall2 (left)
    const win2 = meshes[0].clone('Window2');
    win2.position = new BABYLON.Vector3(-10 - wallDepth/2 - windowZOffset, windowY, 0);
    win2.scaling = new BABYLON.Vector3(2.5, 1.3, 1.2);
    win2.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
    // Place for wall3 (right)
    const win3 = meshes[0].clone('Window3');
    win3.position = new BABYLON.Vector3(10 + wallDepth/2 + windowZOffset, windowY, 0);
    win3.scaling = new BABYLON.Vector3(2.5, 1.3, 1.2);
    win3.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
    populateObjectList();
});

// GLB Model: Level Up Title
BABYLON.SceneLoader.ImportMesh('', '/assets/', 'leveluptitle3dwords.glb', scene, (meshes) => {
    const model = meshes[0].parent || meshes[0];
    model.position.set(2.06, 0.80, 1.60);
    model.scaling.set(0.01, 0.01, 0.01);
    model.rotation.set(0, 0, 0);
    model.getChildMeshes().forEach(mesh => mesh.material = levelUpTitleMaterial);
    model.name = 'Level Up Title';
});

// FBX Model: Plant
BABYLON.SceneLoader.ImportMesh('', '/assets/', 'plant.glb', scene, (meshes) => {
    const plant = meshes[0].parent || meshes[0];
    plant.scaling.set(4, 4, 4);
    plant.position.set(-7, -2.5, 7.9);
    plant.rotation.set(0, 0, 0);
    plant.name = 'Plant';
    populateObjectList(); // Ensure UI updates after plant is loaded
});

// GLB Model: Counterpusher
BABYLON.SceneLoader.ImportMesh('', '/assets/', 'counterpusher.glb', scene, (meshes) => {
    const model = meshes[0].parent || meshes[0];
    const customMaterial = new BABYLON.StandardMaterial('counterMat', scene);
    customMaterial.diffuseTexture = loadTexture('/lvltitleholder.jpg');
    customMaterial.bumpTexture = loadTexture('/board_normal.png');
    customMaterial.ambientTexture = loadTexture('/board_ao.jpg');
    customMaterial.metallicTexture = loadTexture('/board_metallic.jpg');
    model.getChildMeshes().forEach(mesh => mesh.material = customMaterial);
    model.scaling.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, 0);
    model.name = 'Counter Pusher';
    populateObjectList();
});

// GLB Model: Level Title Holder
BABYLON.SceneLoader.ImportMesh('', '/assets/', 'lvltitleholder.glb', scene, (meshes) => {
    const model = meshes[0].parent || meshes[0];
    model.position.set(0.10, 0.40, -1.47);
    model.scaling.set(0.0125, 0.011, 0.01);
    model.rotation.set(0, 0, 0);
    model.name = 'Level Title Holder';
    populateObjectList();
});

// GLB Model: Plus Counter Blue
BABYLON.SceneLoader.ImportMesh('', '/assets/', 'pluscounterblue.glb', scene, (meshes) => {
    const model = meshes[0].parent || meshes[0];
    model.position.set(-2, 0.5, 2);
    model.scaling.set(0.3, 0.3, 0.3);
    model.name = 'Plus Counter Blue';
    populateObjectList();
});

// GLB Model: Triangle Counter Yellow
BABYLON.SceneLoader.ImportMesh('', '/assets/', 'trianglecounteryellow.glb', scene, (meshes) => {
    const model = meshes[0].parent || meshes[0];
    model.position.set(2, 0.5, 2);
    model.scaling.set(0.3, 0.3, 0.3);
    model.name = 'Triangle Counter Yellow';
    populateObjectList();
});

// GLB Model: Pusher (and clones)
const pusherPositions = [-1.5, -0.5, 0.5, 1.5]; // Evenly spaced across step1 (width 4)
const pusherNames = ['Pusher 1.1', 'Pusher 1.2', 'Pusher 1.3', 'Pusher 1.4'];
pusherPositions.forEach((x, i) => {
    BABYLON.SceneLoader.ImportMesh('', '/assets/', 'pusher.glb', scene, (meshes) => {
        const model = meshes[0].parent || meshes[0];
        model.position.set(x, 0.2, -2.0); // Y: 0.2, Z: -2.0 as in image
        model.scaling.set(0.1, 0.1, 0.1); // As in image
        model.name = pusherNames[i];
        populateObjectList();
    });
});

// UI Overlays (Camera coords, controls help, object info, object list, position controls)
const cameraCoords = document.createElement('div');
cameraCoords.style.position = 'absolute';
cameraCoords.style.top = '10px';
cameraCoords.style.left = '10px';
cameraCoords.style.color = 'white';
document.body.appendChild(cameraCoords);

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

const objectInfo = document.createElement('div');
objectInfo.style.position = 'absolute';
objectInfo.style.bottom = '10px';
objectInfo.style.left = '10px';
objectInfo.style.color = 'white';
objectInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
objectInfo.style.padding = '10px';
document.body.appendChild(objectInfo);

let selectedObject;

const objectList = document.createElement('div');
objectList.style.position = 'absolute';
objectList.style.top = '50px';
objectList.style.left = '10px';
objectList.style.color = 'white';
objectList.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
objectList.style.padding = '10px';
objectList.style.maxHeight = '60vh'; // Use viewport height for better responsiveness
objectList.style.overflowY = 'scroll'; // Force scroll bar to always show
objectList.tabIndex = 0; // Make it focusable for keyboard scroll
objectList.style.overflowX = 'hidden';
objectList.style.width = '250px'; // Ensure a fixed width for scroll
document.body.appendChild(objectList);

const positionControls = document.createElement('div');
positionControls.style.position = 'absolute';
positionControls.style.bottom = '50px';
positionControls.style.right = '10px';
positionControls.style.color = 'white';
positionControls.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
positionControls.style.padding = '10px';
positionControls.style.display = 'none';
document.body.appendChild(positionControls);

const createPositionInput = (axis, labelName) => {
    const container = document.createElement('div');
    const label = document.createElement('span');
    label.textContent = `${labelName.toUpperCase()}: `;
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.1';
    input.style.width = '60px';
    container.appendChild(label);
    container.appendChild(input);
    positionControls.appendChild(container);
    return input;
};
const xInput = createPositionInput('x', 'Position X');
const yInput = createPositionInput('y', 'Position Y');
const zInput = createPositionInput('z', 'Position Z');
const rxInput = createPositionInput('rx', 'Rotation X');
const ryInput = createPositionInput('ry', 'Rotation Y');
const rzInput = createPositionInput('rz', 'Rotation Z');
const sxInput = createPositionInput('sx', 'Scale X');
const syInput = createPositionInput('sy', 'Scale Y');
const szInput = createPositionInput('sz', 'Scale Z');

const updateButton = document.createElement('button');
updateButton.textContent = 'Update Object';
updateButton.style.marginTop = '10px';
positionControls.appendChild(updateButton);

updateButton.addEventListener('click', () => {
    if (selectedObject) {
        selectedObject.position.x = parseFloat(xInput.value);
        selectedObject.position.y = parseFloat(yInput.value);
        selectedObject.position.z = parseFloat(zInput.value);
        selectedObject.rotation.x = BABYLON.Angle.FromDegrees(parseFloat(rxInput.value)).radians();
        selectedObject.rotation.y = BABYLON.Angle.FromDegrees(parseFloat(ryInput.value)).radians();
        selectedObject.rotation.z = BABYLON.Angle.FromDegrees(parseFloat(rzInput.value)).radians();
        selectedObject.scaling.x = parseFloat(sxInput.value);
        selectedObject.scaling.y = parseFloat(syInput.value);
        selectedObject.scaling.z = parseFloat(szInput.value);
        updateObjectInfo(selectedObject);
    }
});

function updatePositionInputs(object) {
    if (object) {
        xInput.value = object.position.x.toFixed(2);
        yInput.value = object.position.y.toFixed(2);
        zInput.value = object.position.z.toFixed(2);
        rxInput.value = BABYLON.Angle.FromRadians(object.rotation.x).degrees().toFixed(2);
        ryInput.value = BABYLON.Angle.FromRadians(object.rotation.y).degrees().toFixed(2);
        rzInput.value = BABYLON.Angle.FromRadians(object.rotation.z).degrees().toFixed(2);
        sxInput.value = object.scaling.x.toFixed(2);
        syInput.value = object.scaling.y.toFixed(2);
        szInput.value = object.scaling.z.toFixed(2);
        positionControls.style.display = 'block';
    } else {
        positionControls.style.display = 'none';
    }
}

function updateObjectInfo(object) {
    if (!object) return;
    const position = object.position;
    const scale = object.scaling;
    const rotation = object.rotation;
    objectInfo.innerHTML = `
        <strong>Selected Object:</strong><br>
        Position: X: ${position.x.toFixed(2)}, Y: ${position.y.toFixed(2)}, Z: ${position.z.toFixed(2)}<br>
        Rotation: X: ${BABYLON.Angle.FromRadians(rotation.x).degrees().toFixed(2)}, Y: ${BABYLON.Angle.FromRadians(rotation.y).degrees().toFixed(2)}, Z: ${BABYLON.Angle.FromRadians(rotation.z).degrees().toFixed(2)}<br>
        Scale: X: ${scale.x.toFixed(2)}, Y: ${scale.y.toFixed(2)}, Z: ${scale.z.toFixed(2)}
    `;
    updatePositionInputs(object);
}

function selectObject(object) {
    if (object) {
        selectedObject = object;
        updateObjectInfo(selectedObject);
        positionControls.style.display = 'block';
    }
}

function populateObjectList() {
    objectList.innerHTML = '<strong>Scene Objects:</strong><br>';
    scene.meshes.forEach((mesh) => {
        if (mesh.name) {
            const objectEntry = document.createElement('div');
            objectEntry.style.marginBottom = '5px';
            const objectName = document.createElement('span');
            objectName.textContent = `Object: ${mesh.name} `;
            const selectButton = document.createElement('button');
            selectButton.textContent = 'Select';
            selectButton.style.marginLeft = '5px';
            selectButton.addEventListener('click', () => {
                selectObject(mesh);
            });
            objectEntry.appendChild(objectName);
            objectEntry.appendChild(selectButton);
            objectList.appendChild(objectEntry);
        }
    });
}

populateObjectList();

// Animate Counter Pusher
let direction = 1;
const speed = 0.01;
scene.onBeforeRenderObservable.add(() => {
    const counterPusher = scene.getMeshByName('Counter Pusher');
    if (counterPusher) {
        counterPusher.position.z += direction * speed;
        if (counterPusher.position.z > -1 || counterPusher.position.z < -3) {
            direction *= -1;
        }
    }
    // Camera coordinates display
    const x = camera.position.x.toFixed(2);
    const y = camera.position.y.toFixed(2);
    const z = camera.position.z.toFixed(2);
    cameraCoords.textContent = `Camera Position: X: ${x}, Y: ${y}, Z: ${z}`;
});

// Render loop
engine.runRenderLoop(() => {
    scene.render();
});

// Resize
window.addEventListener('resize', () => {
    engine.resize();
});
