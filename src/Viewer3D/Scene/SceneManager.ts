import {
  BufferGeometry,
  Euler,
  InstancedMesh,
  Light,
  Material,
  Matrix4,
  Mesh,
  Quaternion,
  Scene,
  Vector3,
} from "three";
import { ModelManager } from "../ModelManager";
import { characterInstance } from "./Character";
import { createFloor } from "./Floor";
import { createMainLight, createShadowLight } from "./Lights";

class SceneManager {
  private static _instance: SceneManager;
  public floor!: Mesh;
  public mainLight!: Light;
  public shadowLight!: Light;
  public character!: Mesh;

  public static get Instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new this();
    return this._instance;
  }

  setEventCallback() {
    document.onkeydown = function (event: KeyboardEvent) {
      characterInstance.act(event.code, event.shiftKey);
    };

    document.onkeyup = function (event: KeyboardEvent) {
      characterInstance.stopAct(event.code, event.shiftKey);
      event.preventDefault();
    };

    document.onmousedown = function (event: MouseEvent) {
      // Punch on mouse click
    };
  }

  async initScene() {
    const modelManager = new ModelManager();
    SceneManager.Instance.setEventCallback();
    SceneManager.Instance.floor = createFloor();
    SceneManager.Instance.mainLight = createMainLight();
    SceneManager.Instance.shadowLight = createShadowLight();
    await modelManager.loadAndStoreModels();
  }

  start() {}

  public makeInstanceOnXZPlane(
    geometry: BufferGeometry,
    material: Material | Material[],
    count: number,
    scene: Scene
  ) {
    const matrix = new Matrix4();
    const mesh = new InstancedMesh(geometry, material, count * count);
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        xzMatrixOnPlane(matrix, i, j);
        mesh.setMatrixAt(Number(i * 16 + j), matrix);
      }
    }

    scene.add(mesh);
  }
}

export const sceneInstance = SceneManager.Instance;

const xzMatrixOnPlane = (function () {
  const position = new Vector3();
  const rotation = new Euler();
  const quaternion = new Quaternion();
  const scale = new Vector3();

  return function (matrix: Matrix4, indexX: number, indexZ: number) {
    position.x = indexX * 1.2;
    position.z = indexZ * 1.2;
    rotation.z = Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    quaternion.setFromEuler(rotation);
    scale.x = scale.z = 0.05;
    scale.y = 0.9;
    matrix.compose(position, quaternion, scale);
  };
})();
