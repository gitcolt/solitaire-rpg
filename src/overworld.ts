import {Player} from './player';
import overworldImagePath from './assets/overworld.png';

export class Overworld {
  player: Player;
  backgroundTexture: HTMLImageElement;
  offsetX: number;
  offsetY: number;

  constructor(player: Player) {
    this.player = player;
    this.backgroundTexture = null;

    const overworldImage = new Image();
    overworldImage.addEventListener('load', () => {
      this.backgroundTexture = overworldImage;
    });
    overworldImage.src = overworldImagePath;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.backgroundTexture)
      return;

    this.offsetX = this.player.posX;
    this.offsetY = this.player.posY;

    const tileWidth = this.backgroundTexture.width / 22;
    const tileHeight = this.backgroundTexture.height / 25;

    ctx.drawImage(this.backgroundTexture,
                  this.offsetX,
                  this.offsetY,
                  tileWidth * 15,
                  tileHeight * 7,
                  0,
                  0,
                  ctx.canvas.width,
                  ctx.canvas.height);
    this.player.render(ctx);
  }
}
