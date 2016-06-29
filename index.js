"use strict";

var scene, 
	aspect, 
	camera, 
	renderer, 
	controls;

var audio, analyser, frequencydata;

//init Three.JS
function init(){
	scene = new THREE.Scene();
	aspect = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(30, aspect, .5, 1000);
	renderer = new THREE.WebGLRenderer({ alpha : true });

	//attach document - append child and set size of renderer
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	renderer.setClearColor(0xFFFFF, 0);

	camera.position.z = 30;

	//OrbitControls setup 
	controls = new THREE.OrbitControls( camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;

	//Ground helper
	var ground = new THREE.GridHelper(10, 0.5, 0xd3d3d3, 0xd3d3d3);
	ground.position.y = - 2;
	scene.add(ground);
}

//Create audio and create array of cubes
function AnimateCubes(){
	var ctx = new AudioContext();
	audio = document.getElementById("mySong");
	var audioSrc = ctx.createMediaElementSource(audio);
	analyser = ctx.createAnalyser();

	audioSrc.connect(analyser);
	audioSrc.connect(ctx.destination);
	frequencydata = new Uint8Array(analyser.frequencyBinCount);
	var material = new THREE.MeshBasicMaterial({ color : 0xfffff });

	//Create the sound sphere
	var sphereGeo = new THREE.SphereGeometry(.5, 20, 20);
	var sphere = new THREE.Mesh(sphereGeo, material);
	sphere.position.x = -2;
	scene.add(sphere);

	//create array of cubes
	for(var i = 0; i < frequencydata.length; i++){
		var cubeGeo = new THREE.BoxGeometry(1, 1, 1);
		var cube = new THREE.Mesh(cubeGeo, material);
		cube.name = frequencydata.length;
		cube.position.x = i;
		scene.add(cube);
	}
}

function RadialCubes(count, space, location){
    var cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    var mat = new THREE.MeshBasicMaterial({color:0xd3d3d3});
    var loc = new THREE.Vector3(location);
    
    for(var i = 0; i < count; i++){
        var cube = new THREE.Mesh(cubeGeo, mat);
        var angle = (Math.PI/2) + (i / count) * 2 * Math.PI;
        
        var x = space * Math.cos(angle);
        var y = space * Math.sin(angle);
        //var location = new THREE.Vector3(x, y, 0);
        scene.add(cube);
        
        cube.position.setY(x);
        cube.position.setX(y);
        cube.rotation.z = x;
        
    }
	
}

function FillScene(){
    AnimateCubes();
    var location = new THREE.Vector3(0, 0, 0);
	RadialCubes(12, 5, location);
}


//render scene with animation
function render(){
	requestAnimationFrame(render);
	analyser.getByteFrequencyData(frequencydata);

	//loop through all instances of THREE.Mesh  
    /*
	scene.traverse(function (e) {
		if(e instanceof THREE.Mesh){
			e.scale.y = frequencydata[e.id] / 10 + 1;
		}
	});
    */
	controls.update();

	renderer.render( scene, camera );
}

init();
FillScene();
render();
//audio.play();

