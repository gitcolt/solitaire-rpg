import {Slot} from './slot';
import {Card, shuffle, createDeck, CARD_WIDTH, CARD_HEIGHT, renderCard} from './card';
import {pointInBounds} from './utils';

export class PlayField {
  posX: number;
  posY: number;
  width: number;
  height: number;
  slots: Slot[];

  constructor(posX: number, posY: number, width: number, height: number) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.slots = [];
  }

  populate() {
    const deck = createDeck();
    shuffle(deck);

    let zIndex = 0;
    while (this.slots.some(s => s.zIndex == zIndex)) {
      this.slots.filter(s => s.zIndex == zIndex)
                .forEach(s => {
                  s.card = deck.shift();
                  s.card.isFaceUp = true;
                });
      ++zIndex;
    }
  }

  addSlotAt(posX: number, posY: number, zIndex: number) {
    this.slots.push({
      posX,
      posY,
      card: null,
      zIndex,
    });
  }

  playCardOnSlot(slot: Slot, playerCard: Card): Card {
    if (!slot.card)
      return null;
    const slotCard = slot.card;
    let retCard = null;
    if (slotCard.val == (playerCard.val + 1)        ||
        slotCard.val == (playerCard.val - 1)        ||
        slotCard.val ==  1 && playerCard.val  == 13 ||
        slotCard.val == 13 && playerCard.val  ==  1) {
      retCard = slot.card;
      slot.card = null;
    }
    const win = this.checkForWin();
    if (win)
      alert('WIN!');
    return retCard;
  }

  checkForWin(): boolean {
    return !this.slots.some(s => s.card);
  }

  clicked(x: number, y: number) {
    return pointInBounds(x, y,
                         this.posX, this.posY,
                         this.posX + this.width, this.posY + this.height);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (window.debug) {
      const slotMargin = 10;
      this.slots.forEach(s => {
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeRect(s.posX - slotMargin,
                       s.posY - slotMargin,
                       CARD_WIDTH + slotMargin * 2,
                       CARD_HEIGHT + slotMargin * 2);
      });
    }

    this.slots.forEach(s => {
      if (!s.card)
        return;
      renderCard(ctx, s.card, s.posX, s.posY);
    });

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.posX, this.posY, this.width, this.height);
  }
}
