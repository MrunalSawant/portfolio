import React from "react";
import { Clock, GridHelper, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Scene, sRGBEncoding, Vector3, WebGLRenderer } from "three";
import { TrackballControls } from './../lib/TrackballControls.js';
import { characterInstance } from "./Scene/Character";
import { grassField } from "./Scene/Model";
import { sceneInstance } from "./Scene/SceneManager";

export class Viewer extends React.Component {

 private _scene!: Scene;
 private _camera!: PerspectiveCamera;
 private _renderer!: WebGLRenderer;
 private _trackballControls!: TrackballControls;
 private _clock!: Clock;
 private _postionToTargetDirection!: Vector3;

 async componentDidMount() {

  const canvas = document.getElementById("viewer3d");
  if (!canvas) {
   return;
  }

  this._clock = new Clock();
  this._scene = new Scene();
  this._camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 5000);
  this._camera.position.set(0, 25, 40);
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
  this.animate();

  if (sceneInstance) {
   await sceneInstance.initScene();
   // sceneInstance.start();
   this._scene.add(sceneInstance.floor);
   this._scene.add(sceneInstance.mainLight);
   this._scene.add(sceneInstance.shadowLight);
   this._scene.add(characterInstance.model);
   this._scene.add(grassField);
  }
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
    const newCameraPostion = characterInstance.model.position.clone().add(this._postionToTargetDirection.clone().multiplyScalar(distance))

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