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
      navigate("/setup");
    }
  }, []);

  const drawCard = (exitDirection?: 'left' | 'right') => {
    if (currentIndex >= deck.length - 1) {
      return;
    }
    
    // Mark current card as exiting if direction provided
    if (exitDirection && currentCard) {
      setDeck(prev => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], exiting: exitDirection } as any;
        return updated;
      });
    }
    
    setCardAccepted(false);
    
    // Load new card while old one is animating out
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setShowCard(true);
    }, 200);
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
  };

  const handleComplete = () => {
    const currentPlayer = players[currentPlayerIndex];
    
    // Update player stats
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].totalDrinks = (updatedPlayers[currentPlayerIndex].totalDrinks || 0);
    setPlayers(updatedPlayers);
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    drawCard('right');
  };

  const handleDrink = () => {
    const drinks = deck[currentIndex]?.drinks || 0;
    const currentPlayer = players[currentPlayerIndex];
    
    // Update player's drink count
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].totalDrinks += drinks;
    setPlayers(updatedPlayers);
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    drawCard('left');
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
      if (currentIndex >= 0) {
        handleDrink();
      }
    },
    onSwipeRight: () => {
      // Swipe right = complete task (simplified - one swipe)
      if (currentIndex >= 0) {
        handleComplete();
      }
    },
  });

  const currentCard = deck[currentIndex];
  const cardsRemaining = deck.length - currentIndex - 1;

  return (
    <div className="min-h-screen flex flex-col p-6 relative">
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
          <div className="w-full max-w-[98vw] sm:max-w-xl md:max-w-2xl mx-auto relative">
            {/* Next card (behind) */}
            {currentIndex < deck.length - 1 && (
              <div className="absolute inset-0 z-0">
                <GameCard 
                  card={deck[currentIndex + 1]}
                  swipeDistance={0}
                  swipeDirection={null}
                  showGlow={false}
                />
              </div>
            )}
            
            {/* Current card (on top) */}
            <div className="relative z-10">
              <GameCard 
                card={currentCard}
                swipeDistance={swipeState.swipeDistance}
                swipeDirection={swipeState.swipeDirection}
                {...swipeHandlers}
              />
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
};

export default Game;
