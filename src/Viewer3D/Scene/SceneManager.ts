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
import { createMainLight, createShadowLight } from "./Lights";
import { shadowInstance } from "./Shadow";

class SceneManager {
  private _scene!: Scene;
  private static _instance: SceneManager;
  public floor!: Mesh;
  public mainLight!: Light;
  public shadowLight!: Light;
  public character!: Mesh;
  public modelMap: Map<string, Scene> = new Map();
  public grasField: Scene = new Scene();

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

  async initScene(scene: Scene) {
    await shadowInstance.init();
    SceneManager.Instance._scene = scene;
    const modelManager = new ModelManager();
    SceneManager.Instance.setEventCallback();
    SceneManager.Instance.mainLight = createMainLight();
    SceneManager.Instance.shadowLight = createShadowLight();
    await modelManager.loadAndStoreModels();
  }

  start() {
    this._scene.add(sceneInstance.mainLight);
    this._scene.add(sceneInstance.shadowLight);
    this._scene.add(characterInstance.model);
    characterInstance.sayHello();
    //this.loadGrass(this.grasField);
    // this.addRoad();

    const house1 = sceneInstance.modelMap.get("house1");
    if (house1) {
      house1.position.z = -10;
      //sceneInstance.setRandomPosition(house1);
      this._scene.add(house1);
    }
    const house2 = sceneInstance.modelMap.get("treeh1");
    if (house2) {
      sceneInstance.setRandomPosition(house2);
      this._scene.add(house2);
    }
    this._scene.add(shadowInstance.shadowGroup);
  }

  addRoad() {
    const mainBarricadeWall1: Scene = new Scene();
    const mainBarricadeWall2: Scene = new Scene();

    this.loadBarricades(mainBarricadeWall1);
    this.loadBarricades(mainBarricadeWall2);

    mainBarricadeWall1.rotateY(-Math.PI / 2);
    mainBarricadeWall1.position.x = 12;

    mainBarricadeWall2.rotateY(-Math.PI / 2);
    mainBarricadeWall2.position.x = -12;

    this._scene.add(mainBarricadeWall1);
    this._scene.add(mainBarricadeWall2);
  }

  loadGrass(scene: Scene) {
    const grass1 = sceneInstance.modelMap.get("grass1");
    if (grass1) {
      const geometry = (grass1.children[0] as Mesh).geometry;
      const material = (grass1.children[0] as Mesh).material;

      sceneInstance.makeInstanceOnXZPlane(geometry, material, 100, scene);
    }
  }

  loadBarricades(scene: Scene) {
    const barricade1 = sceneInstance.modelMap.get("barricade1");
    const barricade2 = sceneInstance.modelMap.get("barricade2");
    const barricade3 = sceneInstance.modelMap.get("barricade3");
    const barricade4 = sceneInstance.modelMap.get("barricade4");

    if (barricade1 && barricade2 && barricade3 && barricade4) {
      const geometry1 = (barricade1.children[0] as Mesh).geometry;
      const material1 = (barricade1.children[0] as Mesh).material;
      const geometry3 = (barricade3.children[0] as Mesh).geometry;
      const material3 = (barricade3.children[0] as Mesh).material;
      const geometry4 = (barricade4.children[0] as Mesh).geometry;
      const material4 = (barricade4.children[0] as Mesh).material;

      sceneInstance.makeInstanceOnStraightLine(
        [geometry1, geometry4, geometry3, geometry4],
        [material1, material4, material3, material4],
        30,
        scene
      );
    }
  }

  setRandomPosition(scene: Scene) {
    scene.position.x = Math.random() * 100;
    scene.position.z = Math.random() * 100;
  }

  public makeInstanceOnStraightLine(
    geometry: Array<BufferGeometry>,
    material: Array<Material | Material[]>,
    count: number,
    scene: Scene
  ) {
    if (geometry.length !== material.length) {
      return;
    }
    const meshArray: Array<InstancedMesh> = [];

    for (let i = 0; i < geometry.length; ++i) {
      const mesh = new InstancedMesh(geometry[i], material[i], count);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      meshArray.push(mesh);
    }

    const position = new Vector3();
    const rotation = new Euler();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    const xzMatrixOnStraight = function (
      matrix: Matrix4,
      indexX: number,
      zRotation: number,
      newScale: Vector3
    ): void {
      position.x = indexX * 1.9;
      position.y = 0.8;
      rotation.z = zRotation;
      quaternion.setFromEuler(rotation);
      scale.x = newScale.x;
      scale.z = newScale.z;
      scale.y = newScale.y;
      matrix.compose(position, quaternion, scale);
    };

    for (let i = 0; i < count; i++) {
      let random = Math.floor(Math.random() * 4);
      console.log(random);
      const matrix = new Matrix4();

      xzMatrixOnStraight(matrix, i, Math.PI, new Vector3(0.05, 0.5, 0.05));

      meshArray[random].setMatrixAt(i, matrix);
    }

    scene.add(...meshArray);
  }

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

    const position = new Vector3();
    const rotation = new Euler();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    const xzMatrixOnPlane = function (
      matrix: Matrix4,
      indexX: number,
      indexZ: number,
      newScale: Vector3
    ): void {
      position.x = indexX * 1.2;
      position.z = indexZ * 1.2;
      rotation.z = Math.PI;
      rotation.y = Math.random() * 2 * Math.PI;
      quaternion.setFromEuler(rotation);
      scale.x = newScale.x;
      scale.z = newScale.z;
      scale.y = newScale.y;
      matrix.compose(position, quaternion, scale);
    };

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        xzMatrixOnPlane(matrix, i, j, new Vector3(0.05, 0.9, 0.05));

        mesh.setMatrixAt(Number(i * 16 + j), matrix);
      }
    }

    scene.add(mesh);
  }
}

export const sceneInstance = SceneManager.Instance;
