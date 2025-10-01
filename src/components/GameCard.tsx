import { memo, useState, useEffect } from "react";
import { Card, CardCategory } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useFeatureFlags } from "@/utils/featureFlags";

/**
 * GameCard Component
 * 
 * Optimized card display with:
 * - GPU-accelerated animations (transform, opacity)
 * - Feature flag support for low-end devices
 * - Lazy-loaded card images
 * - Swipe gesture feedback
 * - Responsive scaling
 * 
 * Performance optimizations:
 * - Uses `memo` to prevent unnecessary re-renders
 * - `will-change` for GPU acceleration
 * - RAF-throttled swipe updates via parent
 * - Cached window size via custom hook
 */

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
  const { width } = useWindowSize();
  const { flags } = useFeatureFlags();
  
  // Override showGlow based on feature flags
  const shouldShowGlow = showGlow && flags.enableGlowEffects;
  const shouldAnimateComplex = flags.enableComplexAnimations;
  
  // Animation state: 'entering' | 'visible'
  const [animationState, setAnimationState] = useState<'entering' | 'visible'>('entering');
  
  // Handle card changes with animation - depends on card.id AND parent's showCard prop
  useEffect(() => {
    // Only start animation when card should be visible
    if (!showGlow) return; // Using showGlow as proxy for visibility
    
    setAnimationState('entering');
    
    const timer = setTimeout(() => {
      setAnimationState('visible');
    }, 600); // Match CSS animation duration
    
    return () => clearTimeout(timer);
  }, [card.id, showGlow]);

  // Calculate rotation and opacity based on swipe
  const rotation = swipeDistance * 0.1;
  const opacity = swipeDistance !== 0 ? Math.max(0.5, 1 - Math.abs(swipeDistance) / 300) : 1;

  return (
    <div 
      className={`w-full relative touch-none flex items-center justify-center ${
        shouldAnimateComplex && animationState === 'entering' ? 'animate-enter' : ''
      }`}
      style={{
        transform: swipeDistance !== 0 
          ? `translateX(${swipeDistance}px) rotate(${rotation}deg)`
          : undefined,
        opacity: swipeDistance !== 0 ? opacity : undefined,
        transition: 'none',
        cursor: 'grab',
        willChange: swipeDistance !== 0 ? 'transform, opacity' : 'auto'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      
      {/* Left Screen Edge Glow (Red) - when swiping left - GPU optimized with blur */}
      {shouldShowGlow && swipeDirection === 'left' && (
        <div 
          className="fixed left-0 top-0 bottom-0 pointer-events-none z-50 rounded-r-3xl overflow-hidden"
          style={{
            width: '120px',
            background: 'linear-gradient(to right, rgba(239, 68, 68, 0.6), transparent)',
            filter: 'blur(8px)',
            transform: 'translateZ(0)',
          }}
        />
      )}
      
      {/* Right Screen Edge Glow (Green) - when swiping right - GPU optimized with blur */}
      {shouldShowGlow && swipeDirection === 'right' && (
        <div 
          className="fixed right-0 top-0 bottom-0 pointer-events-none z-50 rounded-l-3xl overflow-hidden"
          style={{
            width: '120px',
            background: 'linear-gradient(to left, rgba(34, 197, 94, 0.6), transparent)',
            filter: 'blur(8px)',
            transform: 'translateZ(0)',
          }}
        />
      )}
      
      {/* Card Container with optimized scale */}
      <div 
        className="relative inline-block"
        style={{ 
          transform: width < 768 ? 'scale(1.6) translateZ(0)' : 'scale(1) translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Glow Effect Background - GPU optimized with opacity */}
        {shouldShowGlow && (
          <div 
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              background: `radial-gradient(circle at center, hsl(${categoryColor} / 0.4), transparent 70%)`,
              animation: shouldAnimateComplex ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
              zIndex: -1,
              transform: 'translateZ(0)',
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
