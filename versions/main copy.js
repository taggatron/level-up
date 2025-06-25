// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create materials
const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Use MeshStandardMaterial for better lighting effects

// Create the steps
const step1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), material);
const step2 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), material);
const step3 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), material);

// Position the steps
step1.position.set(0, 0.5, 0); // First step at the bottom
step2.position.set(0, 1.5, 1); // Second step above and behind the first
step3.position.set(0, 2.5, 2); // Third step above and behind the second

// Add steps to the scene
scene.add(step1);
scene.add(step2);
scene.add(step3);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5); // Position the light
scene.add(directionalLight);

// Position the camera
camera.position.z = 5;
camera.position.y = 1.5; // Adjust the camera height to better view the stairs

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the entire scene
  scene.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();