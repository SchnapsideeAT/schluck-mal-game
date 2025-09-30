import { CardCategory } from "@/types/card";
import { CategoryIcon } from "./CategoryIcon";
import { getCategoryCount } from "@/utils/cardUtils";
import { Check } from "lucide-react";

interface CategorySelectorProps {
  selectedCategories: CardCategory[];
  onCategoriesChange: (categories: CardCategory[]) => void;
}

const categories: CardCategory[] = ["Wahrheit", "Aufgabe", "Gruppe", "Duell", "Wildcard"];

const categoryColors: Record<CardCategory, string> = {
  Wahrheit: "text-category-truth",
  Aufgabe: "text-category-task",
  Gruppe: "text-category-group",
  Duell: "text-category-duel",
  Wildcard: "text-category-wildcard",
};

export const CategorySelector = ({ selectedCategories, onCategoriesChange }: CategorySelectorProps) => {
  const toggleCategory = (category: CardCategory) => {
    if (selectedCategories.includes(category)) {
      // Don't allow deselecting if it's the last one
      if (selectedCategories.length === 1) return;
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Wähle deine Kategorien:
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`flex flex-col items-center gap-2 bg-muted/30 hover:bg-muted/50 rounded-lg p-4 transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
            >
              <div className={`flex items-center justify-center h-5 w-5 shrink-0 rounded border-2 transition-colors ${
                isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50'
              }`}>
                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <CategoryIcon category={category} />
              <span className={`text-sm font-medium ${categoryColors[category]} text-center`}>
                {category}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        {selectedCategories.length} von {categories.length} Kategorien ausgewählt
      </p>
    </div>
  );
};
