export enum GameMode {
  CARD_BATTLE,
  OVERWORLD,
}

export class GameManager {
  currMode: GameMode;

  constructor() {
    this.currMode = GameMode.OVERWORLD;
  }

  transitionToMode(mode: GameMode) {
    // TODO: play transition animation
    this.currMode = mode;
  }
}
