export function pointInBounds(x: number, y: number,
                              startX: number, startY: number,
                              endX: number, endY: number) {
  return x > startX &&
         x < endX   &&
         y > startY &&
         y < endY;
}
