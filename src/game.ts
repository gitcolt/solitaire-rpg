import {CardBattle} from './cardBattle';
import {Overworld} from './overworld';
import {InputManager, Key} from './input';
import {pointInBounds} from './utils';
import {CARD_WIDTH, CARD_HEIGHT} from './card';
import {Animation, BattleTransitionAnimation} from './anim';

export enum GameMode {
  CARD_BATTLE,
  OVERWORLD,
}

export class GameManager {
  currMode: GameMode;
  input: InputManager;
  cardBattle: CardBattle;
  overworld: Overworld;
  transitionAnimation: Animation;

  constructor(input: InputManager, cardBattle: CardBattle, overworld: Overworld) {
    this.currMode = GameMode.OVERWORLD;
    this.input = input;
    this.cardBattle = cardBattle;
    this.overworld = overworld;
    this.transitionAnimation = null;
  }

  transitionToMode(mode: GameMode) {
    this.transitionAnimation = new BattleTransitionAnimation(50, () => {
      this.transitionAnimation = null;
      this.currMode = mode;
    });
    this.transitionAnimation.start();
  }

  update() {
    if (this.transitionAnimation)
      return;
    if (this.currMode == GameMode.OVERWORLD) {
      this.overworld.update();
      if (pointInBounds(this.overworld.player.posX,
                        this.overworld.player.posY,
                        110,
                        50,
                        140,
                        80))
        this.transitionToMode(GameMode.CARD_BATTLE);
    }
    this.input.processInput();
  }

  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        this.input.keyStates.set(Key.UP, true);
        break;
      case 'a':
      case 'ArrowLeft':
        this.input.keyStates.set(Key.LEFT, true);
        break;
      case 's':
      case 'ArrowDown':
        this.input.keyStates.set(Key.DOWN, true);
        break;
      case 'd':
      case 'ArrowRight':
        this.input.keyStates.set(Key.RIGHT, true);
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        this.input.keyStates.set(Key.UP, false);
        break;
      case 'a':
      case 'ArrowLeft':
        this.input.keyStates.set(Key.LEFT, false);
        break;
      case 's':
      case 'ArrowDown':
        this.input.keyStates.set(Key.DOWN, false);
        break;
      case 'd':
      case 'ArrowRight':
        this.input.keyStates.set(Key.RIGHT, false);
        break;
    }
  }

  onClick(e: MouseEvent) {
    const [x, y] = [e.clientX, e.clientY];
    if (pointInBounds(x, y,
                      this.cardBattle.drawPilePosX,
                      this.cardBattle.drawPilePosY,
                      this.cardBattle.drawPilePosX + CARD_WIDTH,
                      this.cardBattle.drawPilePosY + CARD_HEIGHT)) {
      this.cardBattle.onClickDrawPile();
    } 
    else if (pointInBounds(x, y,
                           this.cardBattle.playFieldPosX,
                           this.cardBattle.playFieldPosY,
                           this.cardBattle.playFieldPosX + this.cardBattle.playField.width,
                           this.cardBattle.playFieldPosY + this.cardBattle.playField.height)) {
      const clickedSlot = this.cardBattle.playField.slotGroups.map(sg => {
                                                            const slotsWithCards = sg.slots.filter(s => s.card);
                                                            return slotsWithCards.length ? slotsWithCards[slotsWithCards.length - 1] :
                                                                                           null;
                                                     }).filter(s => s != null)
                                                       .find(s => pointInBounds(
                                                         x, y,
                                                         this.cardBattle.playFieldPosX + s.offsetX,
                                                         this.cardBattle.playFieldPosY + s.offsetY,
                                                         this.cardBattle.playFieldPosX + s.offsetX + CARD_WIDTH,
                                                         this.cardBattle.playFieldPosY + s.offsetY + CARD_HEIGHT));
      if (clickedSlot)
        this.cardBattle.onClickSlot(clickedSlot);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.currMode == GameMode.OVERWORLD)
      this.overworld.render(ctx);
    else if (this.currMode == GameMode.CARD_BATTLE)
      this.cardBattle.render(ctx);

    if (this.transitionAnimation) {
      this.transitionAnimation.render(ctx);
      this.transitionAnimation.tick();
    }
  }
}
