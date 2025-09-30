import { useRef, useState, useEffect } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

interface SwipeState {
  isSwiping: boolean;
  swipeDirection: 'left' | 'right' | null;
  swipeDistance: number;
}

export const useSwipe = (handlers: SwipeHandlers) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    swipeDirection: null,
    swipeDistance: 0,
  });

  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const minSwipeDistance = 100; // Minimum distance for a swipe
  const swipeThreshold = 30; // Distance to show visual feedback (schneller trigger)

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    setSwipeState({ isSwiping: true, swipeDirection: null, swipeDistance: 0 });
    handlers.onSwipeStart?.();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState.isSwiping) return;

    touchCurrentX.current = e.touches[0].clientX;
    const distance = touchCurrentX.current - touchStartX.current;
    const direction = distance > 0 ? 'right' : 'left';

    setSwipeState({
      isSwiping: true,
      swipeDirection: Math.abs(distance) > swipeThreshold ? direction : null,
      swipeDistance: distance,
    });
  };

  const handleTouchEnd = () => {
    const distance = touchCurrentX.current - touchStartX.current;
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        triggerHaptic('medium');
        handlers.onSwipeRight?.();
      } else {
        triggerHaptic('medium');
        handlers.onSwipeLeft?.();
      }
    }

    // Reset state
    setSwipeState({ isSwiping: false, swipeDirection: null, swipeDistance: 0 });
    handlers.onSwipeEnd?.();
  };

  return {
    swipeState,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    triggerHaptic,
  };
};
