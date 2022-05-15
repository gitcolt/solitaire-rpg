export class Overworld {
  backgroundTexture: HTMLImageElement;

  constructor() {
    this.backgroundTexture = null;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.backgroundTexture)
      return;
    ctx.drawImage(this.backgroundTexture,
                  0, 0,
                  ctx.canvas.width, ctx.canvas.height);
  }
}
