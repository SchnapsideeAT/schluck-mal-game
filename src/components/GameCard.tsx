import { Card } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";

interface GameCardProps {
  card: Card;
}

export const GameCard = ({ card }: GameCardProps) => {
  const cardImageSrc = getCardImage(card.category, card.id);

  return (
    <div className="card-flip w-full max-w-md mx-auto">
      <div className="relative rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 blur-xl -z-10" />
        
        {/* SVG Card Image */}
        <img 
          src={cardImageSrc} 
          alt={`${card.category} Card`}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};
