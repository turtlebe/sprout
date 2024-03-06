import React from 'react';

interface UseOverflowElementReturn {
  isOverflowing: boolean;
}

/**
 * Ths hook will return true if the given element is overflowing (in x dir).
 */
export const useOverflowElement = <T extends Element>(element: T | undefined): UseOverflowElementReturn => {
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    // Initialize handler to call on DOM resize
    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry.target.clientWidth;
      const scrollWidth = entry.target.scrollWidth;
      const _isOverflowed = width < scrollWidth;
      if (width && scrollWidth) {
        setIsOverflowing(_isOverflowed);
      }
    });
    // Subscribe to changes to ref changes
    if (element) {
      resizeObserver.observe(element);
    }
    // Unsbuscribe to changes on cleanup
    return () => resizeObserver.disconnect();
  }, [element]);

  return { isOverflowing };
};
