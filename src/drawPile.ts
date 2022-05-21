import {Card, shuffle, createDeck, renderCard} from './card';
import {Slot} from './slot';

export class DrawPile {
  cards: Card[];
  posX: number;
  posY: number;
  topSlot: Slot;
  bottomSlot: Slot;

  constructor(posX: number, posY: number) {
    const cards = createDeck();
    shuffle(cards);
    this.cards = cards;
    this.posX = posX;
    this.posY = posY;
    this.topSlot = {
      posX: this.posX + 15,
      posY: this.posY - 15,
      card: this.cards[this.cards.length - 1],
      zIndex: 1,
    };
    this.bottomSlot = {
      posX: this.posX,
      posY: this.posY,
      card: this.cards[this.cards.length - 2],
      zIndex: 0,
    };
  }

  drawCard(): Card {
    const drawnCard = this.cards.shift() || null;
    if (this.cards.length >= 2) {
      this.topSlot.card = this.cards[this.cards.length - 1];
      this.bottomSlot.card = this.cards[this.cards.length - 2];
    } else if (this.cards.length == 1) {
      this.topSlot.card = null;
      this.bottomSlot.card = this.cards[this.cards.length - 1];
    } else {
      this.topSlot.card = null;
      this.bottomSlot.card = null;
    }
    return drawnCard;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.bottomSlot.card)
      renderCard(ctx, this.bottomSlot.card, this.bottomSlot.posX, this.bottomSlot.posY);
    if (this.topSlot.card)
      renderCard(ctx, this.topSlot.card, this.topSlot.posX, this.topSlot.posY);
  }
}
