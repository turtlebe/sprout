import React from 'react';

export const usePageVisibility = (): VisibilityState => {
  const [visibilityState, setVisibilityState] = React.useState<VisibilityState>(document.visibilityState);

  function handleVisibilityChange() {
    setVisibilityState(document.visibilityState);
  }

  React.useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return visibilityState;
};
