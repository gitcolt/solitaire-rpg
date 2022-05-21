import {Tile, TILE_SIZE} from './overworld';

export function lerp(a: number, b: number, t: number) {
  return a + t*(b - a);
}

export function tileToScreenPos(tile: Tile): number[] {
  return [tile.x * TILE_SIZE, tile.y * TILE_SIZE];
}

export function pointInBounds(x: number, y: number,
                              startX: number, startY: number,
                              endX: number, endY: number) {
  return x > startX &&
         x < endX   &&
         y > startY &&
         y < endY;
}

export function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}
