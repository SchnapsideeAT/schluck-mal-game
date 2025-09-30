import { CardCategory } from "@/types/card";
import { getCategoryIcon } from "@/utils/categoryIconMapper";

interface CategoryIconProps {
  category: CardCategory;
  className?: string;
}

const categoryColorMap: Record<CardCategory, string> = {
  Wahrheit: "hsl(199, 91%, 42%)",
  Aufgabe: "hsl(265, 27%, 57%)", 
  Gruppe: "hsl(101, 55%, 44%)",
  Duell: "hsl(38, 91%, 59%)",
  Wildcard: "hsl(352, 78%, 58%)",
};

export const CategoryIcon = ({ category, className = "w-5 h-5" }: CategoryIconProps) => {
  const iconSrc = getCategoryIcon(category);
  const color = categoryColorMap[category];
  
  return (
    <img 
      src={iconSrc} 
      alt={`${category} Icon`}
      className={className}
      style={{
        filter: `drop-shadow(0 0 6px ${color})`
      }}
    />
  );
};
