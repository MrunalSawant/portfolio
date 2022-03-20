import { Mesh, Scene } from 'three';

const woodBox: Mesh = new Mesh();
const wineBox: Mesh = new Mesh();
const treesTypeA: Array<Mesh> = [];
const treesTypeB: Array<Mesh> = [];
const treesTypeC: Array<Mesh> = [];
const house: Array<Scene> = [];
const rocks: Array<Mesh> = [];
const flowers: Array<Mesh> = [];
const grass: Mesh = new Mesh();
const leaf: Array<Mesh> = [];
const barricades: Array<Mesh> = [];
const grassField: Scene = new Scene();

export {
  woodBox,
  wineBox,
  treesTypeA,
  treesTypeB,
  treesTypeC,
  house,
  rocks,
  flowers,
  leaf,
  barricades,
  grass,
  grassField
};
