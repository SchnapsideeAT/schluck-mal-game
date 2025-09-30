import { useRef, useState } from "react";
import { triggerHaptic, type HapticType } from "@/utils/haptics";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

interface SwipeState {
  isSwiping: boolean;
  swipeDirection: 'left' | 'right' | 'up' | null;
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
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const isMouseDown = useRef<boolean>(false);
  const minSwipeDistance = 100; // Minimum distance for a swipe
  const swipeThreshold = 30; // Distance to show visual feedback (schneller trigger)


  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    setSwipeState({ isSwiping: true, swipeDirection: null, swipeDistance: 0 });
    handlers.onSwipeStart?.();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState.isSwiping) return;

    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
    const distanceX = touchCurrentX.current - touchStartX.current;
    const distanceY = touchCurrentY.current - touchStartY.current;
    
    // Determine primary direction
    let direction: 'left' | 'right' | 'up' | null = null;
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      direction = distanceX > 0 ? 'right' : 'left';
    } else if (distanceY < 0) {
      direction = 'up';
    }

    setSwipeState({
      isSwiping: true,
      swipeDirection: Math.max(Math.abs(distanceX), Math.abs(distanceY)) > swipeThreshold ? direction : null,
      swipeDistance: Math.abs(distanceX) > Math.abs(distanceY) ? distanceX : distanceY,
    });
  };

  const handleTouchEnd = () => {
    const distanceX = touchCurrentX.current - touchStartX.current;
    const distanceY = touchCurrentY.current - touchStartY.current;
    
    // Determine primary swipe direction
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          triggerHaptic('medium');
          handlers.onSwipeRight?.();
        } else {
          triggerHaptic('medium');
          handlers.onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(distanceY) > minSwipeDistance && distanceY < 0) {
        triggerHaptic('medium');
        handlers.onSwipeUp?.();
      }
    }

    // Reset state
    setSwipeState({ isSwiping: false, swipeDirection: null, swipeDistance: 0 });
    handlers.onSwipeEnd?.();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    touchStartX.current = e.clientX;
    touchCurrentX.current = e.clientX;
    touchStartY.current = e.clientY;
    touchCurrentY.current = e.clientY;
    setSwipeState({ isSwiping: true, swipeDirection: null, swipeDistance: 0 });
    handlers.onSwipeStart?.();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;

    touchCurrentX.current = e.clientX;
    touchCurrentY.current = e.clientY;
    const distanceX = touchCurrentX.current - touchStartX.current;
    const distanceY = touchCurrentY.current - touchStartY.current;
    
    // Determine primary direction
    let direction: 'left' | 'right' | 'up' | null = null;
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      direction = distanceX > 0 ? 'right' : 'left';
    } else if (distanceY < 0) {
      direction = 'up';
    }

    setSwipeState({
      isSwiping: true,
      swipeDirection: Math.max(Math.abs(distanceX), Math.abs(distanceY)) > swipeThreshold ? direction : null,
      swipeDistance: Math.abs(distanceX) > Math.abs(distanceY) ? distanceX : distanceY,
    });
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    
    const distanceX = touchCurrentX.current - touchStartX.current;
    const distanceY = touchCurrentY.current - touchStartY.current;
    
    // Determine primary swipe direction
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          triggerHaptic('medium');
          handlers.onSwipeRight?.();
        } else {
          triggerHaptic('medium');
          handlers.onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(distanceY) > minSwipeDistance && distanceY < 0) {
        triggerHaptic('medium');
        handlers.onSwipeUp?.();
      }
    }

    isMouseDown.current = false;
    setSwipeState({ isSwiping: false, swipeDirection: null, swipeDistance: 0 });
    handlers.onSwipeEnd?.();
  };

  return {
    swipeState,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
    triggerHaptic,
  };
};
