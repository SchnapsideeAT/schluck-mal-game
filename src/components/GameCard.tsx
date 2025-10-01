import { memo } from "react";
import { Card, CardCategory } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";

interface GameCardProps {
  card: Card;
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
  const cardImageSrc = getCardImage(card.category, card.id);
  const categoryColor = categoryColorMap[card.category];

  // Check if card is exiting
  const isExiting = (card as any).exiting;
  const exitDirection = isExiting;

  // Calculate rotation and opacity based on swipe
  const rotation = swipeDistance * 0.1;
  const opacity = swipeDistance !== 0 ? Math.max(0.5, 1 - Math.abs(swipeDistance) / 300) : 1;

  // Exit animation transform
  const exitTransform = isExiting 
    ? `translateX(${exitDirection === 'left' ? '-150vw' : '150vw'}) rotate(${exitDirection === 'left' ? '-30deg' : '30deg'})`
    : `translateX(${swipeDistance}px) rotate(${rotation}deg)`;

  return (
    <div 
      className={`card-flip w-full relative touch-none flex items-center justify-center ${!isExiting ? 'animate-enter' : ''}`}
      style={{
        transform: isExiting 
          ? exitTransform 
          : swipeDistance !== 0 
            ? `translateX(${swipeDistance}px) rotate(${rotation}deg)`
            : 'scale(0.8)',
        opacity: isExiting ? 0 : (swipeDistance !== 0 ? opacity : 0),
        transition: isExiting ? 'transform 0.5s ease-in, opacity 0.5s ease-in' : 'none',
        cursor: 'grab',
        willChange: isExiting || swipeDistance !== 0 ? 'transform, opacity' : 'auto'
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
          alt={`${card.category} Card ${card.id}`}
          className="w-full h-auto object-contain rounded-2xl block select-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            if (e.pointerType === 'touch') {
              e.preventDefault();
            }
          }}
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
          onError={(e) => {
            console.error(`Failed to load ${card.category} card ${card.id}:`, cardImageSrc);
            console.error('Image element:', e.currentTarget);
          }}
        />
      </div>
    </div>
  );
});
