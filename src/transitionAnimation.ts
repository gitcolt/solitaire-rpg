abstract class TransitionAnimation {
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

export class BattleTransitionAnimation extends TransitionAnimation {
  constructor(duration: number, callback: () => void = null) {
    super(duration, callback);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.currTick % 5 == 0) {
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } 
  }
}
