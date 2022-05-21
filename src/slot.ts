import {Card, CARD_WIDTH, CARD_HEIGHT} from './card';
import {pointInBounds} from './utils';

export interface Slot {
  posX: number;
  posY: number;
  zIndex: number;
  card: Card;
}

export function slotClicked(slot: Slot, x: number, y: number) {
  return pointInBounds(x, y,
                       slot.posX, slot.posY,
                       slot.posX + CARD_WIDTH, slot.posY + CARD_HEIGHT);
}
