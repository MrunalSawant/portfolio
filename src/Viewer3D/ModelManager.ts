import { Mesh, Scene } from "three";
import { GLTFLoader } from "../lib/GLTFLoader";
import { character } from "./Scene/Models";
import { SceneManager } from "./Scene/SceneManager";

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
  sceneManager: SceneManager;
  constructor() {
    this.sceneManager = new SceneManager();
  }

  loadAndStoreModels() {
    // this.loadChar();
    this.loadGrass();
  }

  // loadChar() {
  //   loadModel("models/forest/grass1.glb", (gltf: { scene: Scene }) => {
  //     this.onModelLoad(gltf, character);
  //   });
  // }

  loadGrass() {
    loadModel("models/forest/grass1.glb", (gltf: { scene: Scene }) => {
      this.onModelLoad(gltf, character);
    });
  }

  onModelLoad(gltf: { scene: Scene }, scene: Scene) {
    // HACK We know that wer have only one child for each mesh so we will load 0th object every time.
    // mesh.copy(gltf.scene.children[0] as Mesh);
    const geometry = (gltf.scene.children[0] as Mesh).geometry;
    const material = (gltf.scene.children[0] as Mesh).material;
    this.sceneManager.makeInstanceOnXZPlane(geometry, material, 15, scene);
  }

  createEnv() {}
}
