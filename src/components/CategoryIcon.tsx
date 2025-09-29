import { CardCategory } from "@/types/card";
import { getCategoryIcon } from "@/utils/categoryIconMapper";

interface CategoryIconProps {
  category: CardCategory;
  className?: string;
}

const categoryColorMap: Record<CardCategory, string> = {
  Wahrheit: "text-category-truth",
  Aufgabe: "text-category-task",
  Gruppe: "text-category-group",
  Duell: "text-category-duel",
  Wildcard: "text-category-wildcard",
};

export const CategoryIcon = ({ category, className = "w-5 h-5" }: CategoryIconProps) => {
  const iconSrc = getCategoryIcon(category);
  const colorClass = categoryColorMap[category];
  
  return (
    <img 
      src={iconSrc} 
      alt={category}
      className={`${className} ${colorClass}`}
      style={{
        filter: `drop-shadow(0 0 2px hsl(var(--${categoryColorMap[category].replace('text-', '')})))`
      }}
    />
  );
};
