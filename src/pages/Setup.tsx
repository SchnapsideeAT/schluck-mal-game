import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";

const Setup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="slide-up max-w-lg w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/50 mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Spielvorbereitung
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Versammelt eure Gruppe und macht euch bereit für eine unvergessliche Party!
          </p>
        </div>

        {/* Info card */}
        <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-4 text-left">
          <h3 className="text-xl font-semibold text-primary">Bevor es losgeht:</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Stellt sicher, dass alle Mitspieler volljährig sind</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Bereitet eure Getränke vor</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Setzt euch in einen Kreis oder um einen Tisch</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Legt fest, wer anfängt (z.B. jüngster Spieler)</span>
            </li>
          </ul>
        </div>

        {/* Categories preview */}
        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Kartenkategorien im Spiel:</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <CategoryIcon category="Wahrheit" />
              <span className="text-sm font-medium text-category-truth">Wahrheit</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <CategoryIcon category="Aufgabe" />
              <span className="text-sm font-medium text-category-task">Aufgabe</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <CategoryIcon category="Gruppe" />
              <span className="text-sm font-medium text-category-group">Gruppe</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <CategoryIcon category="Duell" />
              <span className="text-sm font-medium text-category-duel">Duell</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <CategoryIcon category="Wildcard" />
              <span className="text-sm font-medium text-category-wildcard">Wildcard</span>
            </div>
          </div>
        </div>

        {/* Player info - informational only */}
        <div className="bg-muted/50 border border-border/30 rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-2">Empfohlene Spieleranzahl</p>
          <p className="text-3xl font-bold text-primary">3 - 10 Spieler</p>
        </div>

        {/* Start button */}
        <Button
          onClick={() => navigate("/game")}
          size="lg"
          className="w-full h-16 text-lg bg-primary hover:shadow-[var(--shadow-button)] transition-all duration-300 hover:scale-105"
        >
          Los geht's!
          <ArrowRight className="w-6 h-6 ml-3" />
        </Button>

        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="w-full hover:bg-muted/50"
        >
          Zurück
        </Button>
      </div>
    </div>
  );
};

export default Setup;
