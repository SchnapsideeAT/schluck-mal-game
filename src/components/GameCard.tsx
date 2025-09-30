import { Card, CardCategory } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";

interface GameCardProps {
  card: Card;
  swipeDistance?: number;
  swipeDirection?: 'left' | 'right' | null;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  showGlow?: boolean;
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
  onTouchEnd,
  showGlow = true
}: GameCardProps) => {
  const cardImageSrc = getCardImage(card.category, card.id);
  const categoryColor = categoryColorMap[card.category];

  // Check if card is exiting
  const isExiting = (card as any).exiting;
  const exitDirection = isExiting;

  // Calculate rotation and opacity based on swipe
  const rotation = swipeDistance * 0.1;
  const opacity = Math.max(0.5, 1 - Math.abs(swipeDistance) / 300);

  // Exit animation transform
  const exitTransform = isExiting 
    ? `translateX(${exitDirection === 'left' ? '-150vw' : '150vw'}) rotate(${exitDirection === 'left' ? '-30deg' : '30deg'})`
    : `translateX(${swipeDistance}px) rotate(${rotation}deg)`;

  return (
    <div 
      className={`card-flip w-full relative touch-none max-h-[85vh] sm:max-h-[75vh] md:max-h-[80vh] flex items-center justify-center ${!isExiting ? 'animate-enter' : ''}`}
      style={{
        transform: exitTransform,
        opacity: isExiting ? 0 : opacity,
        transition: isExiting ? 'transform 0.5s ease-in, opacity 0.5s ease-in' : 'none',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      
      {/* Left Side Glow (Red - Drink) */}
      {swipeDirection === 'left' && !isExiting && (
        <div 
          className="fixed left-0 top-0 bottom-0 w-8 pointer-events-none z-50"
          style={{
            background: 'linear-gradient(to right, rgba(239, 68, 68, 0.8), transparent)',
            boxShadow: '0 0 40px 20px rgba(239, 68, 68, 0.6)',
            animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      )}
      
      {/* Right Side Glow (Green - Complete) */}
      {swipeDirection === 'right' && !isExiting && (
        <div 
          className="fixed right-0 top-0 bottom-0 w-8 pointer-events-none z-50"
          style={{
            background: 'linear-gradient(to left, rgba(34, 197, 94, 0.8), transparent)',
            boxShadow: '0 0 40px 20px rgba(34, 197, 94, 0.6)',
            animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      )}
      
      {/* Card Container with Glow */}
      <div className="relative inline-block" style={{ transform: 'scale(1.5)' }}>
        {/* Glow Effect Background */}
        {showGlow && (
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: `0 0 30px 5px hsl(${categoryColor} / 0.25), 0 0 60px 12px hsl(${categoryColor} / 0.12)`,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              zIndex: -1
            }}
          />
        )}
        
        {/* SVG Card Image */}
        <img 
          src={cardImageSrc} 
          alt={`${card.category} Card ${card.id}`}
          className="w-full h-auto max-h-[85vh] sm:max-h-[75vh] md:max-h-[80vh] object-contain rounded-2xl block"
          draggable={false}
          onError={(e) => {
            console.error(`Failed to load ${card.category} card ${card.id}:`, cardImageSrc);
            console.error('Image element:', e.currentTarget);
          }}
        />
      </div>
    </div>
  );
};
