import { Object3D, Scene } from "three";
import { GLTFLoader } from "../lib/GLTFLoader";
import { SceneManager } from "./Scene/SceneManager";
import { characterInstance } from "./Scene/Character";

const loader = new GLTFLoader();

export function loadModel(
  modelUrl: string,
  onLoad: Function,
  onProgress?: Function,
  onError?: Function
): void {
  loader.load(modelUrl, onLoad, onProgress, onError);
}

export class ModelManager {
  isCharacterLoaded = false;
  sceneManager: SceneManager;

  constructor() {
    this.sceneManager = new SceneManager();
  }

  loadAndStoreModels() {
    // this.loadGrass();
  }

  public loadChar(scene: Scene) {
    loadModel(
      "models/character.glb",
      (gltf: { scene: Scene; animations: any }) => {
        gltf.scene.traverse(function (object: Object3D) {
          //@ts-ignore
          if (object.isMesh) {
            object.castShadow = true;
          }
        });
        scene.add(gltf.scene);
        this.isCharacterLoaded = true;
        characterInstance.init(gltf.scene);
        characterInstance.loadAnimation(gltf.animations);
      }
    );
  }

  loadGrass() {
    loadModel("models/forest/grass1.glb", (gltf: { scene: Scene }) => {
      //   this.onModelLoad(gltf, character);
      this.isCharacterLoaded = true;
    });
  }

  // onModelLoad(gltf: { scene: Scene }, scene: Scene) {
  //   // HACK We know that wer have only one child for each mesh so we will load 0th object every time.
  //   // mesh.copy(gltf.scene.children[0] as Mesh);
  //   const geometry = (gltf.scene.children[0] as Mesh).geometry;
  //   const material = (gltf.scene.children[0] as Mesh).material;
  //   this.sceneManager.makeInstanceOnXZPlane(geometry, material, 15, scene);
  // }

  createEnv() {}
}
