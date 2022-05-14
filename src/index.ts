import {DrawPile, PlayField, CARD_WIDTH, CARD_HEIGHT} from './card';
import {CardGame} from './cardGame';
import {pointInBounds} from './utils';

import './styles.less';

declare global {
  interface Window { debug: boolean; }
}
window.debug = false;

const can: HTMLCanvasElement = document.querySelector('canvas');
const ctx = can.getContext('2d');

window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

function resizeCanvas() {
  can.width = window.innerWidth;
  can.height = window.innerHeight;
}

window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key == 'q')
    window.debug = !window.debug;
});

window.addEventListener('click', (e: MouseEvent) => {
  const [x, y] = [e.clientX, e.clientY];
  if (pointInBounds(x, y,
                    cardGame.drawPilePosX,
                    cardGame.drawPilePosY,
                    cardGame.drawPilePosX + CARD_WIDTH,
                    cardGame.drawPilePosY + CARD_HEIGHT)) {
    cardGame.onClickDrawPile();
  } 
  else if (pointInBounds(x, y,
                         cardGame.playFieldPosX,
                         cardGame.playFieldPosY,
                         cardGame.playFieldPosX + cardGame.playField.width,
                         cardGame.playFieldPosY + cardGame.playField.height)) {
    const clickedSlot = cardGame.playField.slots.find(s => pointInBounds(x, y,
                                      cardGame.playFieldPosX + s.offsetX,
                                      cardGame.playFieldPosY + s.offsetY,
                                      cardGame.playFieldPosX + s.offsetX + CARD_WIDTH,
                                      cardGame.playFieldPosY + s.offsetY + CARD_HEIGHT));
    if (clickedSlot)
      cardGame.onClickSlot(clickedSlot);
  }
});

const drawPile = new DrawPile();

const playField = new PlayField(400, 200);
playField.addSlot( 15, 15);
playField.addSlot(115, 15);
playField.addSlot(215, 15);
playField.addSlot(315, 15);
playField.populate();

const cardGame = new CardGame(playField, drawPile);

let frameCount = 0;
(function loop() {
  ctx.clearRect(0, 0, can.width, can.height);

  cardGame.render(ctx);

  ++frameCount;
  requestAnimationFrame(loop);
})();
