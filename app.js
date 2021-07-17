// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.130.1-bsY6rEPcA1ZYyZeKdbHd/mode=imports/optimized/three.js';

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

function main() {
    const canvas = document.querySelector('#render');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, });

    // var container = document.getElementById('container');
    // renderer.setSize($(container).width(), $(container).height());
    // container.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;


    renderer.setPixelRatio(window.devicePixelRatio * 3);
    const fov = 75;
    // const aspect = 2;
    const aspect = window.innerWidth / window.innerHeight;
    // const aspect = 750 / 245;
    // the canvas default 
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 1.5;
    camera.position.y = 1.5;

    const scene = new THREE.Scene();

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        light.castShadow = true;

        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        const d = 150;

        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;

        light.shadow.camera.far = 3500;
        light.shadow.bias = -0.0001;
    }

    // Plane
    const gridLength = 0.5;
    const gridSquares = 8;
    const height = 0.5;

    // const gridHelper = new THREE.GridHelper(gridLength * gridSquares, gridSquares);
    // scene.add(gridHelper);

    {
        // Add 1 to the dimensions to stop models from clipping / bugging when they are slightly bigger than the grid square
        const geometry = new THREE.BoxGeometry(gridLength * gridSquares, height, gridLength * gridSquares);
        const material = new THREE.MeshPhongMaterial({ color: 0x545454, side: THREE.DoubleSide });
        // const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow = true;
        plane.castShadow = true;
        plane.position.set(0, -height / 2, 0);
        // plane.rotateX(-Math.PI / 2);
        scene.add(plane);
    }

    var loader = new GLTFLoader();

    var computer_model = "retro_computer_with_mouse_and_keyboard/scene.gltf";
    var computer;

    var computer = loader.load(
        computer_model,
        function(gltf) {
            computer = gltf.scene;

            gltf.scene.scale.set(0.0075, 0.0075, 0.0075);
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            computer.traverse(function(node) {
                node.castShadow = true;
                node.receiveShadow = true;
            });

            computer.castShadow = true;
            computer.receiveShadow = true;

        },
        // called while loading is progressing
        function(xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function(error) {

            console.log('An error happened');

        }
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    // Stop user from moving camera around.
    // controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;

    controls.update();

    var printed = false;


    function render(time) {
        time *= 0.001; // convert time to seconds

        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        if (computer) {
            // computer.rotation.y = time;
            camera.lookAt(computer.position);
            if (!printed) {
                console.log(computer);
                printed = true;
            }

        }

        controls.update();

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();