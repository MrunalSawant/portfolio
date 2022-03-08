import React from "react";
import { Clock, PerspectiveCamera, Scene, sRGBEncoding, Vector3, WebGLRenderer } from "three";
import { TrackballControls } from './../lib/TrackballControls.js';
import Controller from "./Controller/Controller";
import { characterInstance } from "./Scene/Character";
import { grassField } from "./Scene/Model";
import { sceneInstance } from "./Scene/SceneManager";
import { shadowInstance } from "./Scene/Shadow";
import "./Viewer.scss"

type ViewerState = {
  isSceneReady: boolean,
  isStarted: boolean,
};
export class Viewer extends React.Component {

  state: ViewerState = { isSceneReady: false, isStarted: false, };

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
    this._camera.position.set(0, 4.75, 5);
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
    this.animate();

    if (sceneInstance) {
      await sceneInstance.initScene(this._scene);


      this.setState({ isSceneReady: true })
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
        shadowInstance.shadowGroup.position.add(movement);
        const distance = this._camera.position.distanceTo(this._trackballControls.target);
        const newCameraPostion = characterInstance.model.position.clone().add(this._postionToTargetDirection.clone().multiplyScalar(distance))
        this._camera.position.copy(newCameraPostion);
        this._camera.lookAt(characterInstance.model.position);
        this._trackballControls.target.copy(characterInstance.model.position)
        this._camera.updateMatrix();
      }

      if (characterInstance.activeAction.name === 'Walking') {
        let rotation = new Vector3(0, 0, 1);
        rotation.applyEuler(characterInstance.model.rotation);
        const movement = rotation.clone().multiplyScalar(dt * -3)
        characterInstance.model.position.add(movement);
        const distance = this._camera.position.distanceTo(this._trackballControls.target);
        const newCameraPostion = characterInstance.model.position.clone().add(this._postionToTargetDirection.clone().multiplyScalar(distance))
        this._camera.position.copy(newCameraPostion);
        this._camera.lookAt(characterInstance.model.position);
        this._trackballControls.target.copy(characterInstance.model.position)
        this._camera.updateMatrix();
      }
    }


    if (shadowInstance.depthMaterial) {
      this._scene.overrideMaterial = shadowInstance.depthMaterial;

      // render to the render target to get the depths
      this._renderer.setRenderTarget(shadowInstance.renderTarget);
      this._renderer.render(this._scene, shadowInstance.shadowCamera);

      // and reset the override material
      this._scene.overrideMaterial = null;
      shadowInstance.blurShadow(0.2, this._renderer);

      // a second pass to reduce the artifacts
      // (0.4 is the minimum blur amout so that the artifacts are gone)
      shadowInstance.blurShadow(0.4, this._renderer);

      // reset and render the normal scene
      this._renderer.setRenderTarget(null);
    }

    requestAnimationFrame(this.animate.bind(this));
    this._trackballControls.update();
    this._renderer.render(this._scene, this._camera);
  }


  onStartClick() {
    this.setState({ isStarted: true })
    sceneInstance.start();
  }

  render() {
    return <div>
      <Controller isStarted={this.state.isStarted} isSceneReady={this.state.isSceneReady} onStartClick={this.onStartClick.bind(this)} />
      <div className="viewer-container" >
        <canvas id="viewer3d" />
      </div>
    </div >
  }
}


