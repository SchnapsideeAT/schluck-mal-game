import { Card } from "@/types/card";
import { Beer, Users, Swords, Sparkles, MessageCircle, Zap } from "lucide-react";

// Import SVG designs
import Aufgabe01 from "@/assets/cards/Aufgabe-01.svg";
import Aufgabe02 from "@/assets/cards/Aufgabe-02.svg";
import Aufgabe03 from "@/assets/cards/Aufgabe-03.svg";
import Aufgabe04 from "@/assets/cards/Aufgabe-04.svg";
import Aufgabe05 from "@/assets/cards/Aufgabe-05.svg";
import Aufgabe06 from "@/assets/cards/Aufgabe-06.svg";
import Aufgabe07 from "@/assets/cards/Aufgabe-07.svg";
import Aufgabe08 from "@/assets/cards/Aufgabe-08.svg";
import Aufgabe09 from "@/assets/cards/Aufgabe-09.svg";
import Aufgabe10 from "@/assets/cards/Aufgabe-10.svg";
import Aufgabe11 from "@/assets/cards/Aufgabe-11.svg";
import Aufgabe12 from "@/assets/cards/Aufgabe-12.svg";
import Aufgabe13 from "@/assets/cards/Aufgabe-13.svg";
import Aufgabe14 from "@/assets/cards/Aufgabe-14.svg";
import Aufgabe15 from "@/assets/cards/Aufgabe-15.svg";
import Aufgabe16 from "@/assets/cards/Aufgabe-16.svg";
import Aufgabe17 from "@/assets/cards/Aufgabe-17.svg";
import Aufgabe18 from "@/assets/cards/Aufgabe-18.svg";
import Aufgabe19 from "@/assets/cards/Aufgabe-19.svg";
import Aufgabe20 from "@/assets/cards/Aufgabe-20.svg";
import Aufgabe21 from "@/assets/cards/Aufgabe-21.svg";
import Aufgabe22 from "@/assets/cards/Aufgabe-22.svg";
import Aufgabe23 from "@/assets/cards/Aufgabe-23.svg";
import Aufgabe24 from "@/assets/cards/Aufgabe-24.svg";
import Duell01 from "@/assets/cards/Duell-01.svg";
import Duell02 from "@/assets/cards/Duell-02.svg";
import Duell03 from "@/assets/cards/Duell-03.svg";
import Duell04 from "@/assets/cards/Duell-04.svg";
import Duell05 from "@/assets/cards/Duell-05.svg";
import Duell06 from "@/assets/cards/Duell-06.svg";

interface GameCardProps {
  card: Card;
}

// Mapping für Kartendesigns (temporär basierend auf ID)
const cardDesigns: Record<number, string> = {
  1: Aufgabe01,
  2: Aufgabe02,
  3: Aufgabe03,
  4: Aufgabe04,
  5: Aufgabe05,
  6: Aufgabe06,
  7: Duell01,
  8: Duell02,
  9: Aufgabe07,
  10: Aufgabe08,
  11: Aufgabe09,
  12: Aufgabe10,
};

const categoryConfig = {
  Wahrheit: {
    icon: MessageCircle,
    color: "category-truth",
    label: "Wahrheit"
  },
  Aufgabe: {
    icon: Zap,
    color: "category-task",
    label: "Aufgabe"
  },
  Gruppe: {
    icon: Users,
    color: "category-group",
    label: "Gruppe"
  },
  Duell: {
    icon: Swords,
    color: "category-duel",
    label: "Duell"
  },
  Wildcard: {
    icon: Sparkles,
    color: "category-wildcard",
    label: "Wildcard"
  }
};

export const GameCard = ({ card }: GameCardProps) => {
  const config = categoryConfig[card.category];
  const Icon = config.icon;
  const cardDesign = cardDesigns[card.id];

  return (
    <div className="card-flip w-full max-w-md mx-auto">
      <div className="relative w-full aspect-[167.24/260.79] max-h-[600px]">
        {/* SVG Design als Hintergrund */}
        {cardDesign && (
          <img 
            src={cardDesign} 
            alt={`Karte ${card.id}`}
            className="absolute inset-0 w-full h-full object-contain rounded-2xl"
          />
        )}
        
        {/* Text-Overlay (zentriert auf der Karte) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-lg md:text-xl font-medium text-white leading-relaxed drop-shadow-lg">
            {card.text}
          </p>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 blur-xl -z-10" />
      </div>
    </div>
  );
};
