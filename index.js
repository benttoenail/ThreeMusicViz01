"use strict";

var aspect, 
	camera, 
	renderer, 
	controls;

var audio, analyser, frequencydata;

var scene = new THREE.Scene();
var clock = new THREE.Clock();

//init Three.JS
function init(){
	//scene = new THREE.Scene();
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


//Creating radial SoundBlock instances
function RadialCubes(count, space, location){
    
    for(var i = 0; i < count; i++){
        var cube = new SoundBlock();
        var angle = (Math.PI/2) + (i / count) * 2 * Math.PI;
        
        var x = space * Math.cos(angle);
        var y = space * Math.sin(angle);
        scene.add(cube);
        
        //cube.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 1));
        cube.geometry.translate(0, 0, 0.5);
        cube.name = count.length;
        cube.position.setY(x);
        cube.position.setX(y);
        cube.lookAt(location);
    }
}


//Create audio and create array of cubes
function AnimatedCubes(scale){
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
    
    var count = frequencydata.length;
    var location = new THREE.Vector3(0, 0, 0);
    RadialCubes(20, 5, location);
}

function FillScene(){
    AnimatedCubes();
}

function AnimateScene(){
    var time = clock.getElapsedTime();
    document.getElementById("clock").innerHTML = "Elasped Time: " + time;
    
    /*
    TIMING
    */
    //INTRO 0 - 15.5 sec
    if(time < 15.5){ //Slow build 
        document.getElementById("songSection").innerHTML = "Intro";   
    }
    if(time > 15.5){
        document.getElementById("songSection").innerHTML = "1st Verse";
    }
    if(time > 46.0){
        document.getElementById("songSection").innerHTML = "1st Chorus";
    }
    if(time > 76.5){
        document.getElementById("songSection").innerHTML = "2nd Verse";
    }
    if(time > 106.8){
        document.getElementById("songSection").innerHTML = "2nd Chorus";
    }
    if(time > 137.0){
        document.getElementById("songSection").innerHTML = "BreakDownIntro";
    }
    if(time > 141.6){
        document.getElementById("songSection").innerHTML = "snap";
    }
    if(time > 142.0){
        document.getElementById("songSection").innerHTML = "final Verse A";
    }
    if(time > 166.5){
        document.getElementById("songSection").innerHTML = "final Verse B";
    }
    if(time > 197.5){ //Ending lasts for 7 seconds 
        document.getElementById("songSection").innerHTML = "ending";
    }
    
    //loop through SoundBlockInstances
    
    var smoothValue = 0; 
    smoothValue += (frequencydata[0] - smoothValue) * 0.1;
    
    scene.traverse(function(e){
       if(e instanceof SoundBlock){
            var i = Math.floor((Math.random() * frequencydata.length) + 1);
            
            e.scale.z =  smoothValue;
            e.scale.x =  smoothValue / 2;    
            e.rotation.x += .01;
            e.rotation.y += .01;
           //console.log(e.id);
       }
    });
}


//render scene with animation
function render(){
	requestAnimationFrame(render);
    analyser.getByteFrequencyData(frequencydata);
    AnimateScene();
    
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
audio.play();

