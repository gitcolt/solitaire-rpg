import {Entity} from './entity';
import {TILE_SIZE} from './overworld';
import {tileToScreenPos} from './utils';

export class NPC extends Entity {
  constructor() {
    super();
  }

  render(ctx: CanvasRenderingContext2D, screenOffsetX: number, screenOffsetY: number) {
    if (!this.textureAtlas)
      return;

    let [screenPosX, screenPosY] = tileToScreenPos(this.currTile);
    screenPosX -= screenOffsetX;
    screenPosY -= screenOffsetY;

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
