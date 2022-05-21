import playerTextureAtlasPath from './assets/player.png';
import {Tile, TILE_SIZE} from './overworld';

export abstract class Entity {
  currTile: Tile;
  destTile: Tile;
  t: number;
  tileOffsetX: number;
  tileOffsetY: number;
  isWalking: boolean;
  speed: number;
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
    this.speed = TILE_SIZE / 8;
    this.angle = 0;
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
      this.t += 0.04;
      this.tileOffsetX = this.t * (this.destTile.x - this.currTile.x);
      this.tileOffsetY = this.t * (this.destTile.y - this.currTile.y);
      if (this.t >= 1) {
        this.t = 0;
        this.currTile = this.destTile;
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


  abstract render(ctx: CanvasRenderingContext2D,
                  screenOffsetX: number, screenOffsetY: number): void
}
