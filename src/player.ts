import playerTextureAtlasPath from './assets/player.png';
import {TILE_SIZE} from './overworld';

export class Player {
  posX: number;
  posY: number;
  xp: number;
  speed: number;
  angle: number;
  textureAtlas: HTMLImageElement;
  textureAtlasIdx: number;

  constructor(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
    this.xp = 0;
    this.speed = TILE_SIZE / 8;
    this.angle = 0;
    this.textureAtlas = null;
    this.textureAtlasIdx = 0;

    const textureAtlasImage = new Image();
    textureAtlasImage.addEventListener('load', () => {
      this.textureAtlas = textureAtlasImage;
    });
    textureAtlasImage.src = playerTextureAtlasPath;
  }

  moveUp() {
    this.posY -= this.speed;
    this.angle = -Math.PI/2;
    this.textureAtlasIdx = 5;
  }

  moveDown() {
    this.posY += this.speed;
    this.angle = Math.PI/2;
    this.textureAtlasIdx = 0;
  }

  moveLeft() {
    this.posX -= this.speed;
    this.angle = Math.PI;
    this.textureAtlasIdx = 7;
  }

  moveRight() {
    this.posX += this.speed;
    this.angle = 0;
    this.textureAtlasIdx = 9;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.textureAtlas)
      return;

    const screenPosX = (Math.round(((ctx.canvas.width/TILE_SIZE))) - 1) / 2 * TILE_SIZE + TILE_SIZE/2;
    const screenPosY = (Math.round(((ctx.canvas.height/TILE_SIZE))) - 1) / 2* TILE_SIZE + TILE_SIZE/2;

    if (window.debug) {
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'red';
      ctx.arc(screenPosX, screenPosY, 10, 0, 2*Math.PI);
      ctx.stroke();
      ctx.moveTo(screenPosX, screenPosY);
      ctx.lineTo(screenPosX + Math.cos(this.angle) * 20,
                 screenPosY + Math.sin(this.angle) * 20);
      ctx.stroke();
      return;
    }

    ctx.drawImage(this.textureAtlas,
                  this.textureAtlasIdx * this.textureAtlas.height,
                  0,
                  this.textureAtlas.height,
                  this.textureAtlas.height,
                  screenPosX - TILE_SIZE/2,
                  screenPosY - TILE_SIZE/2,
                  TILE_SIZE,
                  TILE_SIZE);
  }
}
