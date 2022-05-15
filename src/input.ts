export enum Key {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export class InputManager {
  keyStates: Map<Key, boolean>;
  keyToCommand: Map<Key, () => void>;

  constructor() {
    this.keyStates = new Map<Key, boolean>();
    this.keyToCommand = new Map<Key, () => void>();
  }

  processInput() {
    for (let [k, v] of this.keyStates) {
      if (v) {
        const command = this.keyToCommand.get(k);
        command();
      }
    }
  }
}
