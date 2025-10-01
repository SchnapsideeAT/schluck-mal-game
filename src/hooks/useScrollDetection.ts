import { useState, useEffect, RefObject } from 'react';

interface UseScrollDetectionProps {
  containerRef: RefObject<HTMLDivElement>;
  enabled?: boolean;
}

export const useScrollDetection = ({ containerRef, enabled = true }: UseScrollDetectionProps) => {
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const checkScrollNeeded = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        const viewportHeight = window.innerHeight;
        
        // iOS-specific: Compare with both clientHeight and viewport height
        const needsScrolling = scrollHeight > clientHeight || scrollHeight > viewportHeight;
        
        // Use setTimeout for iOS compatibility
        setTimeout(() => {
          setNeedsScroll(needsScrolling);
        }, 50);
      }
    };

    // Check initially with delay for iOS
    setTimeout(checkScrollNeeded, 100);

    // Check on resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkScrollNeeded, 50);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen to window resize for iOS orientation changes
    window.addEventListener('resize', checkScrollNeeded);
    window.addEventListener('orientationchange', checkScrollNeeded);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkScrollNeeded);
      window.removeEventListener('orientationchange', checkScrollNeeded);
    };
  }, [containerRef, enabled]);

  return needsScroll;
};
