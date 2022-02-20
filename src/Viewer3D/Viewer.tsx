import React from "react";
import { DirectionalLight, GridHelper, HemisphereLight, LinearEncoding, LogLuvEncoding, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Scene, SpotLight, sRGBEncoding, Vector3, WebGLRenderer } from "three";
import { ModelManager } from "./ModelManager";
import { character } from "./Scene/Models";
import { myClassInstance } from "./Controls/Controls";
import { TrackballControls } from './../lib/TrackballControls.js';

export class Viewer extends React.Component {

 private _scene!: Scene;
 private _camera!: PerspectiveCamera;
 private _renderer!: WebGLRenderer;
 private _trackballControls!: TrackballControls;

 componentDidMount() {

  myClassInstance.init();

  const modelManager = new ModelManager();
  modelManager.loadAndStoreModels();

  const canvas = document.getElementById("viewer3d");
  if (!canvas) {
   return;
  }

  this._scene = new Scene();
  this._scene.add(this._viewerPlane())

  this._addLights();
  this._camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 5000);
  this._camera.position.set(40, 40, 40);
  this._camera.lookAt(new Vector3(0, 0, 0));
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
  this.loadChar();
 }

 loadChar() {
  this._scene.add(character);
 }

 _addLights() {
  const light = new HemisphereLight(0xddeeff, 0x0f0e0d, 0.6);

  // const light = new PointLight(0xffffff, 1.6, 9000);
  light.position.set(20, 20, 40);
  light.castShadow = false;
  this._scene.add(light);

  const light2 = new PointLight(0xffffff, 1, 10000, 0);
  light2.position.set(100, 100, 20);
  light2.castShadow = true;
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
  requestAnimationFrame(this.animate.bind(this));
  this._trackballControls.update();
  console.log(this._camera.position.toArray())
  this._renderer.render(this._scene, this._camera);
 }

 render() {
  return <div style={{ backgroundImage: "linear-gradient(#56ab2f, #a8e063)" }}> <canvas id="viewer3d" /> </div>
 }
}
