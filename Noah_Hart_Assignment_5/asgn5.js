import * as THREE from 'three';
import {OrbitControls} from '../lib/OrbitControls.js';
import {OBJLoader} from '../lib/OBJLoader.js';
import {MTLLoader} from '../lib/MTLLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;

// Camera
    const fov = 80;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 12, 30);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 12, 0);
    controls.update();

    const scene = new THREE.Scene();


// Ground Plane
    {
      const planeSize = 400;
  
      const loader = new THREE.TextureLoader();
      const texture = loader.load('textures/sand.jpg');
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);
  
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.receiveShadow = true;
      mesh.rotation.x = Math.PI * -.5;
      scene.add(mesh);
    }

// Lights  
    {
      const skyColor = 0xB1E1FF;  // light blue
      const groundColor = 0xB97A20;  // brownish orange
      const intensity = .1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }
    {
      const color = 0xFFFFFF;
      const intensity = .2;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(1, 2, -10);
      light.target.position.set(-1, 0, 0);
      light.castShadow = true;
      scene.add(light);
      scene.add(light.target);
    }

    {
    const color = 0xfc037b;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(1, 2, -10);
    light.castShadow = true;
    scene.add(light);
    }

// Fog
    {
      const color = 0xFFEAD0;
      const near = 0;
      const far = 80;
      scene.fog = new THREE.Fog(color, near, far);
    }

// 3D Models
    {
      const mtlLoader = new MTLLoader();
      mtlLoader.load('OBJ/spider.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('OBJ/spider.obj', (root) => {
          root.traverse(function (obj) {
            if (obj.isMesh) {
              obj.receiveShadow = true;
              obj.castShadow = true;
              //obj.material.color.set(0xffffff);
            }
          });
          root.rotation.x = .3;
          root.scale.set(.05, .05, .05);
          root.position.set(1, -.1, 16);
          scene.add(root);
        });
      });
    }

    {
      const mtlLoader = new MTLLoader();
      mtlLoader.load('OBJ/cat.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('OBJ/cat.obj', (root) => {
          root.traverse(function (obj) {
            if (obj.isMesh) {
              obj.receiveShadow = true;
              obj.castShadow = true;
              obj.material.color.set(0xffffff);
            }
          });
          root.rotation.x = 180;
          root.scale.set(.2, .2, .2);
          root.position.set(1, 2, -10);
          scene.add(root);
        });
      });
    }

    // Cubes
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    geometry.castShadow = true;
    geometry.receiveShadow = true;
  
    function makeInstance(geometry, color, x) {
        const loader = new THREE.TextureLoader();
        const materials = [
            new THREE.MeshBasicMaterial({map: loader.load('textures/lego.png')}),
            new THREE.MeshBasicMaterial({map: loader.load('textures/lego.png')}),
            new THREE.MeshBasicMaterial({map: loader.load('textures/lego.png')}),
            new THREE.MeshBasicMaterial({map: loader.load('textures/lego.png')}),
            new THREE.MeshBasicMaterial({map: loader.load('textures/lego.png')}),
            new THREE.MeshBasicMaterial({map: loader.load('textures/lego.png')}),
          ];
  
      const cube = new THREE.Mesh(geometry, materials);
      scene.add(cube);
  
      cube.position.x = x + 18;
      cube.position.y = 2;
      cube.position.z = 8;
  
      return cube;
    }
    
    const cubes = [
      makeInstance(geometry, 0x44aa88,  0),
    ];

// SkyBox
  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'textures/sky.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
  }
  
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width  = canvas.clientWidth  * pixelRatio | 0;
      const height = canvas.clientHeight * pixelRatio | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

// Shapes
{
  const sphereRadius = 2;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const loader = new THREE.TextureLoader();
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({map: loader.load('textures/volleyball.jpg')});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(-sphereRadius + 4, sphereRadius + 10, -7);
  cubes.push(mesh);
  scene.add(mesh);
}

{
  const geometry = new THREE.IcosahedronGeometry(2);
  const material = new THREE.MeshPhongMaterial({ color: 0x6E0E0A });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(-15, 9, 0);
  cube.rotation.y = 15;
  cubes.push(cube);
  scene.add(cube);
}

{
  const geometry = new THREE.CylinderGeometry(1, 1, 15, 20);
  const material = new THREE.MeshPhongMaterial({ color: 0xF87666 });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(-15, 3.75, 0);
  cube.scale.set(.5,.5,.7);
  scene.add(cube);
}

{
  const geometry = new THREE.IcosahedronGeometry(2);
  const material = new THREE.MeshPhongMaterial({ color: 0x6E0E0A });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(15, 9, 0);
  cube.rotation.y = 15;
  cubes.push(cube);
  scene.add(cube);
}

