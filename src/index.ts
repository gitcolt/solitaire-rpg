import {Player} from './player';
import {Overworld} from './overworld';
import {DrawPile} from './drawPile';
import {PlayField} from './playField';
import {CardBattle} from './cardBattle';
import {GameManager} from './game';
import {InputManager, Key} from './input';

import * as dat from 'dat.gui';

import './styles.less';

declare global {
  interface Window { debug: boolean; gui: dat.GUI}
}
window.debug = false;

window.gui = new dat.GUI();

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
  game.onKeyDown(e);
});

window.addEventListener('keyup', (e: KeyboardEvent) => {
  game.onKeyUp(e);
});

window.addEventListener('click', (e: MouseEvent) => {
  game.onClick(e);
});

function onClickCardBattleMode(e: MouseEvent) {
}

const input = new InputManager();

const player = new Player(0, 0);
window.gui.add(player, 'posX');
window.gui.add(player, 'posY');

const overworld = new Overworld(player);
overworld.createGrid(ctx);

input.keyToCommand.set(Key.UP, () => overworld.moveUp());
input.keyToCommand.set(Key.DOWN, () => overworld.moveDown());
input.keyToCommand.set(Key.LEFT, () => overworld.moveLeft());
input.keyToCommand.set(Key.RIGHT, () => overworld.moveRight());

const drawPile = new DrawPile(600, 400);

const playField = new PlayField(400, 100, 400, 200);
playField.addSlotAt(playField.posX + 15,  playField.posY + 15, 0);
playField.addSlotAt(playField.posX + 115, playField.posY + 15, 0);
playField.addSlotAt(playField.posX + 40,  playField.posY + 15, 1);
playField.addSlotAt(playField.posX + 140, playField.posY + 15, 1);
playField.populate();

const cardBattle = new CardBattle(playField, drawPile);

const game = new GameManager(input, cardBattle, overworld);

let frameCount = 0;
(function loop() {
  ctx.clearRect(0, 0, can.width, can.height);

  game.update();
  game.render(ctx);

  window.gui.updateDisplay();

  ++frameCount;
  requestAnimationFrame(loop);
})();
