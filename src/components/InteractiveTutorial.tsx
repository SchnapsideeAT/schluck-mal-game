import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ArrowUp, Check } from "lucide-react";
import { useSwipe } from "@/hooks/useSwipe";
import { SwipeOverlay } from "@/components/SwipeOverlay";
import { PlayerTransition } from "@/components/PlayerTransition";
import { triggerHaptic } from "@/utils/haptics";
import { playSound } from "@/utils/sounds";
import { markInteractiveTutorialAsShown } from "@/utils/localStorage";
import cardBackSvg from "@/assets/card-back.svg";

interface TutorialStep {
  title: string;
  description: string;
  requiredSwipe?: 'left' | 'right' | 'up';
  icon?: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Willkommen bei Schluck mal!",
    description: "Lerne die Swipe-Gesten kennen. Wische nach rechts, links oder oben, um zu interagieren.",
    icon: <div className="text-6xl">👋</div>,
  },
  {
    title: "Swipe nach rechts",
    description: "Wische die Karte nach rechts, um die Aufgabe zu erfüllen.",
    requiredSwipe: 'right',
    icon: <ArrowRight className="w-16 h-16 text-green-500" />,
  },
  {
    title: "Swipe nach links",
    description: "Wische die Karte nach links, wenn du die Aufgabe trinkst oder überspringst.",
    requiredSwipe: 'left',
    icon: <ArrowLeft className="w-16 h-16 text-red-500" />,
  },
  {
    title: "Swipe nach oben",
    description: "Wische nach oben, um die Statistik der Runde zu sehen.",
    requiredSwipe: 'up',
    icon: <ArrowUp className="w-16 h-16 text-primary" />,
  },
];

export const InteractiveTutorial = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPlayerTransition, setShowPlayerTransition] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  // Swipe handling for tutorial
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (currentStep === 0) {
      // First step: accept any swipe to proceed
      triggerHaptic('light');
      playSound('success');
      setCanProceed(true);
      return;
    }

    if (step.requiredSwipe === direction) {
      // Correct swipe
      triggerHaptic('medium');
      playSound('success');
      setCanProceed(true);
    } else if (step.requiredSwipe) {
      // Wrong swipe
      triggerHaptic('light');
      playSound('buttonClick');
    }
  };

  const { swipeState, swipeHandlers } = useSwipe({
    onSwipeLeft: () => handleSwipe('left'),
    onSwipeRight: () => handleSwipe('right'),
    onSwipeUp: () => handleSwipe('up'),
  });

  const handleNext = () => {
    if (!canProceed && currentStep > 0) return;

    if (isLastStep) {
      // Show player transition before completing
      setShowPlayerTransition(true);
      setTimeout(() => {
        completeTutorial();
      }, 3000);
    } else {
      setCurrentStep(prev => prev + 1);
      setCanProceed(false);
    }
  };

  const completeTutorial = () => {
    markInteractiveTutorialAsShown();
    const state = location.state as { players?: any[]; selectedCategories?: any[] };
    navigate('/game', { state });
  };

  const handleSkip = () => {
    markInteractiveTutorialAsShown();
    const state = location.state as { players?: any[]; selectedCategories?: any[] };
    navigate('/game', { state });
  };

  // Auto-proceed after correct swipe
  useEffect(() => {
    if (canProceed && currentStep > 0) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [canProceed, currentStep]);

  // Show player transition at the end
  if (showPlayerTransition) {
    const demoPlayer = { 
      id: '1', 
      name: 'Du', 
      avatar: '🎮',
      totalDrinks: 0,
      stats: { accepted: 0, drinks: 0, wildcards: 0 }
    };
    
    return (
      <PlayerTransition
        player={demoPlayer}
        categoryColor="bg-gradient-to-br from-primary/20 to-accent/20"
        onTap={completeTutorial}
        bottomSwipeHandlers={{}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Progress indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {tutorialSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentStep
                ? "w-8 bg-primary"
                : index < currentStep
                ? "w-2 bg-primary/50"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Skip button */}
      <Button
        onClick={handleSkip}
        variant="ghost"
        className="absolute top-8 right-8 z-10 text-muted-foreground"
      >
        Überspringen
      </Button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
        {/* Icon/Visual */}
        {step.icon && (
          <div className="flex justify-center animate-scale-in">
            {step.icon}
          </div>
        )}

        {/* Tutorial card for swipe steps */}
        {step.requiredSwipe && (
          <div 
            className="relative w-64 h-96 cursor-grab active:cursor-grabbing"
            {...swipeHandlers}
          >
            <div className="w-full h-full bg-card rounded-2xl shadow-card flex items-center justify-center border-2 border-border">
              <img 
                src={cardBackSvg} 
                alt="Tutorial Card" 
                className="w-full h-full object-cover rounded-2xl"
                draggable={false}
              />
            </div>
            
            {/* Swipe hint overlay */}
            {!canProceed && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-background/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-primary animate-pulse">
                  {step.requiredSwipe === 'right' && <ArrowRight className="w-8 h-8 text-green-500" />}
                  {step.requiredSwipe === 'left' && <ArrowLeft className="w-8 h-8 text-red-500" />}
                  {step.requiredSwipe === 'up' && <ArrowUp className="w-8 h-8 text-primary" />}
                </div>
              </div>
            )}

            {/* Success checkmark */}
            {canProceed && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-green-500/90 backdrop-blur-sm px-6 py-3 rounded-full animate-scale-in">
                  <Check className="w-12 h-12 text-white" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Swipe overlay for visual feedback */}
        {step.requiredSwipe && (
          <SwipeOverlay
            horizontalDistance={swipeState.horizontalDistance}
            swipeDirection={swipeState.swipeDirection}
            isSwiping={swipeState.isSwiping}
          />
        )}

        {/* Text content */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">{step.title}</h2>
          <p className="text-lg text-muted-foreground">{step.description}</p>
        </div>

        {/* Action buttons for non-swipe steps */}
        {!step.requiredSwipe && (
          <Button
            onClick={handleNext}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isLastStep ? (
              <>
                Los geht's!
                <Check className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Weiter
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Bottom hint for swipe steps */}
      {step.requiredSwipe && !canProceed && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Versuche es jetzt!
          </p>
        </div>
      )}
    </div>
  );
};
