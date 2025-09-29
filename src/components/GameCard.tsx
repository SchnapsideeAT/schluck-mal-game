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
      {/* Category-colored glow effect - multiple layers for stronger effect */}
      <div 
        className="absolute inset-0 blur-3xl opacity-80"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(${categoryColor} / 0.8), hsl(${categoryColor} / 0.4) 50%, transparent 70%)`,
          transform: 'scale(1.2)',
        }}
      />
      <div 
        className="absolute inset-0 blur-2xl opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(${categoryColor} / 0.6), transparent 60%)`,
          transform: 'scale(1.1)',
        }}
      />
      
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          boxShadow: `0 0 80px hsl(${categoryColor} / 0.6), 0 0 120px hsl(${categoryColor} / 0.4), 0 0 160px hsl(${categoryColor} / 0.2)`
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
