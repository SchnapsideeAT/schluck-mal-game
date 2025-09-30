import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { CardBack } from "@/components/CardBack";
import { shuffleDeck } from "@/utils/cardUtils";
import { Card, Player, CardCategory } from "@/types/card";
import { ArrowRight, Beer, Check, Home, Settings } from "lucide-react";
import { useSwipe } from "@/hooks/useSwipe";
import { saveGameState, loadGameState, clearGameState } from "@/utils/localStorage";
import { triggerHaptic } from "@/utils/haptics";
import { playSound } from "@/utils/sounds";
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
    selectedCategories?: CardCategory[];
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
  const [selectedCategories, setSelectedCategories] = useState<CardCategory[]>(state?.selectedCategories || []);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(state?.currentPlayerIndex ?? 0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Disable scrolling on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

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

  // Redirect if no players
  useEffect(() => {
    if (!state?.players || state.players.length === 0) {
      navigate("/setup");
      return;
    }
    
    // Initialize deck if not provided
    if (!state?.deck || state.deck.length === 0) {
      const shuffled = shuffleDeck(state?.selectedCategories);
      setDeck(shuffled);
    }
  }, []);

  // Check if game is finished
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex >= deck.length - 1 && showCard) {
      // Game is finished, navigate to statistics
      const timer = setTimeout(() => {
        navigate("/statistics", { 
          state: { 
            players,
            deck,
            currentIndex,
            currentPlayerIndex,
            showCard,
            cardAccepted,
            gameFinished: true,
            selectedCategories
          } 
        });
      }, 1000); // Small delay to show the last card
      return () => clearTimeout(timer);
    }
  }, [currentIndex, deck.length, showCard, navigate, players, currentPlayerIndex, cardAccepted, selectedCategories]);

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
      playSound('cardDraw', soundEnabled);
    }, 200);
  }, [currentIndex, deck, soundEnabled]);

  const getCategoryColor = useCallback((category: string) => {
    const colors: Record<string, string> = {
      Wahrheit: "bg-category-truth",
      Aufgabe: "bg-category-task",
      Gruppe: "bg-category-group",
      Duell: "bg-category-duel",
      Wildcard: "bg-category-wildcard",
    };
    return colors[category] || "bg-primary";
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
    
    // Sound effect
    playSound('swipeRight', soundEnabled);
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    playSound('playerChange', soundEnabled);
    drawCard('right');
  }, [currentPlayerIndex, players, drawCard, soundEnabled]);

  const handleDrink = useCallback(() => {
    const drinks = deck[currentIndex]?.drinks || 0;
    const currentPlayer = players[currentPlayerIndex];
    
    // Update player's drink count
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].totalDrinks += drinks;
    setPlayers(updatedPlayers);
    
    // Sound effects
    playSound('swipeLeft', soundEnabled);
    playSound('drink', soundEnabled);
    
    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    playSound('playerChange', soundEnabled);
    drawCard('left');
  }, [currentIndex, deck, currentPlayerIndex, players, drawCard, soundEnabled]);

  const showStatistics = useCallback(() => {
    navigate("/statistics", { 
      state: { 
        players,
        deck,
        currentIndex,
        currentPlayerIndex,
        showCard,
        cardAccepted,
        selectedCategories
      } 
    });
  }, [navigate, players, deck, currentIndex, currentPlayerIndex, showCard, cardAccepted, selectedCategories]);

  const navigateToSettings = () => {
    // Save before navigating
    saveGameState({
      players,
      deck,
      currentIndex,
      currentPlayerIndex,
      showCard,
      cardAccepted,
      timestamp: Date.now()
    });
    navigate("/settings", {
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

  // Swipe gesture handlers for card (left/right only)
  const { swipeState: cardSwipeState, swipeHandlers: cardSwipeHandlers } = useSwipe({
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

  // Swipe gesture handlers for bottom area (up only)
  const { swipeHandlers: bottomSwipeHandlers } = useSwipe({
    onSwipeUp: () => {
      // Swipe up = show statistics
      showStatistics();
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
    <div className="min-h-screen h-screen flex flex-col px-6 pt-8 pb-32 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={handleExitGame}
          variant="ghost"
          className="group hover:bg-muted/50 h-16 w-16 p-0"
        >
          <Home className="!w-7 !h-7 group-hover:text-primary transition-colors" />
        </Button>
        
        <Button
          onClick={navigateToSettings}
          variant="ghost"
          className="group hover:bg-muted/50 h-16 w-16 p-0"
        >
          <Settings className="!w-7 !h-7 group-hover:text-primary transition-colors" />
        </Button>
      </div>

      {/* Main container with proper spacing */}
      <div className="flex-1 flex flex-col">
        {/* Card display area */}
        <div className="flex-1 flex items-center justify-center py-4">
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
              {/* Card back (behind) - only show if there are more cards */}
              {currentIndex < deck.length - 1 && (
                <div className="absolute inset-0 z-0" style={{ transform: 'translate(8px, 8px)' }}>
                  <CardBack />
                </div>
              )}
              
              {/* Current card (on top) */}
              <div className="relative z-10">
                <GameCard 
                  key={currentIndex}
                  card={currentCard}
                  swipeDistance={cardSwipeState.swipeDistance}
                  swipeDirection={cardSwipeState.swipeDirection}
                  {...cardSwipeHandlers}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Current Player Display - Fixed at Bottom */}
      {players.length > 0 && currentIndex >= 0 && currentCard && (
        <div 
          className={`${getCategoryColor(currentCard.category)} transition-colors duration-200 ease-in-out fixed bottom-0 left-0 right-0 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-20`}
          {...bottomSwipeHandlers}
        >
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl drop-shadow-lg">{players[currentPlayerIndex].avatar}</span>
            <span className="text-2xl font-bold text-white drop-shadow-lg">{players[currentPlayerIndex].name}</span>
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

    </div>
  );
};

export default Game;
