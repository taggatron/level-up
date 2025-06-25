// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('wood_texture.jpg');
const stoneTexture = textureLoader.load('stone_texture.jpg');
const boardTexture = textureLoader.load('board_texture.jpg');
const boardNormalMap = textureLoader.load('board_normal.png'); // Load the board normal map
const boardLightMap = textureLoader.load('board_ao.jpg');    // Load the board ambient occlusion map

// Create materials
const boardMaterial = new THREE.MeshStandardMaterial({
    map: boardTexture,
    normalMap: boardNormalMap,  // Apply normal map
    aoMap: boardLightMap,      // Apply light map/ambient occlusion
    aoMapIntensity: 1,          // Intensity of the AO effect
    normalScale: new THREE.Vector2(1, 1),    // Adjust normal map intensity
});

const woodMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
const stoneMaterial = new THREE.MeshStandardMaterial({ map: stoneTexture });

// Create the steps
const step1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), boardMaterial);
const step2 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), boardMaterial);
const step3 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), boardMaterial);

// Create extensions for step2 and step3
const step2Extension = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), boardMaterial);
const step3Extension = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), boardMaterial);


// Position the steps
step1.position.set(0, 0.5, 0);
step2.position.set(0, 1.5, 1);
step3.position.set(0, 2.5, 2);

//Position the extensions
step2Extension.position.set(0, 0.5, 1);
step3Extension.position.set(0, 0.5, 2);


// Add steps to the scene
scene.add(step1);
scene.add(step2);
scene.add(step3);
scene.add(step2Extension);
scene.add(step3Extension);

// Create the table
const tableTop = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 5), woodMaterial);
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
scene.add(tableTop);
scene.add(tableLeg1);
scene.add(tableLeg2);
scene.add(tableLeg3);
scene.add(tableLeg4);


// Create the floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), stoneMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0,-2.5, 0)
scene.add(floor);



// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Position the camera
camera.position.z = 5;
camera.position.y = 1.5;

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the entire scene
  scene.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();