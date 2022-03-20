/* eslint-disable react/jsx-no-bind */
import React, { ReactElement } from 'react';
import {
  Clock, PerspectiveCamera, Scene, sRGBEncoding, Vector3, WebGLRenderer
} from 'three';
import { TrackballControls } from '../lib/TrackballControls.js';
import Controller from './Controller/Controller';
import { characterInstance } from './Scene/Character';
import { sceneInstance } from './Scene/SceneManager';
import { shadowInstance } from './Scene/Shadow';

import CANNON from '../lib/cannon.js';
import './Viewer.scss';
import { ModelManager } from './ModelManager';

type ViewerState = {
  isSceneReady: boolean,
  isStarted: boolean,
};
export class Viewer extends React.Component {
  state: ViewerState = { isSceneReady: false, isStarted: false };

  private _scene!: Scene;

  private _world!: any;

  private _shape!: any;

  private _body!: any;

  private _camera!: PerspectiveCamera;

  private _renderer!: WebGLRenderer;

  private _trackballControls!: TrackballControls;

  private _clock!: Clock;

  private _postionToTargetDirection!: Vector3;

  async componentDidMount(): Promise<void> {
    const canvas = document.getElementById('viewer3d');
    if (!canvas) {
      return;
    }

    canvas.addEventListener('mousemove', (event) => {
      // @ts-ignore
      const adjustedMouseX = event.clientX - event.target.width / 2;
      // @ts-ignore
      const adjustedMouseY = -event.clientY + event.target.height / 2;
      if (characterInstance) { characterInstance.setCharLookAtDirection(adjustedMouseX, adjustedMouseY); }
    });

    canvas.addEventListener('mousedown', (event: MouseEvent) => {
      if (characterInstance && event.button === 0) { characterInstance.act('KeyP'); }
    });

    this._clock = new Clock();
    this._scene = new Scene();

    this._camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 5000);
    this._camera.position.set(0, 9.5, 10);
    this._camera.lookAt(new Vector3(0, 0, 0));
    this._postionToTargetDirection = this._camera.position.clone().sub(new Vector3(0, 0, 0)).normalize();

    this._renderer = new WebGLRenderer({ canvas, antialias: true });
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.outputEncoding = sRGBEncoding;
    this._renderer.setClearColor(0x000000, 0);
    this._renderer.toneMappingExposure = 1 ** 5.0; // to allow for very bright scenes.
    this._renderer.shadowMap.enabled = true;
    this._trackballControls = new TrackballControls(this._camera, this._renderer.domElement);

    this._trackballControls.noRotate = true;
    this._trackballControls.zoomSpeed = 1.2;
    this._trackballControls.panSpeed = 0.4;

    const modelManager = new ModelManager();
    await modelManager.loadAndStoreModels();

    this.animate();
    this.initCannon();

    if (sceneInstance) {
      await sceneInstance.initScene(this._scene);

      this.setState({ isSceneReady: true });
    }
  }

  onStartClick(): void {
    this.setState({ isStarted: true });
    sceneInstance.start();
  }

  animate() : void {
    // Move character (if it want's to move)
    const dt = this._clock.getDelta();
    if (characterInstance.mixer) characterInstance.mixer.update(dt);
    if (characterInstance.activeAction) {
      if (characterInstance.activeAction.name === 'Running') {
        const rotation = new Vector3(0, 0, 1);
        rotation.applyEuler(characterInstance.model.rotation);
        const movement = rotation.clone().multiplyScalar(dt * 6);
        characterInstance.model.position.add(movement);
        shadowInstance.shadowGroup.position.add(movement);
        const distance = this._camera.position.distanceTo(this._trackballControls.target);
        const newCameraPostion = characterInstance.model.position.clone().add(this._postionToTargetDirection.clone().multiplyScalar(distance));
        this._camera.position.copy(newCameraPostion);
        this._camera.lookAt(characterInstance.model.position);
        this._trackballControls.target.copy(characterInstance.model.position);
        this._camera.updateMatrix();
      }

      if (characterInstance.activeAction.name === 'Walking') {
        const rotation = new Vector3(0, 0, 1);
        rotation.applyEuler(characterInstance.model.rotation);
        const movement = rotation.clone().multiplyScalar(dt * -3);
        characterInstance.model.position.add(movement);
        const distance = this._camera.position.distanceTo(this._trackballControls.target);
        const newCameraPostion = characterInstance.model.position.clone().add(this._postionToTargetDirection.clone().multiplyScalar(distance));
        this._camera.position.copy(newCameraPostion);
        this._camera.lookAt(characterInstance.model.position);
        this._trackballControls.target.copy(characterInstance.model.position);
        this._camera.updateMatrix();
      }
    }

    // if (shadowInstance.depthMaterial) {
    //   this._scene.overrideMaterial = shadowInstance.depthMaterial;

    //   // render to the render target to get the depths
    //   this._renderer.setRenderTarget(shadowInstance.renderTarget);
    //   this._renderer.render(this._scene, shadowInstance.shadowCamera);

    //   // and reset the override material
    //   this._scene.overrideMaterial = null;
    //   shadowInstance.blurShadow(0.2, this._renderer);

    //   // a second pass to reduce the artifacts
    //   // (0.4 is the minimum blur amout so that the artifacts are gone)
    //   shadowInstance.blurShadow(0.4, this._renderer);

    //   // reset and render the normal scene
    //   this._renderer.setRenderTarget(null);
    // }

    requestAnimationFrame(this.animate.bind(this));
    this._trackballControls.update();
    this._renderer.render(this._scene, this._camera);
  }

  initCannon() : void {
    // @ts-ignore
    this._world = new CANNON.World();
    console.log(this._world);
    this._world.gravity.set(0, 0, 0);
    // @ts-ignore
    this._world.broadphase = new CANNON.NaiveBroadphase();
    this._world.solver.iterations = 10;

    // @ts-ignore
    this._shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    // mass = 1;
    // @ts-ignore
    this._body = new CANNON.Body({
      mass: 1
    });
    this._body.addShape(this._shape);
    this._body.angularVelocity.set(0, 10, 0);
    this._body.angularDamping = 0.5;
    this._world.addBody(this._body);
  }

  render(): ReactElement {
    return (
      <div>
        <Controller isStarted={this.state.isStarted} isSceneReady={this.state.isSceneReady} onStartClick={this.onStartClick.bind(this)} />
        <div className="viewer-container">
          <canvas id="viewer3d" />
        </div>
      </div>
    );
  }
}
