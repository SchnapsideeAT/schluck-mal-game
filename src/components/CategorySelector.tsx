import { CardCategory } from "@/types/card";
import { CategoryIcon } from "./CategoryIcon";
import { Checkbox } from "./ui/checkbox";
import { getCategoryCount } from "@/utils/cardUtils";

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
      <div className="space-y-3">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const cardCount = getCategoryCount(category);
          
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`w-full flex items-center gap-3 bg-muted/30 hover:bg-muted/50 rounded-lg px-4 py-3 transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
            >
              <Checkbox 
                checked={isSelected}
                onCheckedChange={() => toggleCategory(category)}
                className="pointer-events-none"
              />
              <CategoryIcon category={category} />
              <span className={`text-sm font-medium ${categoryColors[category]} flex-1 text-left`}>
                {category}
              </span>
              <span className="text-xs text-muted-foreground">
                {cardCount} Karten
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
