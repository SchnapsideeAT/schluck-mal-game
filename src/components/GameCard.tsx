import { Card } from "@/types/card";
import { Beer, Users, Swords, Sparkles, MessageCircle, Zap } from "lucide-react";

interface GameCardProps {
  card: Card;
}

const categoryConfig = {
  Wahrheit: {
    icon: MessageCircle,
    color: "category-truth",
    label: "Wahrheit"
  },
  Aufgabe: {
    icon: Zap,
    color: "category-task",
    label: "Aufgabe"
  },
  Gruppe: {
    icon: Users,
    color: "category-group",
    label: "Gruppe"
  },
  Duell: {
    icon: Swords,
    color: "category-duel",
    label: "Duell"
  },
  Wildcard: {
    icon: Sparkles,
    color: "category-wildcard",
    label: "Wildcard"
  }
};

export const GameCard = ({ card }: GameCardProps) => {
  const config = categoryConfig[card.category];
  const Icon = config.icon;

  return (
    <div className="card-flip w-full max-w-md mx-auto">
      <div className="relative bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] border border-border/50 backdrop-blur-sm">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 blur-xl -z-10" />
        
        {/* Category badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${config.color}/20 border border-${config.color}/50 mb-6`}>
          <Icon className={`w-5 h-5 text-${config.color}`} />
          <span className={`text-sm font-semibold text-${config.color}`}>
            {config.label}
          </span>
        </div>

        {/* Card text */}
        <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-8">
          {card.text}
        </p>

        {/* Drinks indicator */}
        {card.drinks > 0 && (
          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/30">
            <Beer className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-primary">
              {card.drinks} Schluck{card.drinks !== 1 ? "e" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
