import {pointInBounds} from './utils';

export enum Suit {
  HEARTS,
  SPADES,
  CLUBS,
  DIAMONDS,
}

function suitToString(suit: Suit): string {
  switch (suit) {
    case Suit.HEARTS:
      return '\u2665';
    case Suit.DIAMONDS:
      return '\u2666';
    case Suit.SPADES:
      return '\u2660';
    case Suit.CLUBS:
      return '\u2663';
  }
}

function valToString(val: number): string {
  switch (val) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return val.toString();
  }
}

export interface Card {
  suit: Suit;
  val: number;
  isFaceUp: boolean;
}

export const CARD_WIDTH = 50;
export const CARD_HEIGHT = 90;

export function renderCard(ctx: CanvasRenderingContext2D,
                           card: Card,
                           posX: number,
                           posY: number) {
  ctx.beginPath();
  if (card.isFaceUp) {
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillRect(posX, posY, CARD_WIDTH, CARD_HEIGHT);
    switch (card.suit) {
      case Suit.HEARTS:
      case Suit.DIAMONDS:
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        break;
      case Suit.CLUBS:
      case Suit.SPADES:
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        break;
    }
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(valToString(card.val), posX + 10, posY + 20);
    ctx.fillText(suitToString(card.suit), posX + 15, posY + 45);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(posX, posY, CARD_WIDTH, CARD_HEIGHT);
  } else {
    ctx.fillStyle = 'blue';
    ctx.fillRect(posX, posY, CARD_WIDTH, CARD_HEIGHT);
    ctx.lineWidth = 1;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX + CARD_WIDTH, posY + CARD_HEIGHT);
    ctx.moveTo(posX + CARD_WIDTH, posY);
    ctx.lineTo(posX, posY + CARD_HEIGHT);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(posX, posY, CARD_WIDTH, CARD_HEIGHT);
  }
}

export function shuffle(cards: Card[]) {
  let currIdx = cards.length;
  while (currIdx != 0) {
    const randIdx = Math.floor(Math.random() * currIdx--);
    [cards[currIdx], cards[randIdx]] = [cards[randIdx], cards[currIdx]];
  }
}

export function createDeck(): Card[] {
  const cards = [];
  for (let i = 0; i < 4; ++i) {
    let suit;
    if (i == 0)
      suit = Suit.HEARTS;
    else if (i == 1)
      suit = Suit.CLUBS;
    else if (i == 2)
      suit = Suit.DIAMONDS;
    else
      suit = Suit.SPADES;
    for (let val = 1; val <= 13; ++val) {
      cards.push({
        suit,
        val,
        isFaceUp: false,
      });
    }
  }
  return cards;
}

export class DrawPile {
  cards: Card[];

  constructor() {
    this.cards = createDeck();
    shuffle(this.cards);
  }

  drawCard(): Card {
    return this.cards.shift() || null;
  }

  render(ctx: CanvasRenderingContext2D, posX: number, posY: number) {
    if (this.cards.length > 1)
      renderCard(ctx, this.cards[1], posX, posY);
    if (this.cards.length > 0) {
      [posX, posY] = this.cards.length == 1 ? [posX, posY] : [posX + 10, posY - 10];
      renderCard(ctx, this.cards[0], posX, posY);
    }
  }
}

export interface Slot {
  posX: number;
  posY: number;
  zIndex: number;
  card: Card;
}

export function slotClicked(x: number, y: number, slot: Slot) {
  return pointInBounds(x, y,
                       slot.posX, slot.posY,
                       slot.posX + CARD_WIDTH, slot.posY + CARD_HEIGHT);
}

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
