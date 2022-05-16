export abstract class Animation {
  duration: number;
  currTick: number;
  isPlaying: boolean;
  callback: () => void;

  constructor(duration: number, callback: () => void = null) {
    this.duration = duration;
    this.currTick = 0;
    this.callback = callback;
    this.isPlaying = false;
  }

  start() {
    this.isPlaying = true;
    this.currTick = 0;
  }

  tick() {
    if (this.currTick++ >= this.duration) {
      this.isPlaying = false;
      if (this.callback)
        this.callback();
    }
  }

  abstract render(ctx: CanvasRenderingContext2D): void;
}

export class BattleTransitionAnimation extends Animation {
  constructor(duration: number, callback: () => void = null) {
    super(duration, callback);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.isPlaying)
      return;

    if (this.currTick % 5 == 0) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } 
  }
}
