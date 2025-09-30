import { memo } from "react";
import cardBackImage from "@/assets/cards/Rückseite.svg";

interface CardBackProps {
  showGlow?: boolean;
}

export const CardBack = memo(({ showGlow = false }: CardBackProps) => {
  return (
    <div 
      className="w-full relative flex items-center justify-center"
    >
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
              boxShadow: `0 0 15px 2px hsl(var(--primary) / 0.2), 0 0 30px 5px hsl(var(--primary) / 0.1)`,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              zIndex: -1
            }}
          />
        )}
        
        {/* Card Back SVG */}
        <img 
          src={cardBackImage} 
          alt="Card Back"
          className="w-full h-auto object-contain rounded-2xl block"
          draggable={false}
        />
      </div>
    </div>
  );
});

CardBack.displayName = "CardBack";
