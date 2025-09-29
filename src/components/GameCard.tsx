import { Card, CardCategory } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";

interface GameCardProps {
  card: Card;
}

const categoryColorMap: Record<CardCategory, string> = {
  Wahrheit: "199 91% 42%",
  Aufgabe: "265 27% 57%", 
  Gruppe: "101 55% 44%",
  Duell: "38 91% 59%",
  Wildcard: "352 78% 58%",
};

export const GameCard = ({ card }: GameCardProps) => {
  const cardImageSrc = getCardImage(card.category, card.id);
  const categoryColor = categoryColorMap[card.category];

  return (
    <div className="card-flip w-full max-w-md mx-auto relative">
      {/* Subtle category-colored glow effect */}
      <div 
        className="absolute inset-0 blur-3xl opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(${categoryColor} / 0.4), transparent 70%)`,
          transform: 'scale(1.15)',
        }}
      />
      
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          boxShadow: `0 0 40px hsl(${categoryColor} / 0.25), 0 0 60px hsl(${categoryColor} / 0.15)`
        }}
      >
        {/* SVG Card Image */}
        <img 
          src={cardImageSrc} 
          alt={`${card.category} Card`}
          className="w-full h-auto relative z-10"
        />
      </div>
    </div>
  );
};
