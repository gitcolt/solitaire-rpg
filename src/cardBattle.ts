import {Card, renderCard} from './card';
import {PlayField} from './playField';
import {DrawPile} from './drawPile';
import {Slot} from './slot';

export class CardBattle {
  playField: PlayField;
  drawPile: DrawPile;
  drawnCard: Card;

  constructor(playField: PlayField, drawPile: DrawPile) {
    this.playField = playField;
    this.drawPile = drawPile;
    this.drawnCard = null;
    this.drawCard();
  }

  drawCard() {
    this.drawnCard = this.drawPile.drawCard();
    if (this.drawnCard)
      this.drawnCard.isFaceUp = true;
  }

  onClickDrawPile() {
    this.drawCard();
  }

  onClickSlot(slot: Slot) {
    if (!this.drawnCard)
      return;

    const retCard = this.playField.playCardOnSlot(slot, this.drawnCard);
    if (retCard)
      this.drawnCard = retCard;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.drawPile.render(ctx);
    this.playField.render(ctx);
    if (this.drawnCard)
      renderCard(ctx, this.drawnCard, this.drawPile.posX + 100, this.drawPile.posY);
  }
}
