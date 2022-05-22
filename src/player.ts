import {Entity} from './entity';

export class Player extends Entity {
  xp: number;

  constructor() {
    super();
    this.xp = 0;
  }
}
