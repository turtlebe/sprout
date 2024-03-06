import React from 'react';

export interface UseResizeObserverReturn {
  width: number;
  height: number;
}

/**
 * Returns the size (width and height) of an element when it changes size using ResizeObserver.
 * - ResizeObserver dpcs: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 */
export const useResizeObserver = <T extends Element>(ref: React.MutableRefObject<T>): UseResizeObserverReturn => {
  const [elementSize, setElementSize] = React.useState<UseResizeObserverReturn>({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    // Initialize handler to call on DOM resize
    const resizeObserver = new ResizeObserver(([entry]) => {
      // Set window width/height to state
      setElementSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    // Subscribe to changes to ref changes
    if (ref?.current) {
      resizeObserver.observe(ref.current);
    }
    // Unsbuscribe to changes on cleanup
    return () => resizeObserver.disconnect();
  }, [ref]); // Reset when the "ref" is different

  return elementSize;
};