{
  const geometry = new THREE.CylinderGeometry(1, 1, 15, 20);
  const material = new THREE.MeshPhongMaterial({ color: 0xF87666 });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(15, 3.75, 0);
  cube.scale.set(.5,.5,.7);
  scene.add(cube);
}
{
const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
const loader = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/net.jpg')} ); 
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.set(10, 5, 0);
cube.scale.set(10,5,1); 
scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
  const loader = new THREE.TextureLoader();
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/net.jpg')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(-10, 5, 0);
  cube.scale.set(10,5,1); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
  const loader = new THREE.TextureLoader();
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/net.jpg')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(0, 5, 0);
  cube.scale.set(10,5,1); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
  const material = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(-15, 0, 0);
  cube.scale.set(50,.1,1);
  cube.rotation.y = 1.5; 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
  const material = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(15, 0, 0);
  cube.scale.set(50,.1,1);
  cube.rotation.y = 1.5; 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
  const material = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(-1.5, 0, 25);
  cube.scale.set(31,.1,1);
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
  const material = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(1.5, 0, -25);
  cube.scale.set(31,.1,1);
  scene.add( cube );
}
// People
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(18, 0, 8);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0xbf190d} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(19, 0, 12);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x750d9e} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(17, 0, 16);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x09b4ba} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(16, 0, 20);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x3aeb1e} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(-18, 0, -8);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0xf720e5} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(-19, 0, -12);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x0227bd} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(-17, 0, -16);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0xde9414} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(-16, 0, -20);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x134507} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(-18, 0, 8);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x190745} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(19, 0, -12);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x362905} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(-18, 0, 16);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
  const geometry = new THREE.ConeGeometry( 5, 20, 32 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x4b4a59} );
  const cone = new THREE.Mesh(geometry, material ); 
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(19, 0, -20);
  cone.scale.set(.25,.25,.25);
  scene.add( cone );
}
{
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const loader = new THREE.TextureLoader(); 
const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
const cube = new THREE.Mesh( geometry, material );
cube.position.set(19, 2, 12);
cubes.push(cube); 
scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(17, 2, 16);
  cubes.push(cube); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(16, 2, 20);
  cubes.push(cube); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(-18, 2, -8);
  cubes.push(cube); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(-19, 2, -12);
  cubes.push(cube); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(-17, 2, -16);
  cubes.push(cube); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(-16, 2, -20);
  cubes.push(cube);
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(-18, 2, 8);
  cubes.push(cube); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(19, 2, -12);
  cubes.push(cube); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(-18, 2, 16);
  cubes.push(cube);
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const loader = new THREE.TextureLoader(); 
  const material = new THREE.MeshBasicMaterial( {map: loader.load('textures/lego.png')} ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(19, 2, -20);
  cubes.push(cube); 
  scene.add( cube );
}
{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0xF87666 } ); 
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(17, 2, 0);
  cube.scale.set(3,6,2);
  scene.add( cube );
}

// Billboard
const bodyRadiusTop = .4;
const bodyRadiusBottom = .2;
const bodyHeight = 2;
const bodyRadialSegments = 6;
const bodyGeometry = new THREE.CylinderGeometry(
    bodyRadiusTop, bodyRadiusBottom, bodyHeight, bodyRadialSegments);

const headRadius = bodyRadiusTop * 0.8;
const headLonSegments = 12;
const headLatSegments = 5;
const headGeometry = new THREE.SphereGeometry(
    headRadius, headLonSegments, headLatSegments);

function makeLabelCanvas(baseWidth, size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font =  `${size}px bold sans-serif`;
  ctx.font = font;
  // measure how long the name will be
  const textWidth = ctx.measureText(name).width;

  const doubleBorderSize = borderSize * 2;
  const width = baseWidth + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  // need to set font again after resizing canvas
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);

  // scale to fit but don't stretch
  const scaleFactor = Math.min(1, baseWidth / textWidth);
  ctx.translate(width / 2, height / 2);
  ctx.scale(scaleFactor, 1);
  ctx.fillStyle = 'white';
  ctx.fillText(name, 0, 0);

  return ctx.canvas;
}

function makePerson(x, y, z, labelWidth, size, name, color) {
  const canvas = makeLabelCanvas(labelWidth, size, name);
  const texture = new THREE.CanvasTexture(canvas);
  // because our canvas is likely not a power of 2
  // in both dimensions set the filtering appropriately.
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const labelMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color,
    flatShading: true,
  });

  const root = new THREE.Object3D();
  root.position.x = x;
  root.position.y = y;
  root.position.z = z;

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(body);
  body.position.y = bodyHeight / 2;

  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  root.add(head);
  head.position.y = bodyHeight + headRadius * 1.1;

  // if units are meters then 0.01 here makes size
  // of the label into centimeters.
  const labelBaseScale = 0.01;
  const label = new THREE.Sprite(labelMaterial);
  root.add(label);
  label.position.y = head.position.y + headRadius + size * labelBaseScale;

  label.scale.x = canvas.width  * labelBaseScale;
  label.scale.y = canvas.height * labelBaseScale;

  scene.add(root);
  return root;
}

makePerson(-17, 0, 25, 150, 32, 'Line Ref', 'purple');
makePerson(17, 0, -25, 150, 32, 'Line Ref', 'blue');
makePerson(-17, 0, 0, 150, 32, 'Down Ref', 'green');
makePerson(17, 5, 0, 150, 32, 'Up Ref', 'red');

// Render Cube and play animation
    function render(time) {
      time *= 0.001;
  
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
  
      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
  
      renderer.render(scene, camera);
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }

main();