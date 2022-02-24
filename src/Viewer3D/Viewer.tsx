import React from "react";
import { Clock, GridHelper, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Scene, sRGBEncoding, Vector3, WebGLRenderer } from "three";
import { ModelManager } from "./ModelManager";
import { myClassInstance } from "./Controls/Controls";
import { TrackballControls } from './../lib/TrackballControls.js';
import { characterInstance } from "./Scene/Character";

export class Viewer extends React.Component {

 private _scene!: Scene;
 private _camera!: PerspectiveCamera;
 private _renderer!: WebGLRenderer;
 private _trackballControls!: TrackballControls;
 private _clock!: Clock;
 private _postionToTargetDirection!: Vector3;

 componentDidMount() {

  myClassInstance.init();

  const modelManager = new ModelManager();
  modelManager.loadAndStoreModels();

  const canvas = document.getElementById("viewer3d");
  if (!canvas) {
   return;
  }

  this._clock = new Clock();

  this._scene = new Scene();
  this._scene.add(this._viewerPlane())
  const size = 1000;
  const divisions = 1000;

  const gridHelper = new GridHelper(size, divisions);
  // this._scene.add(gridHelper);

  this._addLights();
  this._camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 5000);
  this._camera.position.set(0, 20, 40);
  this._camera.lookAt(new Vector3(0, 0, 0));
  this._postionToTargetDirection = this._camera.position.clone().sub(new Vector3(0, 0, 0)).normalize();

  this._renderer = new WebGLRenderer({ canvas, antialias: true });
  this._renderer.setSize(window.innerWidth, window.innerHeight);
  this._renderer.setPixelRatio(window.devicePixelRatio);
  this._renderer.outputEncoding = sRGBEncoding
  this._renderer.setClearColor(0x000000, 0);
  this._renderer.toneMappingExposure = Math.pow(1, 5.0); // to allow for very bright scenes.
  this._renderer.shadowMap.enabled = true;
  this._trackballControls = new TrackballControls(this._camera, this._renderer.domElement);


  this._trackballControls.noRotate = true;
  this._trackballControls.zoomSpeed = 1.2;
  this._trackballControls.panSpeed = 0.4;
  this._trackballControls.keys = ['KeyA', 'KeyS', 'KeyD'];
  modelManager.loadChar(this._scene);
  this.animate();
 }


 _addLights() {

  const light = new HemisphereLight(0xddeeff, 0x0f0e0d, 0.5);
  light.position.set(20, 20, 20);
  light.castShadow = false;
  this._scene.add(light);

  const light2 = new PointLight(0xffffff, 1.5, 100000, 1);
  light2.position.set(-800, 700, 800);
  light2.castShadow = true;
  light2.shadow.mapSize.width = 4096;
  light2.shadow.mapSize.height = 4096;
  light2.shadow.radius = 1;
  this._scene.add(light2);
 }

 _viewerPlane(): Mesh {
  const mesh = new Mesh(
   new PlaneGeometry(2000, 2000),
   new MeshPhongMaterial({ color: 0x56ab2f, depthWrite: false })
  );
  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
 }

 animate() {

  // Move character (if it want's to move)
  const dt = this._clock.getDelta();
  if (characterInstance.mixer) characterInstance.mixer.update(dt);
  if (characterInstance.activeAction) {
   if (characterInstance.activeAction.name === 'Running') {
    let rotation = new Vector3(0, 0, 1);
    rotation.applyEuler(characterInstance.model.rotation);
    const movement = rotation.clone().multiplyScalar(dt * 6)
    characterInstance.model.position.add(movement);

    const distance = this._camera.position.distanceTo(this._trackballControls.target);
    console.log("distance camera to postion" + distance);
    console.log("Camera target" + characterInstance.model.position.toArray());
    console.log("Camera Direction" + this._postionToTargetDirection.toArray());

    const newCameraPostion = characterInstance.model.position.clone().add(this._postionToTargetDirection.clone().multiplyScalar(distance))

    console.log("Camera Postion old " + this._camera.position.toArray());
    console.log("Camera Postion new " + newCameraPostion.toArray());
    this._camera.position.copy(newCameraPostion);
    this._camera.lookAt(characterInstance.model.position);
    this._trackballControls.target.copy(characterInstance.model.position)
    this._camera.updateMatrix();

   }
  }

  requestAnimationFrame(this.animate.bind(this));
  this._trackballControls.update();
  this._renderer.render(this._scene, this._camera);
 }

 render() {
  return <div style={{ backgroundImage: "linear-gradient(#56ab2f, #a8e063)" }}> <canvas id="viewer3d" /> </div>
 }
}


// POC for adding annotation in viewer and capturing it 