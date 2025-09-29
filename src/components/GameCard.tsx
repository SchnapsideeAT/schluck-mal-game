import { Card, CardCategory } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";

interface GameCardProps {
  card: Card;
  swipeDistance?: number;
  swipeDirection?: 'left' | 'right' | null;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

const categoryColorMap: Record<CardCategory, string> = {
  Wahrheit: "199 91% 42%",
  Aufgabe: "265 27% 57%", 
  Gruppe: "101 55% 44%",
  Duell: "38 91% 59%",
  Wildcard: "352 78% 58%",
};

export const GameCard = ({ 
  card, 
  swipeDistance = 0, 
  swipeDirection,
  onTouchStart,
  onTouchMove,
  onTouchEnd 
}: GameCardProps) => {
  const cardImageSrc = getCardImage(card.category, card.id);
  const categoryColor = categoryColorMap[card.category];

  // Calculate rotation and opacity based on swipe
  const rotation = swipeDistance * 0.1; // Rotate based on swipe distance
  const opacity = Math.max(0.5, 1 - Math.abs(swipeDistance) / 300);

  return (
    <div 
      className="card-flip w-full mx-auto relative touch-none max-h-[70vh]"
      style={{
        transform: `translateX(${swipeDistance}px) rotate(${rotation}deg)`,
        opacity,
        transition: swipeDistance === 0 ? 'transform 0.3s ease, opacity 0.3s ease' : 'none',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      
      {/* Swipe Direction Indicators */}
      {swipeDirection === 'left' && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 animate-pulse">
          <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
            ← TRINKEN
          </div>
        </div>
      )}
      
      {swipeDirection === 'right' && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 animate-pulse">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
            ERLEDIGT →
          </div>
        </div>
      )}
      
      <div className="relative inline-block">
        {/* SVG Card Image */}
        <img 
          src={cardImageSrc} 
          alt={`${card.category} Card`}
          className="w-full h-auto max-h-[70vh] object-contain relative z-10 rounded-2xl"
          style={{
            filter: `drop-shadow(0 0 25px hsl(${categoryColor} / 0.6)) drop-shadow(0 0 50px hsl(${categoryColor} / 0.4))`,
            animation: 'pulseGlow 2.5s ease-in-out infinite'
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};
