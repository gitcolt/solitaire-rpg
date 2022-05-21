import {CardBattle} from './cardBattle';
import {Overworld} from './overworld';
import {InputManager, Key} from './input';
import {pointInBounds} from './utils';
import {slotClicked} from './card';
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
    if (this.cardBattle.drawPile.topSlot.card) {
      if (slotClicked(this.cardBattle.drawPile.topSlot, x, y))
        this.cardBattle.onClickDrawPile();
    } else if (this.cardBattle.drawPile.bottomSlot.card) {
      if (slotClicked(this.cardBattle.drawPile.bottomSlot, x, y))
        this.cardBattle.onClickDrawPile();
    }
    if (this.cardBattle.playField.clicked(x, y)) {
      const slots = this.cardBattle.playField.slots;
      const topZIndexWithCard = slots.filter(s => s.card)
                                     .reduce((prev, curr) =>
                                             prev.zIndex > curr.zIndex ? prev : curr
      ).zIndex;
      const clickedSlot = slots.filter(s => s.zIndex == topZIndexWithCard)
                               .find(s => slotClicked(s, x, y));
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
