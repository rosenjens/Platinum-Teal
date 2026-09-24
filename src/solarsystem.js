import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Distances and sizes are scaled for viewing, not to real proportions.
// period is the orbit time in seconds at the default speed.
const PLANETS = [
    { name: 'Mercury', color: 0x9e9e9e, radius: 0.25, distance: 4, period: 4 },
    { name: 'Venus', color: 0xe3bb76, radius: 0.45, distance: 6, period: 10 },
    { name: 'Earth', color: 0x2f6fdb, radius: 0.5, distance: 8.5, period: 16 },
    { name: 'Mars', color: 0xc1440e, radius: 0.35, distance: 11, period: 30 },
    { name: 'Jupiter', color: 0xd8a47f, radius: 1.3, distance: 16, period: 90 },
    { name: 'Saturn', color: 0xe4d191, radius: 1.1, distance: 21, period: 150, ring: true },
    { name: 'Uranus', color: 0x9fe3e8, radius: 0.8, distance: 26, period: 260 },
    { name: 'Neptune', color: 0x4166f5, radius: 0.78, distance: 30, period: 400 },
];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 22, 42);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 200;

scene.add(new THREE.AmbientLight(0xffffff, 0.15));
// decay 0 so the outer planets are lit as well as the inner ones.
scene.add(new THREE.PointLight(0xffffff, 3, 0, 0));

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xfdb813 })
);
scene.add(sun);

scene.add(createStars(2000));

const planets = PLANETS.map((planet) => {
    // The pivot sits at the sun; rotating it carries the planet around its orbit.
    const pivot = new THREE.Object3D();
    pivot.rotation.y = Math.random() * Math.PI * 2;
    scene.add(pivot);

    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius, 32, 32),
        new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.9 })
    );
    mesh.position.x = planet.distance;
    pivot.add(mesh);

    if (planet.ring) {
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(planet.radius * 1.4, planet.radius * 2.2, 64),
            new THREE.MeshStandardMaterial({ color: 0xcdb98a, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
        );
        ring.rotation.x = Math.PI / 2.4;
        mesh.add(ring);
    }

    scene.add(createOrbitLine(planet.distance));
    return { ...planet, pivot, mesh };
});

function createOrbitLine(distance) {
    const points = new THREE.EllipseCurve(0, 0, distance, distance).getPoints(128);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color: 0x334455 }));
    line.rotation.x = Math.PI / 2;
    return line;
}

function createStars(count) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const direction = new THREE.Vector3().randomDirection().multiplyScalar(300 + Math.random() * 300);
        direction.toArray(positions, i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: false }));
}

const timer = new THREE.Timer();
let speed = 1;

window.addEventListener('keydown', (event) => {
    if (event.key === '+' || event.key === '=') speed *= 2;
    if (event.key === '-') speed /= 2;
    if (event.key === ' ') speed = speed === 0 ? 1 : 0;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop((time) => {
    timer.update(time);
    const delta = timer.getDelta() * speed;
    for (const planet of planets) {
        planet.pivot.rotation.y += (delta / planet.period) * Math.PI * 2;
        planet.mesh.rotation.y += delta;
    }
    sun.rotation.y += delta * 0.1;
    controls.update();
    renderer.render(scene, camera);
});
