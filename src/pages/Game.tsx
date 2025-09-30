import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { GameSettings } from "@/components/GameSettings";
import { shuffleDeck } from "@/utils/cardUtils";
import { Card, Player } from "@/types/card";
import { ArrowRight, Beer, Check, Home, RotateCcw, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useSwipe } from "@/hooks/useSwipe";
import { saveGameState, loadGameState, clearGameState } from "@/utils/localStorage";
import { triggerHaptic } from "@/utils/haptics";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);

  // Auto-save game state every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (players.length > 0 && deck.length > 0 && currentIndex >= 0) {
        saveGameState({
          players,
          deck,
          currentIndex,
          currentPlayerIndex,
          showCard,
          cardAccepted,
          timestamp: Date.now()
        });
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(interval);
  }, [players, deck, currentIndex, currentPlayerIndex, showCard, cardAccepted]);

  // Load saved game state on mount
  useEffect(() => {
    // Try to load saved state if no state was passed
    if (!state?.deck || state.deck.length === 0) {
      const savedState = loadGameState();
      
      if (savedState && savedState.players.length > 0) {
        // Ask user if they want to continue
        toast("Gespeichertes Spiel gefunden", {
          description: "Möchtest du das letzte Spiel fortsetzen?",
          action: {
            label: "Fortsetzen",
            onClick: () => {
              setPlayers(savedState.players);
              setDeck(savedState.deck);
              setCurrentIndex(savedState.currentIndex);
              setCurrentPlayerIndex(savedState.currentPlayerIndex);
              setShowCard(savedState.showCard);
              setCardAccepted(savedState.cardAccepted);
              toast.success("Spiel wiederhergestellt!");
            }
          },
          cancel: {
            label: "Neu starten",
            onClick: () => {
              clearGameState();
              const shuffled = shuffleDeck();
              setDeck(shuffled);
            }
          }
        });
      } else {
        const shuffled = shuffleDeck();
        setDeck(shuffled);
      }
    }
    
    // Redirect if no players
    if (!state?.players || state.players.length === 0) {
      const savedState = loadGameState();
      if (!savedState || savedState.players.length === 0) {
        navigate("/setup");
      }
    }
  }, []);

  const drawCard = useCallback((exitDirection?: 'left' | 'right') => {
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
  }, [currentIndex, deck]);

  const getCategoryColor = useCallback((category: string) => {
    const colors: Record<string, string> = {
      Wahrheit: "category-truth",
      Aufgabe: "category-task",
      Gruppe: "category-group",
      Duell: "category-duel",
      Wildcard: "category-wildcard",
    };
    return colors[category] || "primary";
  }, []);

  const handleAccept = useCallback(() => {
    setCardAccepted(true);
    // Haptic feedback
    if (hapticEnabled) {
      triggerHaptic('light');
    }
  }, [hapticEnabled]);

  const handleComplete = useCallback(() => {
    const currentPlayer = players[currentPlayerIndex];
    
    // Update player stats
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].totalDrinks = (updatedPlayers[currentPlayerIndex].totalDrinks || 0);
    setPlayers(updatedPlayers);
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    drawCard('right');
  }, [currentPlayerIndex, players, drawCard]);

  const handleDrink = useCallback(() => {
    const drinks = deck[currentIndex]?.drinks || 0;
    const currentPlayer = players[currentPlayerIndex];
    
    // Update player's drink count
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].totalDrinks += drinks;
    setPlayers(updatedPlayers);
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    drawCard('left');
  }, [currentIndex, deck, currentPlayerIndex, players, drawCard]);

  const handleRestart = useCallback(() => {
    setShowRestartDialog(true);
  }, []);

  const confirmRestart = useCallback(() => {
    const shuffled = shuffleDeck();
    setDeck(shuffled);
    setCurrentIndex(-1);
    setShowCard(false);
    setCurrentPlayerIndex(0);
    
    // Reset drink counts
    const resetPlayers = players.map(p => ({ ...p, totalDrinks: 0 }));
    setPlayers(resetPlayers);
    
    clearGameState();
    setShowRestartDialog(false);
    toast.success("Spiel neu gestartet!");
    
    if (hapticEnabled) {
      triggerHaptic('medium');
    }
  }, [players, hapticEnabled]);
  
  const showStatistics = useCallback(() => {
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
  }, [navigate, players, deck, currentIndex, currentPlayerIndex, showCard, cardAccepted]);

  // Swipe gesture handlers
  const { swipeState, swipeHandlers } = useSwipe({
    onSwipeLeft: () => {
      // Swipe left = drink (skip task)
      if (currentIndex >= 0) {
        handleDrink();
      }
    },
    onSwipeRight: () => {
      // Swipe right = complete task
      if (currentIndex >= 0) {
        handleComplete();
      }
    },
  });

  const currentCard = useMemo(() => deck[currentIndex], [deck, currentIndex]);
  const cardsRemaining = useMemo(() => deck.length - currentIndex - 1, [deck.length, currentIndex]);

  // Prefetch next card image
  useEffect(() => {
    if (currentIndex < deck.length - 1) {
      const nextCard = deck[currentIndex + 1];
      if (nextCard) {
        const img = new Image();
        img.src = getCardImage(nextCard.category, nextCard.id);
      }
    }
  }, [currentIndex, deck]);

  const handleExitGame = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    // Save before leaving
    saveGameState({
      players,
      deck,
      currentIndex,
      currentPlayerIndex,
      showCard,
      cardAccepted,
      timestamp: Date.now()
    });
    navigate("/");
  };

  // Import helper
  const getCardImage = (category: string, id: number) => {
    try {
      return new URL(`../assets/cards/${category}-${String(id).padStart(2, '0')}.svg`, import.meta.url).href;
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-8 pb-12 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={handleExitGame}
          variant="ghost"
          size="icon"
          className="hover:bg-muted/50"
        >
          <Home className="w-7 h-7" />
        </Button>
        
        <div className="flex gap-2">
          <GameSettings
            soundEnabled={soundEnabled}
            onSoundToggle={setSoundEnabled}
            hapticEnabled={hapticEnabled}
            onHapticToggle={setHapticEnabled}
          />
          <Button
            onClick={showStatistics}
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50"
          >
            <Trophy className="w-7 h-7" />
          </Button>
          <Button
            onClick={handleRestart}
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50"
          >
            <RotateCcw className="w-7 h-7" />
          </Button>
        </div>
      </div>

      {/* Card display area */}
      <div className="flex-1 flex items-center justify-center py-16">
        {currentIndex === -1 ? (
          <div 
            className="text-center space-y-6 slide-up cursor-pointer"
            onClick={() => drawCard()}
            onTouchStart={() => drawCard()}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border border-primary/50 pulse-glow">
              <Beer className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Bereit?</h2>
              <p className="text-muted-foreground">Ziehe die erste Karte!</p>
            </div>
          </div>
        ) : showCard && currentCard ? (
          <div className="w-full mx-auto relative">
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

      {/* Current Player Display - Bottom */}
      {players.length > 0 && currentIndex >= 0 && (
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/40 rounded-md px-6 py-3">
            <span className="text-3xl">{players[currentPlayerIndex].avatar}</span>
            <span className="text-xl font-bold text-primary">{players[currentPlayerIndex].name}</span>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-card border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Spiel verlassen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dein Fortschritt wird automatisch gespeichert und du kannst später weiterspielen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-primary">
              Speichern & Verlassen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restart Confirmation Dialog */}
      <AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <AlertDialogContent className="bg-card border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Spiel neu starten?</AlertDialogTitle>
            <AlertDialogDescription>
              Alle aktuellen Fortschritte und Statistiken gehen verloren. Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestart} className="bg-destructive hover:bg-destructive/90">
              Neu starten
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Game;
