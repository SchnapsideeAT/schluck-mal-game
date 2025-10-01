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
        setNeedsScroll(scrollHeight > clientHeight);
      }
    };

    // Check initially
    checkScrollNeeded();

    // Check on resize
    const resizeObserver = new ResizeObserver(checkScrollNeeded);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, enabled]);

  return needsScroll;
};
