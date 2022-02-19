import { Mesh, Scene } from "three";

let character: Scene = new Scene();
let woodBox: Mesh = new Mesh();
let wineBox: Mesh = new Mesh();
let treesTypeA: Array<Mesh> = [];
let treesTypeB: Array<Mesh> = [];
let treesTypeC: Array<Mesh> = [];
let house: Array<Mesh> = [];
let rocks: Array<Mesh> = [];
let flowers: Array<Mesh> = [];
let grass: Scene = new Scene();
let grassFarm: Mesh = new Mesh();

let leaf: Array<Mesh> = [];
let barricades: Array<Mesh> = [];

export {
  character,
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
};
