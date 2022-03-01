import { Mesh, MeshPhongMaterial, PlaneBufferGeometry } from "three";

export const createFloor = function (): Mesh {
  const mesh = new Mesh(
    new PlaneBufferGeometry(1000, 1000),
    new MeshPhongMaterial({ color: 0x35570e, depthWrite: false })
  );
  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
};
