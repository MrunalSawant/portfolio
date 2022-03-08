import { Mesh, Scene } from "three";

let woodBox: Mesh = new Mesh();
let wineBox: Mesh = new Mesh();
let treesTypeA: Array<Mesh> = [];
let treesTypeB: Array<Mesh> = [];
let treesTypeC: Array<Mesh> = [];
let house: Array<Scene> = [];
let rocks: Array<Mesh> = [];
let flowers: Array<Mesh> = [];
let grass: Mesh = new Mesh();
let leaf: Array<Mesh> = [];
let barricades: Array<Mesh> = [];
let grassField: Scene = new Scene();

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
  grassField,
};
