import { useState } from "react";
import { Player } from "@/types/card";

interface PlayerTransitionProps {
  player: Player;
  categoryColor: string;
  onFadeOutComplete: () => void;
  bottomSwipeHandlers: any;
}

export const PlayerTransition = ({ 
  player, 
  categoryColor, 
  onFadeOutComplete,
  bottomSwipeHandlers 
}: PlayerTransitionProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleTap = () => {
    setFadeOut(true);
  };

  const handleAnimationEnd = () => {
    if (fadeOut) {
      onFadeOutComplete();
    }
  };

  return (
    <div 
      className={`fixed inset-0 ${categoryColor} z-50 flex items-center justify-center cursor-pointer ${
        fadeOut ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleTap}
      onTouchEnd={handleTap}
      onAnimationEnd={handleAnimationEnd}
      {...bottomSwipeHandlers}
    >
      <div className="text-center space-y-8 px-8">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 shadow-2xl animate-scale-in">
          <span className="text-7xl drop-shadow-2xl">{player.avatar}</span>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-5xl font-bold text-white drop-shadow-2xl">
            {player.name}
          </h2>
          <p className="text-2xl text-white/90 drop-shadow-lg font-medium">
            Du bist dran!
          </p>
        </div>
        
        <p className="text-white/70 text-lg drop-shadow-md">
          Tippe überall, um fortzufahren
        </p>
      </div>
    </div>
  );
};
