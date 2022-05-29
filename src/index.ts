import {Player} from './player';
import {Overworld} from './overworld';
import {DrawPile} from './drawPile';
import {PlayField} from './playField';
import {CardBattle} from './cardBattle';
import {GameManager} from './game';
import {InputManager, Key} from './input';
import {NPC} from './npc';
import Stats from 'stats.js';

import './styles.less';

declare global {
  interface Window { debug: boolean; }
}
window.debug = false;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

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

const input = new InputManager();

const player = new Player();

const overworld = new Overworld(32, 32);
overworld.createGrid(ctx);
overworld.addPlayerAt(player, 14, 13);
const npc = new NPC();
overworld.addEntityAt(npc, 10, 11);

input.keyToCommand.set(Key.UP, () => overworld.moveEntityUp(player));
input.keyToCommand.set(Key.DOWN, () => overworld.moveEntityDown(player));
input.keyToCommand.set(Key.LEFT, () => overworld.moveEntityLeft(player));
input.keyToCommand.set(Key.RIGHT, () => overworld.moveEntityRight(player));

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
  stats.begin();
  ctx.clearRect(0, 0, can.width, can.height);

  game.update();
  game.render(ctx);

  ++frameCount;
  stats.end();
  requestAnimationFrame(loop);
})();
