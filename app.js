// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.130.1-bsY6rEPcA1ZYyZeKdbHd/mode=imports/optimized/three.js';

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

function main() {
    const canvas = document.querySelector('#render');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, });
    renderer.setPixelRatio(window.devicePixelRatio * 3);
    const fov = 75;
    // const aspect = 2;
    const aspect = window.innerWidth / window.innerHeight;
    // the canvas default 
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 1.5;
    camera.position.y = 1.2;

    const scene = new THREE.Scene();

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshPhongMaterial({ color: 0x52307c });

    const cube = new THREE.Mesh(geometry, material);

    // scene.add(cube);

    var loader = new GLTFLoader();

    var computer_model = "retro_computer_with_mouse_and_keyboard/scene.gltf";
    var computer;

    var computer = loader.load(
        computer_model,
        function(gltf) {
            console.log("WHY THIS NOT WORKING???");
            computer = gltf.scene;

            gltf.scene.scale.set(0.0075, 0.0075, 0.0075);
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

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

    console.log(computer);


    function render(time) {
        time *= 0.001; // convert time to seconds

        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        cube.rotation.x = time;
        cube.rotation.y = time;

        if (computer) {
            // computer.rotation.y = time;
            camera.lookAt(computer.position);
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();