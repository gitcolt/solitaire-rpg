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
