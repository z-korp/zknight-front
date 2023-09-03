import { Coordinate, ElementType, GridElement, Layer } from '../type/GridElement';
import { Map } from './store';

const i_x = 1;
const i_y = 0.5;
const j_x = -1;
const j_y = 0.5;

const w = 32 * 2;
const h = 32 * 2;

const NUMBER_TILES = 8;

export const WIDTH = 1200;
export const HEIGHT = 600;

export const H_OFFSET = (HEIGHT - (NUMBER_TILES * h) / 2) / 2;

export function to_screen_coordinate(tile: { x: number; y: number }) {
  return {
    x: tile.x * i_x * 0.5 * w + tile.y * j_x * 0.5 * w,
    y: tile.x * i_y * 0.5 * h + tile.y * j_y * 0.5 * h,
  };
}

function invert_matrix(a: number, b: number, c: number, d: number) {
  // Determinant
  const det = 1 / (a * d - b * c);

  return {
    a: det * d,
    b: det * -b,
    c: det * -c,
    d: det * a,
  };
}

export function to_grid_coordinate(screen: { x: number; y: number }) {
  const a = i_x * 0.5 * w;
  const b = j_x * 0.5 * w;
  const c = i_y * 0.5 * h;
  const d = j_y * 0.5 * h;

  const inv = invert_matrix(a, b, c, d);

  return {
    x: screen.x * inv.a + screen.y * inv.b,
    y: screen.x * inv.c + screen.y * inv.d,
  };
}

export function to_center(screen: { x: number; y: number }) {
  return { x: screen.x + WIDTH / 2, y: screen.y + H_OFFSET };
}

export const generateGrid = (map: Map): GridElement[][] => {
  const generated = Array.from({ length: map.size }, (_, x) =>
    Array.from({ length: map.size }, (_, y) => {
      const coordinate: Coordinate = { x, y };
      const layer: Layer = 'base'; // vous pouvez aussi déterminer cela dynamiquement
      // Générer aléatoirement le type (eau ou sol)

      const type = 'ground' as ElementType;

      return { ...coordinate, layer, type };
    })
  );

  map.holes.forEach((hole) => (generated[hole.x][hole.y].type = 'water'));

  return generated;
};

export const areCoordsEqual = (c1: Coordinate, c2: Coordinate) => {
  return c1.x === c2.x && c1.y === c2.y;
};
