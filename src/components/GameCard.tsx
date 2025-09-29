import { Card } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";
import { getCategoryIcon } from "@/utils/categoryIconMapper";

interface GameCardProps {
  card: Card;
}

export const GameCard = ({ card }: GameCardProps) => {
  const cardImageSrc = getCardImage(card.category, card.id);
  const categoryIconSrc = getCategoryIcon(card.category);

  return (
    <div className="card-flip w-full max-w-md mx-auto space-y-4">
      {/* Category Icon Badge */}
      <div className="flex items-center justify-center gap-3 animate-fade-in">
        <div className="bg-card border border-border/50 rounded-xl px-4 py-2 flex items-center gap-2">
          <img 
            src={categoryIconSrc} 
            alt={card.category}
            className="w-6 h-6"
          />
          <span className="text-lg font-semibold text-foreground">{card.category}</span>
        </div>
      </div>
      
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
