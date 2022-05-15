import {Player} from './player';
import {Overworld} from './overworld';
import {DrawPile, PlayField, CARD_WIDTH, CARD_HEIGHT} from './card';
import {CardGame} from './cardGame';
import {pointInBounds, dist} from './utils';
import {GameManager, GameMode} from './gameManager';
import {InputManager, Key} from './input';
import playerTextureAtlasPath from './assets/player.png';
import overworldImagePath from './assets/overworld.png';
import {BattleTransitionAnimation} from './transitionAnimation';

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

  if (gameManager.currMode == GameMode.OVERWORLD)
    onKeyDownOverworldMode(e);
});

window.addEventListener('keyup', (e: KeyboardEvent) => {
  if (gameManager.currMode == GameMode.OVERWORLD)
    onKeyUpOverworldMode(e);
});

window.addEventListener('click', (e: MouseEvent) => {
  if (gameManager.currMode == GameMode.CARD_BATTLE)
    onClickCardBattleMode(e);
});

function onKeyDownOverworldMode(e: KeyboardEvent) {
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      inputManager.keyStates.set(Key.UP, true);
      break;
    case 'a':
    case 'ArrowLeft':
      inputManager.keyStates.set(Key.LEFT, true);
      break;
    case 's':
    case 'ArrowDown':
      inputManager.keyStates.set(Key.DOWN, true);
      break;
    case 'd':
    case 'ArrowRight':
      inputManager.keyStates.set(Key.RIGHT, true);
      break;
  }
}

function onKeyUpOverworldMode(e: KeyboardEvent) {
  switch (e.key) {
    case 'w': case 'ArrowUp':
      inputManager.keyStates.set(Key.UP, false);
      break;
    case 'a':
    case 'ArrowLeft':
      inputManager.keyStates.set(Key.LEFT, false);
      break;
    case 's':
    case 'ArrowDown':
      inputManager.keyStates.set(Key.DOWN, false);
      break;
    case 'd':
    case 'ArrowRight':
      inputManager.keyStates.set(Key.RIGHT, false);
      break;
  }
}

function onClickCardBattleMode(e: MouseEvent) {
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
}

const inputManager = new InputManager();
const gameManager = new GameManager();

const player = new Player(200, 80);
const playerTextureAtlas = new Image();
playerTextureAtlas.addEventListener('load', () => {
  player.textureAtlas = playerTextureAtlas;
});
playerTextureAtlas.src = playerTextureAtlasPath;

const overworld = new Overworld();
const overworldImage = new Image();
overworldImage.addEventListener('load', () => {
  overworld.backgroundTexture = overworldImage;
});
overworldImage.src = overworldImagePath;


const drawPile = new DrawPile();

const playField = new PlayField(400, 200);
playField.addSlot( 15, 15);
playField.addSlot(115, 15);
playField.addSlot(215, 15);
playField.addSlot(315, 15);
playField.populate();

const cardGame = new CardGame(playField, drawPile);

inputManager.keyToCommand.set(Key.UP, () => player.moveUp());
inputManager.keyToCommand.set(Key.DOWN, () => player.moveDown());
inputManager.keyToCommand.set(Key.LEFT, () => player.moveLeft());
inputManager.keyToCommand.set(Key.RIGHT, () => player.moveRight());

const transition = new BattleTransitionAnimation(50, () => {gameManager.transitionToMode(GameMode.CARD_BATTLE)});

let frameCount = 0;
(function loop() {
  if (!transition.isPlaying) {
    inputManager.processInput();
  }

  ctx.clearRect(0, 0, can.width, can.height);

  if (gameManager.currMode == GameMode.OVERWORLD) {
    overworld.render(ctx);
    player.render(ctx);
    if (transition.isPlaying) {
      transition.tick();
      transition.render(ctx);
    } else if (dist(player.posX, player.posY, 4 * can.width/10, 9 * can.height / 20) < 80)
      transition.start();
  } else if (gameManager.currMode == GameMode.CARD_BATTLE) {
    cardGame.render(ctx);
  }

  ++frameCount;
  requestAnimationFrame(loop);
})();
