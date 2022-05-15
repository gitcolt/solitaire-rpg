export enum GameMode {
  CARD_BATTLE,
  OVERWORLD,
}

export class GameManager {
  currMode: GameMode;

  constructor() {
    this.currMode = GameMode.CARD_BATTLE;
  }

  transitionToMode(mode: GameMode) {
    // TODO: play transition animation
    this.currMode = mode;
  }
}
