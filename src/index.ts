import {Player} from './player';
import {Overworld} from './overworld';
import {DrawPile, PlayField} from './card';
import {CardBattle} from './cardBattle';
import {GameManager} from './game';
import {InputManager, Key} from './input';

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

const player = new Player(200, 80);

input.keyToCommand.set(Key.UP, () => player.moveUp());
input.keyToCommand.set(Key.DOWN, () => player.moveDown());
input.keyToCommand.set(Key.LEFT, () => player.moveLeft());
input.keyToCommand.set(Key.RIGHT, () => player.moveRight());

const overworld = new Overworld(player);

const drawPile = new DrawPile();

const playField = new PlayField(400, 200);
playField.addSlotGroup(15, 15);
playField.addSlotToSlotGroup(playField.slotGroups[0], 0, 0);
playField.addSlotToSlotGroup(playField.slotGroups[0], 5, 5);
playField.addSlotToSlotGroup(playField.slotGroups[0], 10, 10);
playField.addSlotGroup(115, 15);
playField.addSlotToSlotGroup(playField.slotGroups[1], 0, 0);
playField.addSlotToSlotGroup(playField.slotGroups[1], 5, 5);
playField.addSlotToSlotGroup(playField.slotGroups[1], 10, 10);
playField.addSlotToSlotGroup(playField.slotGroups[1], 15, 15);
playField.addSlotGroup(215, 15);
playField.addSlotToSlotGroup(playField.slotGroups[2], 0, 0);
playField.addSlotToSlotGroup(playField.slotGroups[2], 5, 5);
playField.addSlotToSlotGroup(playField.slotGroups[2], 10, 10);
playField.addSlotToSlotGroup(playField.slotGroups[2], 15, 15);
playField.addSlotGroup(315, 15);
playField.addSlotToSlotGroup(playField.slotGroups[3], 0, 0);
playField.addSlotToSlotGroup(playField.slotGroups[3], 5, 5);
playField.addSlotToSlotGroup(playField.slotGroups[3], 10, 10);
playField.populate();

const cardBattle = new CardBattle(playField, drawPile);

const game = new GameManager(input, cardBattle, overworld);

let frameCount = 0;
(function loop() {
  ctx.clearRect(0, 0, can.width, can.height);

  game.update();
  game.render(ctx);

  ++frameCount;
  requestAnimationFrame(loop);
})();
