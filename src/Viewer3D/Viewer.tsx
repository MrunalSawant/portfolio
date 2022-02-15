import React from "react";
import { DirectionalLight, GridHelper, HemisphereLight, LinearEncoding, LogLuvEncoding, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Scene, SpotLight, sRGBEncoding, Vector3, WebGLRenderer } from "three";
import { GLTFLoader } from "../lib/GLTFLoader";
import { ModelManager } from "./ModelManager";

export class Viewer extends React.Component {

 private _scene!: Scene;
 private _camera!: PerspectiveCamera;
 private _renderer!: WebGLRenderer;

 componentDidMount() {
  const modelManager = new ModelManager()
  const canvas = document.getElementById("viewer3d");
  if (!canvas) {
   return;
  }
  this._scene = new Scene();
  this._scene.add(this._viewerPlane())
  this._addLights();
  this._camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 1000);
  this._camera.position.set(20, 20, 40);
  this._camera.lookAt(new Vector3(0, 0, 0));
  this._renderer = new WebGLRenderer({ canvas, antialias: true });
  this._renderer.setSize(window.innerWidth, window.innerHeight);
  this._renderer.setPixelRatio(window.devicePixelRatio);
  this._renderer.setClearColor(0x000000, 0);
  this.animate();
 }

 _addLights() {
  const light = new PointLight(0xffffff, 1.6, 9000);
  light.position.set(20, 20, 40);
  light.castShadow = true;
  this._scene.add(light);

  const light2 = new PointLight(0xcccccc, 1.5);
  light2.position.set(0, 0, 20);
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
  this._renderer.render(this._scene, this._camera);
 }

 render() {
  return <div style={{ backgroundImage: "linear-gradient(#56ab2f, #a8e063)" }}> <canvas id="viewer3d" /> </div>
 }
}
