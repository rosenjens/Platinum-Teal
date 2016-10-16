var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.SphereGeometry(1,128, 128);
var material = new THREE.MeshBasicMaterial( { color: 0xFDB813} );
var sun = new THREE.Mesh(geometry, material);

scene.add(sun);

//var clock = THREE.Clock();

camera.position.z = 5;

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}

render();