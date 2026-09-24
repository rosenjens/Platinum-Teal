import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(1, 128, 128);
const material = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
const sun = new THREE.Mesh(geometry, material);

scene.add(sun);

camera.position.z = 5;

renderer.setAnimationLoop(() => renderer.render(scene, camera));
