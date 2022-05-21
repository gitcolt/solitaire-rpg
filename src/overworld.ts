import {Player} from './player';
import overworldImagePath from './assets/overworld.png';
import {tileToScreenPos, lerp} from './utils';
import {Entity} from './entity';

export const SRC_TILE_SIZE = 1024/32;
export const TILE_SIZE = 1024/32 * 4;

export interface Tile {
  x: number,
  y: number,
  entity: Entity,
}

export class Overworld {
  player: Player;
  tileGrid: Tile[][];
  backgroundTexture: HTMLImageElement;
  offsetX: number;
  offsetY: number;
  gridImage: HTMLImageElement;
  gridPattern: CanvasPattern;
  onBattleInitiated: () => void;

  constructor(numGridRows: number, numGridCols: number) {
    this.tileGrid = [];
    for (let r = 0; r < numGridRows; ++r) {
      this.tileGrid.push([]);
      for (let c = 0; c < numGridCols; ++c) {
        this.tileGrid[r].push({
          x: c,
          y: r,
          entity: null,
        });
      }
    }
    this.backgroundTexture = null;
    this.gridPattern = null;

    const overworldImage = new Image();
    overworldImage.addEventListener('load', () => {
      this.backgroundTexture = overworldImage;
    });
    overworldImage.src = overworldImagePath;
  }

  addEntityAt(entity: Entity, tileX: number, tileY: number) {
    const tile = this.tileGrid[tileY][tileX];
    if (tile.entity)
      throw new Error('Trying to add an entity to an already occupied tile');
    tile.entity = entity;
    entity.currTile = tile;
  }

  addPlayerAt(player: Player, tileX: number, tileY: number) {
    this.addEntityAt(player, tileX, tileY);
    this.player = player;
  }

  moveEntityUp(entity: Entity) {
    if (entity.isWalking)
      return;
    const destTile = this.tileGrid[entity.currTile.y - 1][entity.currTile.x];
    if (destTile.entity) {
      this.onBattleInitiated();
      return;
    }
    entity.isWalking = true;
    entity.faceUp();
    entity.destTile = destTile;
  }

  moveEntityDown(entity: Entity) {
    if (entity.isWalking)
      return;
    const destTile = this.tileGrid[entity.currTile.y + 1][entity.currTile.x];
    if (destTile.entity) {
      this.onBattleInitiated();
      return;
    }
    entity.isWalking = true;
    entity.faceDown();
    entity.destTile = destTile;
  }

  moveEntityLeft(entity: Entity) {
    if (entity.isWalking)
      return;
    const destTile = this.tileGrid[entity.currTile.y][entity.currTile.x - 1];
    if (destTile.entity) {
      this.onBattleInitiated();
      return;
    }
    entity.isWalking = true;
    entity.faceLeft();
    entity.destTile = destTile;
  }

  moveEntityRight(entity: Entity) {
    if (entity.isWalking)
      return;
    const destTile = this.tileGrid[entity.currTile.y][entity.currTile.x + 1];
    if (destTile.entity) {
      this.onBattleInitiated();
      return;
    }
    entity.isWalking = true;
    entity.faceRight();
    entity.destTile = destTile;
  }

  update() {
    this.tileGrid.forEach(r => {
      r.forEach(tile => {
        if (!tile.entity)
          return;
        tile.entity.update();
      });
    });
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

    [this.offsetX, this.offsetY] = tileToScreenPos(this.player.currTile);
    this.offsetX += this.player.tileOffsetX * TILE_SIZE;
    this.offsetY += this.player.tileOffsetY * TILE_SIZE;

    const numHorizontalTiles = ctx.canvas.width/TILE_SIZE;
    const numVerticalTiles = ctx.canvas.height/TILE_SIZE;
    this.offsetX -= (numHorizontalTiles / 2) * TILE_SIZE;
    this.offsetY -= (numVerticalTiles / 2) * TILE_SIZE;
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

    this.tileGrid.forEach(r => {
      r.forEach(tile => {
        const entity = tile.entity;
        if (!entity)
          return;
        entity.render(ctx, this.offsetX, this.offsetY);
      });
    });

    if (window.debug) {
      // draw grid
      ctx.beginPath();
      ctx.translate(-this.offsetX - TILE_SIZE/2, -this.offsetY - TILE_SIZE/2);
      ctx.fillStyle = this.gridPattern;
      ctx.fillRect(this.offsetX, this.offsetY, ctx.canvas.width + TILE_SIZE/2, ctx.canvas.height + TILE_SIZE/2);
      ctx.translate(this.offsetX + TILE_SIZE/2, this.offsetY + TILE_SIZE/2);
    }
  }
}
