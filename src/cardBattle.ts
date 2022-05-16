import {Card, renderCard, DrawPile, PlayField, Slot} from './card';

export class CardBattle {
  playField: PlayField;
  drawPile: DrawPile;
  drawnCard: Card;
  drawPilePosX: number;
  drawPilePosY: number;
  playFieldPosX: number;
  playFieldPosY: number;

  constructor(playField: PlayField, drawPile: DrawPile) {
    this.playField = playField;
    this.drawPile = drawPile;
    this.drawnCard = null;
    this.drawPilePosX = 600;
    this.drawPilePosY = 400;
    this.playFieldPosX = 400;
    this.playFieldPosY = 100
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
    this.drawPile.render(ctx, this.drawPilePosX, this.drawPilePosY);
    this.playField.render(ctx, this.playFieldPosX, this.playFieldPosY);
    if (this.drawnCard)
      renderCard(ctx, this.drawnCard, this.drawPilePosX + 100, this.drawPilePosY);
  }
}
