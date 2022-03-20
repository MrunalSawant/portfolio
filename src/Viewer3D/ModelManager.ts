/* eslint-disable @typescript-eslint/ban-types */
import { AnimationClip, Scene } from 'three';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { characterInstance } from './Scene/Character';
import { sceneInstance } from './Scene/SceneManager';

const loader = new GLTFLoader();

export interface GLTF {
  scene: Scene;
  animations: Array<AnimationClip>;
}

export function loadModel(
  modelUrl: string,
  onLoad: Function,
  onProgress?: Function,
  onError?: Function
): void {
  loader.load(modelUrl, onLoad, onProgress, onError);
}

export class ModelManager {
  async loadAndStoreModels(): Promise<any> {
    const model = await this.loadModelPromise('models/character.glb');
    characterInstance.init(model.scene);
    characterInstance.loadAnimation(model.animations);

    this.loadGlb('barricade1');
    this.loadGlb('barricade2');
    this.loadGlb('barricade3');
    this.loadGlb('barricade4');
    this.loadGlb('flowerblue');
    this.loadGlb('flowerwhite');
    this.loadGlb('floweryellow');
    this.loadGlb('grass1');
    this.loadGlb('grass2');
    this.loadGlb('grass3');
    this.loadGlb('house1');
    this.loadGlb('house2');
    this.loadGlb('house3');
    this.loadGlb('rock1');
    this.loadGlb('rock2');
    this.loadGlb('rock3');
    this.loadGlb('rock4');
    this.loadGlb('rock5');
    this.loadGlb('rock6');
    this.loadGlb('rock7');
    this.loadGlb('rock8');
    this.loadGlb('rock9');
    this.loadGlb('rock10');
    this.loadGlb('rock11');
    this.loadGlb('rose');
    this.loadGlb('treea1');
    this.loadGlb('treea2');
    this.loadGlb('treeb1');
    this.loadGlb('treeb2');
    this.loadGlb('treeb3');
    this.loadGlb('treeb4');
    this.loadGlb('treec1');
    this.loadGlb('treed1');
    this.loadGlb('treed1');
    this.loadGlb('treed2');
    this.loadGlb('treed3');
    this.loadGlb('treee1');
    this.loadGlb('treee2');
    this.loadGlb('treee3');
    this.loadGlb('treef1');
    this.loadGlb('treef2');
    this.loadGlb('treef3');
    this.loadGlb('treef4');
    this.loadGlb('treeg1');
    this.loadGlb('treeh1');
    this.loadGlb('treeh2');
    this.loadGlb('treeh3');
    this.loadGlb('winebox');
    this.loadGlb('woodbox');
    this.loadGlb('woodboxset');
    this.loadGlb('woodcut');
  }

  async loadGlb(name: string): Promise<void> {
    const model = await this.loadModelPromise(`models/forest/${name}.glb`);
    if (model) {
      sceneInstance.modelMap.set(name, model.scene);
    }
  }

  public loadModelPromise(modelUrl: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      loadModel(
        modelUrl,
        (gltf: { scene: Scene; animations: any }) => {
          resolve(gltf);
        },
        () => {},
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  async loadGras() : Promise<void> {
    // const gltf = await this.loadModelPromise('models/forest/grass1.glb');
    // const { geometry } = gltf.scene.children[0] as Mesh;
    // const { material } = gltf.scene.children[0] as Mesh;
    // sceneInstance.makeInstanceOnXZPlane(geometry, material, 15, grassField);
  }
}
