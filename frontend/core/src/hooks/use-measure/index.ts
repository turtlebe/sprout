import React from 'react';
export interface UseMeasureReturn {
  width: number;
  height: number;
}

/**
 * Returns the size (width and height) of an element and update its value when the window is being resized.
 *
 * Inspired by: https://usehooks.com/useWindowSize/
 */
export const useMeasure = <T extends Element>(ref: React.MutableRefObject<T>): UseMeasureReturn => {
  const [elementSize, setElementSize] = React.useState<UseMeasureReturn>({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setElementSize({
        width: ref.current?.clientWidth,
        height: ref.current?.clientHeight,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [ref]); // Empty array ensures that effect is only run on mount

  return elementSize;
};
