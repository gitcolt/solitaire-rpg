import {TILE_SIZE} from './overworld';
import {Entity} from './entity';
import {tileToScreenPos} from './utils';

export class Player extends Entity {
  xp: number;

  constructor() {
    super();
    this.xp = 0;
  }

  render(ctx: CanvasRenderingContext2D, screenOffsetX: number, screenOffsetY: number) {
    if (!this.textureAtlas)
      return;

    let [screenPosX, screenPosY] = tileToScreenPos(this.currTile);
    screenPosX += this.tileOffsetX * TILE_SIZE - screenOffsetX;
    screenPosY += this.tileOffsetY * TILE_SIZE - screenOffsetY;

    if (window.debug) {
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'red';
      ctx.arc(screenPosX + TILE_SIZE/2, screenPosY + TILE_SIZE/2, 10, 0, 2*Math.PI);
      ctx.stroke();
      ctx.moveTo(screenPosX + TILE_SIZE/2, screenPosY + TILE_SIZE/2);
      ctx.lineTo(screenPosX + TILE_SIZE/2 + Math.cos(this.angle) * 20,
                 screenPosY + TILE_SIZE/2 + Math.sin(this.angle) * 20);
      ctx.stroke();
      return;
    }

    ctx.drawImage(this.textureAtlas,
                  this.textureAtlasIdx * this.textureAtlas.height,
                  0,
                  this.textureAtlas.height,
                  this.textureAtlas.height,
                  screenPosX,
                  screenPosY,
                  TILE_SIZE,
                  TILE_SIZE);
  }
}
