import { memo } from "react";
import { Card, CardCategory } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";

interface GameCardProps {
  card?: Card;
  isCardBack?: boolean;
  swipeDistance?: number;
  swipeDirection?: 'left' | 'right' | 'up' | null;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?: () => void;
  showGlow?: boolean;
}

const categoryColorMap: Record<CardCategory, string> = {
  Wahrheit: "199 91% 42%",
  Aufgabe: "265 27% 57%", 
  Gruppe: "101 55% 44%",
  Duell: "38 91% 59%",
  Wildcard: "352 78% 58%",
};

export const GameCard = memo(({ 
  card, 
  isCardBack = false,
  swipeDistance = 0, 
  swipeDirection,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  showGlow = true
}: GameCardProps) => {
  const cardImageSrc = isCardBack 
    ? new URL('../assets/cards/card-back.svg', import.meta.url).href
    : card ? getCardImage(card.category, card.id) : '';
  const categoryColor = card ? categoryColorMap[card.category] : "0 0% 50%";

  // Check if card is exiting
  const isExiting = card ? (card as any).exiting : false;
  const exitDirection = isExiting;

  // Calculate rotation and opacity based on swipe
  const rotation = swipeDistance * 0.1;
  const opacity = Math.max(0.5, 1 - Math.abs(swipeDistance) / 300);

  // Exit animation transform
  const exitTransform = isExiting 
    ? `translateX(${exitDirection === 'left' ? '-150vw' : '150vw'}) rotate(${exitDirection === 'left' ? '-30deg' : '30deg'})`
    : `translateX(${swipeDistance}px) rotate(${rotation}deg)`;
  
  // Determine if card should animate
  const shouldAnimate = !isExiting && !isCardBack;

  return (
    <div 
      className={`w-full relative touch-none flex items-center justify-center ${shouldAnimate ? 'animate-enter' : ''}`}
      style={{
        transform: exitTransform,
        opacity: isExiting ? 0 : opacity,
        transition: isExiting ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : swipeDistance !== 0 ? 'none' : 'transform 0.2s ease-out',
        cursor: isCardBack ? 'default' : 'grab',
        willChange: (isExiting || swipeDistance !== 0) ? 'transform, opacity' : 'auto'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      
      {/* Left Screen Edge Glow (Red) - when swiping left */}
      {swipeDirection === 'left' && !isExiting && (
        <div 
          className="fixed left-0 top-0 bottom-0 w-1 pointer-events-none z-50"
          style={{
            backgroundColor: 'rgb(239, 68, 68)',
            boxShadow: '0 0 80px 40px rgba(239, 68, 68, 0.8), 0 0 120px 60px rgba(239, 68, 68, 0.5)',
          }}
        />
      )}
      
      {/* Right Screen Edge Glow (Green) - when swiping right */}
      {swipeDirection === 'right' && !isExiting && (
        <div 
          className="fixed right-0 top-0 bottom-0 w-1 pointer-events-none z-50"
          style={{
            backgroundColor: 'rgb(34, 197, 94)',
            boxShadow: '0 0 80px 40px rgba(34, 197, 94, 0.8), 0 0 120px 60px rgba(34, 197, 94, 0.5)',
          }}
        />
      )}
      
      {/* Card Container with Glow */}
      <div 
        className="relative inline-block"
        style={{ 
          transform: window.innerWidth < 768 ? 'scale(1.6)' : 'scale(1)' 
        }}
      >
        {/* Glow Effect Background */}
        {showGlow && (
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: `0 0 15px 2px hsl(${categoryColor} / 0.2), 0 0 30px 5px hsl(${categoryColor} / 0.1)`,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              zIndex: -1
            }}
          />
        )}
        
        {/* SVG Card Image */}
        <img 
          src={cardImageSrc} 
          alt={isCardBack ? 'Card Back' : card ? `${card.category} Card ${card.id}` : 'Card'}
          className="w-full h-auto object-contain rounded-2xl block"
          draggable={false}
          onError={(e) => {
            if (!isCardBack && card) {
              console.error(`Failed to load ${card.category} card ${card.id}:`, cardImageSrc);
              console.error('Image element:', e.currentTarget);
            }
          }}
        />
      </div>
    </div>
  );
});
