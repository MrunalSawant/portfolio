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
  Vector3
} from 'three';
import { characterInstance } from './Character';
import { createMainLight, createShadowLight } from './Lights';
import { shadowInstance } from './Shadow';

class SceneManager {
  private _scene!: Scene;

  private static _instance: SceneManager;

  public floor!: Mesh;

  public mainLight!: Light;

  public shadowLight!: Light;

  public character!: Mesh;

  public modelMap: Map<string, Scene> = new Map();

  public grasField: Scene = new Scene();

  public Ammo: any;

  public static get Instance(): SceneManager {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new this();

    return this._instance;
  }

  // private initPhysics() {
  //   // Physics configuration

  //   this.collisionConfiguration =
  //     new sceneInstance.Ammo.btDefaultCollisionConfiguration();
  //   this.dispatcher = new sceneInstance.Ammo.btCollisionDispatcher(
  //     this.collisionConfiguration
  //   );
  //   this.broadphase = new sceneInstance.Ammo.btDbvtBroadphase();
  //   this.solver = new sceneInstance.Ammo.btSequentialImpulseConstraintSolver();
  //   this.softBodySolver = new sceneInstance.Ammo.btDefaultSoftBodySolver();
  //   this.physicsWorld = new sceneInstance.Ammo.btDiscreteDynamicsWorld(
  //     this.dispatcher,
  //     this.broadphase,
  //     this.solver,
  //     this.collisionConfiguration
  //   );
  //   this.physicsWorld.setGravity(
  //     new sceneInstance.Ammo.btVector3(0, -this.gravityConstant, 0)
  //   );
  //   this.physicsWorld
  //     .getWorldInfo()
  //     .set_m_gravity(
  //       new sceneInstance.Ammo.btVector3(0, this.gravityConstant, 0)
  //     );
  //   this.transformAux1 = new sceneInstance.Ammo.btTransform();

  //   // this.transformAux1 = new this.Ammo.btTransform();
  //   // tempBtVec3_1 = new this.Ammo.btVector3(0, 0, 0);
  // }

  setEventCallback(): void {
    document.onkeydown = (event: KeyboardEvent): void => {
      characterInstance.act(event.code);
    };

    document.onkeyup = (event: KeyboardEvent): void => {
      characterInstance.stopAct(event.code);
      event.preventDefault();
    };
  }

  async initScene(scene: Scene): Promise<void> {
    await shadowInstance.init();
    SceneManager.Instance._scene = scene;
    SceneManager.Instance.setEventCallback();
    SceneManager.Instance.mainLight = createMainLight();
    SceneManager.Instance.shadowLight = createShadowLight();
  }

  async physics(): Promise<void> {
    // fghfgh
  }

  start(): void {
    this._scene.add(SceneManager._instance.mainLight);
    this._scene.add(SceneManager._instance.shadowLight);
    this._scene.add(characterInstance.model);
    characterInstance.sayHello();
    // sceneInstance.modelMap.forEach((scene: Scene, key: string) => {
    //   sceneInstance.setRandomPosition(scene);
    //   this._scene.add(scene);
    // });
    // this.loadGrass(this.grasField);
    // this.addRoad();

    // const house1 = sceneInstance.modelMap.get("house1");
    // if (house1) {
    //   house1.castShadow = false;
    //   house1.receiveShadow = false;
    //   house1.position.z = -10;
    //   //sceneInstance.setRandomPosition(house1);
    //   this._scene.add(house1);
    // }
    // const house2 = sceneInstance.modelMap.get("treeh1");
    // if (house2) {
    //   house1.castShadow = false;
    //   sceneInstance.setRandomPosition(house2);
    //   this._scene.add(house2);
    // }
    this._scene.add(shadowInstance.shadowGroup);
  }

  addRoad(): void {
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

  loadGrass(scene: Scene): void {
    const grass1 = SceneManager._instance.modelMap.get('grass1');
    if (grass1) {
      const { geometry } = grass1.children[0] as Mesh;
      const { material } = grass1.children[0] as Mesh;

      SceneManager._instance.makeInstanceOnXZPlane(
        geometry,
        material,
        100,
        scene
      );
    }
  }

  loadBarricades(scene: Scene): void {
    const barricade1 = SceneManager._instance.modelMap.get('barricade1');
    const barricade2 = SceneManager._instance.modelMap.get('barricade2');
    const barricade3 = SceneManager._instance.modelMap.get('barricade3');
    const barricade4 = SceneManager._instance.modelMap.get('barricade4');

    if (barricade1 && barricade2 && barricade3 && barricade4) {
      const geometry1 = (barricade1.children[0] as Mesh).geometry;
      const material1 = (barricade1.children[0] as Mesh).material;
      const geometry3 = (barricade3.children[0] as Mesh).geometry;
      const material3 = (barricade3.children[0] as Mesh).material;
      const geometry4 = (barricade4.children[0] as Mesh).geometry;
      const material4 = (barricade4.children[0] as Mesh).material;

      SceneManager._instance.makeInstanceOnStraightLine(
        [geometry1, geometry4, geometry3, geometry4],
        [material1, material4, material3, material4],
        30,
        scene
      );
    }
  }

  setRandomPosition(scene: Scene): void {
    scene.position.x = 10 + Math.random() * 100;
    scene.position.z = 10 + Math.random() * 100;
  }

  public makeInstanceOnStraightLine(
    geometry: Array<BufferGeometry>,
    material: Array<Material | Material[]>,
    count: number,
    scene: Scene
  ): void {
    if (geometry.length !== material.length) {
      return;
    }
    const meshArray: Array<InstancedMesh> = [];

    for (let i = 0; i < geometry.length; i += 1) {
      const mesh = new InstancedMesh(geometry[i], material[i], count);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      meshArray.push(mesh);
    }

    const position = new Vector3();
    const rotation = new Euler();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    const xzMatrixOnStraight = (
      matrix: Matrix4,
      indexX: number,
      zRotation: number,
      newScale: Vector3
    ): void => {
      position.x = indexX * 1.9;
      position.y = 0.8;
      rotation.z = zRotation;
      quaternion.setFromEuler(rotation);
      scale.x = newScale.x;
      scale.z = newScale.z;
      scale.y = newScale.y;
      matrix.compose(position, quaternion, scale);
    };

    for (let i = 0; i < count; i += 1) {
      const random = Math.floor(Math.random() * 4);
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
  ): void {
    const matrix = new Matrix4();
    const mesh = new InstancedMesh(geometry, material, count * count);
    mesh.receiveShadow = false;
    mesh.castShadow = false;

    const position = new Vector3();
    const rotation = new Euler();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    const xzMatrixOnPlane = (
      xzMatrix: Matrix4,
      indexX: number,
      indexZ: number,
      newScale: Vector3
    ): void => {
      position.x = indexX * 1.2;
      position.z = indexZ * 1.2;
      rotation.z = Math.PI;
      rotation.y = Math.random() * 2 * Math.PI;
      quaternion.setFromEuler(rotation);
      scale.x = newScale.x;
      scale.z = newScale.z;
      scale.y = newScale.y;
      xzMatrix.compose(position, quaternion, scale);
    };

    for (let i = 0; i < count; i += 1) {
      for (let j = 0; j < count; j += 1) {
        xzMatrixOnPlane(matrix, i, j, new Vector3(0.05, 0.9, 0.05));

        mesh.setMatrixAt(Number(i * 16 + j), matrix);
      }
    }

    scene.add(mesh);
  }
}

export const sceneInstance = SceneManager.Instance;
