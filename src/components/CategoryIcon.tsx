import { CardCategory } from "@/types/card";
import { getCategoryIcon } from "@/utils/categoryIconMapper";

interface CategoryIconProps {
  category: CardCategory;
  className?: string;
}

const categoryColorMap: Record<CardCategory, string> = {
  Wahrheit: "#8B5CF6",
  Aufgabe: "#F59E0B", 
  Gruppe: "#10B981",
  Duell: "#EF4444",
  Wildcard: "#EC4899",
};

export const CategoryIcon = ({ category, className = "w-5 h-5" }: CategoryIconProps) => {
  const iconSrc = getCategoryIcon(category);
  const color = categoryColorMap[category];
  
  return (
    <div 
      className={className}
      style={{
        WebkitMask: `url(${iconSrc}) no-repeat center / contain`,
        mask: `url(${iconSrc}) no-repeat center / contain`,
        backgroundColor: color,
        filter: `drop-shadow(0 0 4px ${color}80)`
      }}
    />
  );
};
