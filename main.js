const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const material = new THREE.MeshBasicMaterial({ color: 0x8B4513 });

const step1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), material);
const step2 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), material);
const step3 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), material);

step1.position.set(0, 0.5, 0);
step2.position.set(0, 1.5, 1);
step3.position.set(0, 2.5, 2);

scene.add(step1);
scene.add(step2);
scene.add(step3);

camera.position.z = 5;
camera.position.y = 1.5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();