//Creating a Custom Object
function CustomSphere(){   
    this.type = "CustomSphere";
    
    this.geo = new THREE.SphereGeometry(5, 20, 20);
    this.mat = new THREE.MeshBasicMaterial({color : 0xFFFF00});
    
    THREE.Mesh.call(this, this.geo, this.mat);
}

CustomSphere.prototype = Object.create(THREE.Mesh.prototype);
CustomSphere.prototype.constructor = CustomSphere;

CustomSphere.prototype.getMesh = function() {
    return this.mesh;
}
var customSphere = new CustomSphere();


//SoundBlock -->  Radially duplicated cubes that move to the music
function SoundBlock(){
    this.type = "SoundBlock";
    
    this.geo = new THREE.BoxGeometry(.03, .03, 1);
    this.mat = new THREE.MeshBasicMaterial({color : 0xFFFF00});
    
    THREE.Mesh.call(this, this.geo, this.mat);
}

SoundBlock.prototype = Object.create(THREE.Mesh.prototype);
SoundBlock.prototype.constructor = SoundBlock;

SoundBlock.prototype.getMesh = function(){
    return this.mesh;   
}
