//color palette
var darkBlue = 0x1c242e;
var blue = 0x046487;
var lightBlue = 0xc3eeee;
var white = 0xd0fdfd;

var camera, controls, scene, renderer, animation;
var clock = new THREE.Clock();
var delta, mixer;

init();
animate();

function init(){
  
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(blue, 0.0030);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    
    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.z = 200;
    camera.position.y = 0;
    
    controls = new THREE.FirstPersonControls( camera );
    controls.lookSpeed = 0.0070;
    controls.movementSpeed = 80;
    controls.noFly = true;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.5;
    controls.verticalMax = 2.0;
    controls.lon = 250;
    controls.lat = 10;
    
    light = new THREE.DirectionalLight( darkBlue );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    
    light = new THREE.PointLight( white, 20, 300);
    light.position.set( 0, 300, 0 );
    scene.add( light );

    light = new THREE.AmbientLight( darkBlue );
    scene.add( light );
    
    window.addEventListener('resize', onWindowResize, false);
    
    objects = [];

    var loader = new THREE.JSONLoader();
    loader.load( 'models/sharky.json', function ( model ) {
        var material = new THREE.MeshPhongMaterial({color:darkBlue, shading: THREE.FlatShading});
            
        for(var i = 0; i < 300; i ++){
        
           var mesh = new THREE.SkinnedMesh(model, material);
            
            mesh.position.x = (Math.random() - 0.5) * 1000;
            mesh.position.y = (Math.random() - 0.5) * 1000;
            mesh.position.z = (Math.random() - 0.5) * 1000;
            mesh.scale.set(1.4,1.4,1.4);
            mesh.rotateY(90);
            mesh.rotateX(25 + Math.random() - 0.4);
            mesh.updateMatrix();
            
            objects.push(mesh);
            scene.add(mesh);
            
            // Get object animation, not working currently?
            mixer = new THREE.AnimationMixer(mesh);
            var swim = mixer.clipAction(model.animations[0]);
            
            if(model.animations[0] == null){
                console.log("no animation");
            }
            
            if(model.animations[0]){
                console.log(model.animations[0].name);
            }
            swim.play();            
            console.log(mesh);  
        }
    });
    console.log(objects);
}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
    requestAnimationFrame(animate);
    render();
}

function render() {
    // Update animation, also not working?
    var delta = clock.getDelta();
    if( mixer ) {
        mixer.update( delta );
    }
    controls.update( delta );
    
    
    //randomize the movement for the sharks y position
    for ( var i = 0, il = objects.length; i < il; i +=4 ) {
        
        objects[ i ].position.x += 0.1;
        var time = performance.now() * 0.001;
        objects[i].position.y += Math.sin( time / 2 ) * 0.05;
        objects[i].scale.set(2,2,2);
        
        object = objects [i];
        
        if(object.position.x > 600){
            object.position.x = -600;
        }
    }
    //randomize the movement for the sharks y position
    for ( var i = 0, il = objects.length; i < il; i +=3 ) {
        
        objects[ i ].position.x += 0.1;
        var time = performance.now() * 0.001;
        objects[i].position.y += Math.sin( time / 3 ) * 0.05;
        
        object = objects [i];
        
        if(object.position.x > 600){
            object.position.x = -600;
        }
    }
    //generic x position movement
     for ( var i = 0, il = objects.length; i < il; i ++ ) {
        
        objects[ i ].position.x += 0.3;
        
        object = objects [i];
        
        if(object.position.x > 600){
            object.position.x = -600;
        }
    }
    renderer.clear();
    renderer.render(scene, camera);
}
