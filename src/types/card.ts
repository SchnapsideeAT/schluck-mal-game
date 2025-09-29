export type CardCategory = "Wahrheit" | "Aufgabe" | "Gruppe" | "Duell" | "Wildcard";

export interface Card {
  id: number;
  category: CardCategory;
  text: string;
  drinks: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  totalDrinks: number;
}

export interface GameState {
  isPlaying: boolean;
  currentCardIndex: number;
  deck: Card[];
  players: Player[];
}
