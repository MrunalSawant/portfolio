import { AnimationClip, Mesh, Object3D, Scene } from "three";
import { GLTFLoader } from "../lib/GLTFLoader";
import { sceneInstance } from "./Scene/SceneManager";
import { characterInstance } from "./Scene/Character";
import { grass, grassField } from "./Scene/Model";

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
    const model = await this.loadModelPromise("models/character.glb");
    //  await this.loadGras();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    characterInstance.init(model.scene);
    characterInstance.loadAnimation(model.animations);
    return;
  }

  public loadModelPromise(modelUrl: string): Promise<GLTF> {
    return new Promise(function (resolve, reject) {
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

  async loadGras() {
    const gltf = await this.loadModelPromise("models/forest/grass1.glb");
    const geometry = (gltf.scene.children[0] as Mesh).geometry;
    const material = (gltf.scene.children[0] as Mesh).material;
    sceneInstance.makeInstanceOnXZPlane(geometry, material, 15, grassField);
  }

  createEnv() {}
}
