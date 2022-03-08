import { AnimationClip, Mesh, Scene } from "three";
import { GLTFLoader } from "../lib/GLTFLoader";
import { sceneInstance } from "./Scene/SceneManager";
import { characterInstance } from "./Scene/Character";

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

    this.loadHouse("barricade1");
    this.loadHouse("barricade2");
    this.loadHouse("barricade3");
    this.loadHouse("barricade4");
    this.loadHouse("flowerblue");
    this.loadHouse("flowerwhite");
    this.loadHouse("floweryellow");
    this.loadHouse("grass1");
    this.loadHouse("grass2");
    this.loadHouse("grass3");
    this.loadHouse("house1");
    this.loadHouse("house2");
    this.loadHouse("house3");
    this.loadHouse("rock1");
    this.loadHouse("rock2");
    this.loadHouse("rock3");
    this.loadHouse("rock4");
    this.loadHouse("rock5");
    this.loadHouse("rock6");
    this.loadHouse("rock7");
    this.loadHouse("rock8");
    this.loadHouse("rock9");
    this.loadHouse("rock10");
    this.loadHouse("rock11");
    this.loadHouse("rose");
    this.loadHouse("treea1");
    this.loadHouse("treea2");
    this.loadHouse("treeb1");
    this.loadHouse("treeb2");
    this.loadHouse("treeb3");
    this.loadHouse("treeb4");
    this.loadHouse("treec1");
    this.loadHouse("treed1");
    this.loadHouse("treed1");
    this.loadHouse("treed2");
    this.loadHouse("treed3");
    this.loadHouse("treee1");
    this.loadHouse("treee2");
    this.loadHouse("treee3");
    this.loadHouse("treef1");
    this.loadHouse("treef2");
    this.loadHouse("treef3");
    this.loadHouse("treef4");
    this.loadHouse("treeg1");
    this.loadHouse("treeh1");
    this.loadHouse("treeh2");
    this.loadHouse("treeh3");
    this.loadHouse("winebox");
    this.loadHouse("woodbox");
    this.loadHouse("woodboxset");
    this.loadHouse("woodcut");
    return;
  }

  async loadHouse(name: string): Promise<void> {
    const model = await this.loadModelPromise("models/forest/" + name + ".glb");
    if (model) {
      sceneInstance.modelMap.set(name, model.scene);
    }
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
    // sceneInstance.makeInstanceOnXZPlane(geometry, material, 15, grassField);
  }

  createEnv() {}
}
