import {Player} from './player';
import overworldImagePath from './assets/overworld.png';

export class Overworld {
  player: Player;
  backgroundTexture: HTMLImageElement;

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
    ctx.drawImage(this.backgroundTexture,
                  0, 0,
                  ctx.canvas.width, ctx.canvas.height);
    this.player.render(ctx);
  }
}
