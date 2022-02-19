import {
  BufferGeometry,
  Euler,
  InstancedMesh,
  Material,
  Matrix4,
  Quaternion,
  Scene,
  Vector3,
} from "three";

export class SceneManager {
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
    scale.y = 0.8;
    matrix.compose(position, quaternion, scale);
  };
})();
