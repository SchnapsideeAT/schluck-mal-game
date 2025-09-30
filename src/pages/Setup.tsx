import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { PlayerSetup } from "@/components/PlayerSetup";
import { Tutorial } from "@/components/Tutorial";
import { Player } from "@/types/card";
import { playSound } from "@/utils/sounds";

const Setup = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Tutorial Component */}
      <Tutorial />
      
      <div className="slide-up max-w-lg w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/50 mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Spielvorbereitung
          </h1>
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

        {/* Player Setup Component */}
        <PlayerSetup players={players} onPlayersChange={setPlayers} />

        {/* Start button */}
        <Button
          onClick={() => {
            if (players.length === 0) {
              playSound('error', true);
              return;
            }
            playSound('success', true);
            navigate("/game", { state: { players } });
          }}
          size="lg"
          className="w-full h-16 text-lg bg-primary hover:shadow-[var(--shadow-button)] transition-all duration-300 hover:scale-105"
        >
          Los geht's!
          <ArrowRight className="w-6 h-6 ml-3" />
        </Button>

        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="w-full hover:bg-muted/50 hover:text-primary"
        >
          Zurück
        </Button>
      </div>
    </div>
  );
};

export default Setup;
