import {CardBattle} from './cardBattle';
import {Overworld} from './overworld';
import {InputManager} from './input';
import {Player} from './player';

export enum GameMode {
  CARD_BATTLE,
  OVERWORLD,
}

export class GameManager {
  currMode: GameMode;
  input: InputManager;
  cardBattle: CardBattle;
  overworld: Overworld;

  constructor(input: InputManager, cardBattle: CardBattle, overworld: Overworld) {
    this.currMode = GameMode.OVERWORLD;
    this.input = input;
    this.cardBattle = cardBattle;
    this.overworld = overworld;
  }

  transitionToMode(mode: GameMode) {
    this.currMode = mode;
  }

  processInput() {
    this.input.processInput();
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.currMode == GameMode.OVERWORLD)
      this.overworld.render(ctx);
    else if (this.currMode == GameMode.CARD_BATTLE)
      this.cardBattle.render(ctx);
  }
}
