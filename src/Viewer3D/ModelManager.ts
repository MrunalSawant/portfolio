import { Mesh, Scene } from "three";
import { GLTFLoader } from "../lib/GLTFLoader";
import { character } from "./Models";

const loader = new GLTFLoader();

export function loadModel(modelUrl: string, mesh: Mesh): void {
  loader.load(
    modelUrl,
    function (gltf: { scene: Scene }) {
      mesh.copy(mesh);
    },
    function (e: any) {
      console.log(e);
    },
    function (e: any) {
      console.error(e);
    }
  );
}

export class ModelManager {
  constructor() {
    this.loadAndStoreModels();
    this.createEnv();
  }

  loadAndStoreModels() {
    this.loadChar();
  }

  loadChar() {
    loadModel("character.glb", character);
  }

  createEnv() {}
}
