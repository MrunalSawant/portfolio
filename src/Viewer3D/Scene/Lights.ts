import { HemisphereLight, Light, PointLight } from "three";

export const createMainLight = function (): Light {
  const hemisphereLight = new HemisphereLight(0xddeeff, 0x0f0e0d, 0.5);
  hemisphereLight.position.set(20, 20, 20);
  hemisphereLight.castShadow = false;
  return hemisphereLight;
};

export const createShadowLight = function (): Light {
  const pointLight = new PointLight(0xffffff, 1.5, 80000, 10);
  pointLight.position.set(-200, 400, 200);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.radius = 1;
  return pointLight;
};
