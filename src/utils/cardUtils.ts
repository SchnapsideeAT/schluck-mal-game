import { Card } from "@/types/card";
import cardsData from "@/data/cards.json";

export const shuffleDeck = (): Card[] => {
  const deck = [...cardsData] as Card[];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const loadCards = (): Card[] => {
  return cardsData as Card[];
};
