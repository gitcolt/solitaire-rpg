import playerTextureAtlasPath from './assets/player.png';
import {Tile, TILE_SIZE} from './overworld';
import {tileToScreenPos} from './utils';

// EntitySpeed.VALUE is the amount of a TILE_SIZE that the Entity traverses
// in a single frame
enum EntitySpeed {
  SLOW = 0.05,
  MED = 0.1,
  FAST = 0.15,
}

export abstract class Entity {
  currTile: Tile;
  destTile: Tile;
  t: number;
  tileOffsetX: number;
  tileOffsetY: number;
  isWalking: boolean;
  speed: EntitySpeed;
  angle: number;
  textureAtlas: HTMLImageElement;
  textureAtlasIdx: number;

  constructor() {
    this.tileOffsetX = 0;
    this.tileOffsetY = 0;
    this.currTile = null;
    this.destTile = null;
    this.t = 0;
    this.isWalking = false;
    this.speed = EntitySpeed.SLOW;
    this.angle = Math.PI / 2;
    this.textureAtlas = null;
    this.textureAtlasIdx = 0;

    const textureAtlasImage = new Image();
    textureAtlasImage.addEventListener('load', () =>
      this.textureAtlas = textureAtlasImage
    );
    textureAtlasImage.src = playerTextureAtlasPath;
  }

  update() {
    if (!this.currTile || !this.destTile)
      return;
    if (this.currTile != this.destTile) {
      this.t += this.speed;
      this.tileOffsetX = this.t * (this.destTile.x - this.currTile.x);
      this.tileOffsetY = this.t * (this.destTile.y - this.currTile.y);
      if (this.t >= 1) {
        this.t = 0;
        this.currTile.entity = null;
        this.currTile = this.destTile;
        this.destTile.entity = this;
        this.tileOffsetX = 0;
        this.tileOffsetY = 0;
        this.isWalking = false;
      }
    }
  }

  faceUp() {
    this.angle = -Math.PI/2;
    this.textureAtlasIdx = 5;
  }

  faceDown() {
    this.angle = Math.PI/2;
    this.textureAtlasIdx = 0;
  }

  faceLeft() {
    this.angle = Math.PI;
    this.textureAtlasIdx = 7;
  }

  faceRight() {
    this.angle = 0;
    this.textureAtlasIdx = 9;
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
