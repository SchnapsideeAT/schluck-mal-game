import { memo } from "react";
import cardBackSvg from "@/assets/card-back.svg";

export const CardBack = memo(() => {
  return (
    <div className="w-full h-full flex items-center justify-center opacity-60">
      <div className="card-scale-container relative">
        <img 
          src={cardBackSvg} 
          alt="Card Back"
          className="w-full h-auto object-contain rounded-2xl block"
          draggable={false}
        />
      </div>
    </div>
  );
});
