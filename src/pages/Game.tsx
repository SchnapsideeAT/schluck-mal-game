import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { shuffleDeck } from "@/utils/cardUtils";
import { Card, Player } from "@/types/card";
import { ArrowRight, Beer, Check, Home, RotateCcw, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useSwipe } from "@/hooks/useSwipe";

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    players?: Player[];
    deck?: Card[];
    currentIndex?: number;
    currentPlayerIndex?: number;
    showCard?: boolean;
    cardAccepted?: boolean;
  } | null;
  
  const [deck, setDeck] = useState<Card[]>(state?.deck || []);
  const [currentIndex, setCurrentIndex] = useState(state?.currentIndex ?? -1);
  const [showCard, setShowCard] = useState(state?.showCard ?? false);
  const [cardAccepted, setCardAccepted] = useState(state?.cardAccepted ?? false);
  const [players, setPlayers] = useState<Player[]>(state?.players || []);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(state?.currentPlayerIndex ?? 0);

  useEffect(() => {
    // Only initialize if no existing state
    if (!state?.deck || state.deck.length === 0) {
      const shuffled = shuffleDeck();
      setDeck(shuffled);
    }
    
    // Redirect if no players
    if (!state?.players || state.players.length === 0) {
      toast.error("Keine Spieler gefunden! Zurück zum Setup.");
      navigate("/setup");
    }
  }, []);

  const drawCard = () => {
    if (currentIndex >= deck.length - 1) {
      toast.success("Alle Karten wurden gespielt! Das Spiel ist zu Ende.", {
        duration: 5000,
      });
      return;
    }
    
    setShowCard(false);
    setCardAccepted(false);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setShowCard(true);
    }, 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Wahrheit: "category-truth",
      Aufgabe: "category-task",
      Gruppe: "category-group",
      Duell: "category-duel",
      Wildcard: "category-wildcard",
    };
    return colors[category] || "primary";
  };

  const handleAccept = () => {
    setCardAccepted(true);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    toast.success("Aufgabe angenommen!", {
      description: "Viel Erfolg!",
    });
  };

  const handleComplete = () => {
    const currentPlayer = players[currentPlayerIndex];
    toast.success(`${currentPlayer.avatar} ${currentPlayer.name}: Aufgabe erledigt!`);
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setTimeout(drawCard, 500);
  };

  const handleDrink = () => {
    const drinks = deck[currentIndex]?.drinks || 0;
    const currentPlayer = players[currentPlayerIndex];
    
    // Update player's drink count
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].totalDrinks += drinks;
    setPlayers(updatedPlayers);
    
    toast.info(`${currentPlayer.avatar} ${currentPlayer.name}: ${drinks} Schlück${drinks !== 1 ? "e" : ""}!`, {
      icon: <Beer className="w-5 h-5" />,
    });
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setTimeout(drawCard, 1000);
  };

  const handleRestart = () => {
    const shuffled = shuffleDeck();
    setDeck(shuffled);
    setCurrentIndex(-1);
    setShowCard(false);
    setCurrentPlayerIndex(0);
    
    // Reset drink counts
    const resetPlayers = players.map(p => ({ ...p, totalDrinks: 0 }));
    setPlayers(resetPlayers);
    
    toast.success("Spiel wurde neu gestartet!");
  };
  
  const showStatistics = () => {
    navigate("/statistics", { 
      state: { 
        players,
        deck,
        currentIndex,
        currentPlayerIndex,
        showCard,
        cardAccepted
      } 
    });
  };

  // Swipe gesture handlers
  const { swipeState, swipeHandlers, triggerHaptic } = useSwipe({
    onSwipeLeft: () => {
      // Swipe left = drink (skip task)
      if (currentIndex >= 0 && !cardAccepted) {
        handleDrink();
      }
    },
    onSwipeRight: () => {
      // Swipe right = complete task
      if (currentIndex >= 0) {
        if (cardAccepted) {
          handleComplete();
        } else {
          // Auto-accept and complete for wildcards or when task can be instantly completed
          if (currentCard?.category === "Wildcard" || currentCard?.drinks === 0) {
            handleComplete();
          } else {
            handleAccept();
          }
        }
      }
    },
  });

  const currentCard = deck[currentIndex];
  const cardsRemaining = deck.length - currentIndex - 1;

  return (
    <div className="min-h-screen flex flex-col p-6 pb-32 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="icon"
          className="hover:bg-muted/50"
        >
          <Home className="w-5 h-5" />
        </Button>
        
        {/* Current Player Display */}
        {players.length > 0 && currentIndex >= 0 ? (
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
            <span className="text-2xl">{players[currentPlayerIndex].avatar}</span>
            <span className="font-semibold text-primary">{players[currentPlayerIndex].name}</span>
            <span className="text-sm text-muted-foreground">ist dran</span>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Verbleibende Karten</p>
            <p className="text-2xl font-bold text-primary">{cardsRemaining}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={showStatistics}
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50"
          >
            <Trophy className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleRestart}
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Card display area */}
      <div className="flex-1 flex items-center justify-center">
        {currentIndex === -1 ? (
          <div className="text-center space-y-6 slide-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border border-primary/50 pulse-glow">
              <Beer className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Bereit?</h2>
              <p className="text-muted-foreground">Ziehe die erste Karte!</p>
            </div>
          </div>
        ) : showCard && currentCard ? (
          <div className="w-full max-w-md">
            <GameCard 
              card={currentCard}
              swipeDistance={swipeState.swipeDistance}
              swipeDirection={swipeState.swipeDirection}
              {...swipeHandlers}
            />
            
            {/* Swipe Instructions */}
            <div className="mt-6 flex justify-between items-center px-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-2xl">←</span>
                <span>Swipe: Trinken</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Erledigt</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          {currentIndex === -1 ? (
            <Button
              onClick={drawCard}
              size="lg"
              className="w-full h-16 text-lg bg-primary hover:shadow-[var(--shadow-button)] transition-all duration-300 animate-fade-in"
            >
              Karte ziehen
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          ) : cardAccepted ? (
            <Button
              onClick={handleComplete}
              size="lg"
              className="w-full h-14 text-lg hover:shadow-[var(--shadow-button)] transition-all duration-300 animate-fade-in animate-scale-in"
              style={{
                backgroundColor: `hsl(var(--${getCategoryColor(currentCard?.category || "")}))`,
              }}
            >
              <Check className="w-5 h-5 mr-3" />
              Erledigt
            </Button>
          ) : currentCard?.category === "Wildcard" || currentCard?.drinks === 0 ? (
            <Button
              onClick={handleComplete}
              size="lg"
              className="w-full h-14 text-lg hover:shadow-[var(--shadow-button)] transition-all duration-300 animate-fade-in"
              style={{
                backgroundColor: `hsl(var(--${getCategoryColor(currentCard?.category || "")}))`,
              }}
            >
              <Check className="w-5 h-5 mr-3" />
              Annehmen
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              <Button
                onClick={handleAccept}
                size="lg"
                className="h-14 text-lg hover:shadow-[var(--shadow-button)] transition-all duration-300"
                style={{
                  backgroundColor: `hsl(var(--${getCategoryColor(currentCard?.category || "")}))`,
                }}
              >
                <Check className="w-5 h-5 mr-2" />
                Annehmen
              </Button>
              
              <Button
                onClick={handleDrink}
                variant="outline"
                size="lg"
                className="h-14 text-lg border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300"
              >
                <Beer className="w-5 h-5 mr-2" />
                {currentCard?.drinks || 0} Schlück{currentCard?.drinks !== 1 ? "e" : ""}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
