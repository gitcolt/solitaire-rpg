const PLAYER_RADIUS = 10;

export class Player {
  posX: number;
  posY: number;
  xp: number;
  speed: number;

  constructor(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
    this.xp = 0;
    this.speed = 5;
  }

  moveUp() {
    this.posY -= this.speed;
  }

  moveDown() {
    this.posY += this.speed;
  }

  moveLeft() {
    this.posX -= this.speed;
  }

  moveRight() {
    this.posX += this.speed;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.arc(this.posX, this.posY, PLAYER_RADIUS, 0, 2*Math.PI);
    ctx.stroke();
  }
}
