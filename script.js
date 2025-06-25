// Remove all import statements and use global THREE, GLTFLoader, FBXLoader, EXRLoader, OrbitControls
// (CDN scripts will be loaded in index.html)

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
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional for smoother controls
controls.dampingFactor = 0.05; // Optional

// Add HDR environment map
const exrLoader = new THREE.EXRLoader();
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

// ...existing code continues (all scene setup, UI, animation, etc.)...
