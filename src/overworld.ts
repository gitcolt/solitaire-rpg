import {Player} from './player';
import overworldImagePath from './assets/checker_32x32.png';

export const SRC_TILE_SIZE = 1024/32;
export const TILE_SIZE = 1024/32 * 4;

interface Tile {
  x: number,
  y: number,
}

export class Overworld {
  player: Player;
  backgroundTexture: HTMLImageElement;
  offsetX: number;
  offsetY: number;
  isWalking: boolean;
  walkTargetTile: Tile;
  gridImage: HTMLImageElement;
  gridPattern: CanvasPattern;

  constructor(player: Player) {
    this.player = player;
    this.backgroundTexture = null;
    this.isWalking = false;
    this.walkTargetTile = null;
    this.gridPattern = null;

    const overworldImage = new Image();
    overworldImage.addEventListener('load', () => {
      this.backgroundTexture = overworldImage;
    });
    overworldImage.src = overworldImagePath;
  }

  update() {
    if (this.isWalking) {
      if (this.player.posY > this.walkTargetTile.y)
        this.player.moveUp();
      else if (this.player.posY < this.walkTargetTile.y)
        this.player.moveDown();
      else if (this.player.posX < this.walkTargetTile.x)
        this.player.moveRight();
      else if (this.player.posX > this.walkTargetTile.x)
        this.player.moveLeft();
      else
        this.isWalking = false;
    }
  }

  moveUp() {
    if (!this.isWalking) {
      this.walkTargetTile = {
        x: this.player.posX,
        y: this.player.posY - TILE_SIZE,
      };
      this.isWalking = true;
    }
  }

  moveDown() {
    if (!this.isWalking) {
      this.walkTargetTile = {
        x: this.player.posX,
        y: this.player.posY + TILE_SIZE,
      };
      this.isWalking = true;
    }
  }

  moveLeft() {
    if (!this.isWalking) {
      this.walkTargetTile = {
        x: this.player.posX - TILE_SIZE,
        y: this.player.posY,
      };
      this.isWalking = true;
    }
  }

  moveRight() {
    if (!this.isWalking) {
      this.walkTargetTile = {
        x: this.player.posX + TILE_SIZE,
        y: this.player.posY,
      };
      this.isWalking = true;
    }
  }

  createGrid(ctx: CanvasRenderingContext2D) {
    const patternCan = document.createElement('canvas');
    patternCan.width = TILE_SIZE;
    patternCan.height = TILE_SIZE;
    const patternCtx = patternCan.getContext('2d');
    patternCtx.strokeStyle = 'black';
    patternCtx.lineWidth = 3;
    patternCtx.moveTo(TILE_SIZE/2, 0);
    patternCtx.lineTo(TILE_SIZE/2, TILE_SIZE);
    patternCtx.moveTo(0, TILE_SIZE/2);
    patternCtx.lineTo(TILE_SIZE, TILE_SIZE/2);
    patternCtx.stroke();
    this.gridPattern = ctx.createPattern(patternCan, 'repeat');

  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.backgroundTexture)
      return;

    this.offsetX = this.player.posX;
    this.offsetY = this.player.posY;

    const numHorizontalTiles = ctx.canvas.width/TILE_SIZE;
    const numVerticalTiles = ctx.canvas.height/TILE_SIZE;
    this.backgroundTexture.offsetWidth
    ctx.drawImage(this.backgroundTexture,
                  this.offsetX / TILE_SIZE * SRC_TILE_SIZE,
                  this.offsetY / TILE_SIZE * SRC_TILE_SIZE,
                  SRC_TILE_SIZE * numHorizontalTiles,
                  SRC_TILE_SIZE * numVerticalTiles,
                  0,
                  0,
                  ctx.canvas.width,
                  ctx.canvas.height);

    this.player.render(ctx);

    if (window.debug) {
      // draw grid
      ctx.beginPath();
      ctx.translate(-(this.offsetX - TILE_SIZE/2), -(this.offsetY - TILE_SIZE/2));
      ctx.fillStyle = this.gridPattern;
      ctx.fillRect(this.offsetX, this.offsetY, ctx.canvas.width, ctx.canvas.height);
      ctx.translate(this.offsetX - TILE_SIZE/2, this.offsetY - TILE_SIZE/2);
    }
  }
}
