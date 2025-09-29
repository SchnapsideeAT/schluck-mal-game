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
      className="card-flip w-full relative touch-none max-h-[70vh] flex items-center justify-center"
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
      
      {/* Glow Effect Background */}
      <div 
        className="absolute inset-0 rounded-2xl -z-10"
        style={{
          boxShadow: `0 0 30px 5px hsl(${categoryColor} / 0.6), 0 0 60px 15px hsl(${categoryColor} / 0.3)`,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      
      {/* SVG Card Image */}
      <img 
        src={cardImageSrc} 
        alt={`${card.category} Card`}
        className="w-full h-auto max-h-[70vh] object-contain relative z-10 rounded-2xl"
        draggable={false}
      />
    </div>
  );
};
