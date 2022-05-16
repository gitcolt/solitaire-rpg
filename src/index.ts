import {Player} from './player';
import {Overworld} from './overworld';
import {DrawPile, PlayField, CARD_WIDTH, CARD_HEIGHT, Slot, SlotGroup} from './card';
import {CardBattle} from './cardBattle';
import {pointInBounds} from './utils';
import {GameManager, GameMode} from './game';
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

  if (game.currMode == GameMode.OVERWORLD)
    onKeyDownOverworldMode(e);
});

window.addEventListener('keyup', (e: KeyboardEvent) => {
  if (game.currMode == GameMode.OVERWORLD)
    onKeyUpOverworldMode(e);
});

window.addEventListener('click', (e: MouseEvent) => {
  if (game.currMode == GameMode.CARD_BATTLE)
    onClickCardBattleMode(e);
});

function onKeyDownOverworldMode(e: KeyboardEvent) {
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      input.keyStates.set(Key.UP, true);
      break;
    case 'a':
    case 'ArrowLeft':
      input.keyStates.set(Key.LEFT, true);
      break;
    case 's':
    case 'ArrowDown':
      input.keyStates.set(Key.DOWN, true);
      break;
    case 'd':
    case 'ArrowRight':
      input.keyStates.set(Key.RIGHT, true);
      break;
  }
}

function onKeyUpOverworldMode(e: KeyboardEvent) {
  switch (e.key) {
    case 'w': case 'ArrowUp':
      input.keyStates.set(Key.UP, false);
      break;
    case 'a':
    case 'ArrowLeft':
      input.keyStates.set(Key.LEFT, false);
      break;
    case 's':
    case 'ArrowDown':
      input.keyStates.set(Key.DOWN, false);
      break;
    case 'd':
    case 'ArrowRight':
      input.keyStates.set(Key.RIGHT, false);
      break;
  }
}

function onClickCardBattleMode(e: MouseEvent) {
  const [x, y] = [e.clientX, e.clientY];
  if (pointInBounds(x, y,
                    cardBattle.drawPilePosX,
                    cardBattle.drawPilePosY,
                    cardBattle.drawPilePosX + CARD_WIDTH,
                    cardBattle.drawPilePosY + CARD_HEIGHT)) {
    cardBattle.onClickDrawPile();
  } 
  else if (pointInBounds(x, y,
                         cardBattle.playFieldPosX,
                         cardBattle.playFieldPosY,
                         cardBattle.playFieldPosX + cardBattle.playField.width,
                         cardBattle.playFieldPosY + cardBattle.playField.height)) {
    const clickedSlot = cardBattle.playField.slotGroups.map(sg => {
                                                          const slotsWithCards = sg.slots.filter(s => s.card);
                                                          return slotsWithCards.length ? slotsWithCards[slotsWithCards.length - 1] :
                                                                                         null;
                                                   }).filter(s => s != null)
                                                     .find(s => pointInBounds(
                                                       x, y,
                                                       cardBattle.playFieldPosX + s.offsetX,
                                                       cardBattle.playFieldPosY + s.offsetY,
                                                       cardBattle.playFieldPosX + s.offsetX + CARD_WIDTH,
                                                       cardBattle.playFieldPosY + s.offsetY + CARD_HEIGHT));
    if (clickedSlot)
      cardBattle.onClickSlot(clickedSlot);
  }
}

const input = new InputManager();

const player = new Player(200, 80);

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

input.keyToCommand.set(Key.UP, () => player.moveUp());
input.keyToCommand.set(Key.DOWN, () => player.moveDown());
input.keyToCommand.set(Key.LEFT, () => player.moveLeft());
input.keyToCommand.set(Key.RIGHT, () => player.moveRight());

const game = new GameManager(input, cardBattle, overworld);

let frameCount = 0;
(function loop() {
  ctx.clearRect(0, 0, can.width, can.height);

  game.processInput();
  game.render(ctx);

  ++frameCount;
  requestAnimationFrame(loop);
})();
