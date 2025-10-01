import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Settings, RotateCcw } from "lucide-react";
import logo from "@/assets/logo.svg";
import { playSound } from "@/utils/sounds";
import { loadGameState } from "@/utils/localStorage";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  
  useEffect(() => {
    const savedState = loadGameState();
    setHasSavedGame(savedState !== null);
  }, []);

  const handleStartGame = () => {
    playSound('success', true);
    navigate("/setup");
  };

  const handleLoadGame = () => {
    const savedState = loadGameState();
    if (savedState) {
      playSound('success', true);
      navigate("/game", { 
        state: {
          players: savedState.players,
          deck: savedState.deck,
          currentIndex: savedState.currentIndex,
          currentPlayerIndex: savedState.currentPlayerIndex,
          cardAccepted: savedState.cardAccepted
        }
      });
    }
  };
  
  return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        <div className="slide-up max-w-lg w-full space-y-8 text-center relative z-10">
          
          {/* Logo/Title */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <img src={logo} alt="Schluck mal!" className="w-full max-w-md h-auto" />
            </div>
            
          </div>

          {/* Menu buttons */}
          <div className="space-y-4">
            {hasSavedGame && (
              <Button onClick={handleLoadGame} size="lg" className="w-full h-16 text-lg bg-accent hover:shadow-[var(--shadow-button)] transition-all duration-300 hover:scale-105">
                <RotateCcw className="w-6 h-6 mr-3" />
                Spiel laden
              </Button>
            )}
            
            <Button onClick={handleStartGame} size="lg" className="w-full h-16 text-lg bg-primary hover:shadow-[var(--shadow-button)] transition-all duration-300 hover:scale-105">
              <Play className="w-6 h-6 mr-3" />
              Spiel starten
            </Button>

            <Button onClick={() => navigate("/rules")} variant="outline" size="lg" className="w-full h-14 text-lg border-primary/50 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300">
              <BookOpen className="w-5 h-5 mr-3" />
              Regeln
            </Button>

            <Button onClick={() => navigate("/settings")} variant="outline" size="lg" className="w-full h-14 text-lg border-secondary/50 hover:bg-secondary/10 hover:border-secondary hover:text-primary transition-all duration-300">
              <Settings className="w-5 h-5 mr-3" />
              Einstellungen
            </Button>
          </div>

          {/* Footer */}
          
        </div>
      </div>
  );
};
export default Home;