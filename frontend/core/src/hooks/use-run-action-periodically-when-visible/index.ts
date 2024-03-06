import React from 'react';
import { useInterval } from 'react-use';

import { usePageVisibility } from '../use-page-visibility';

export interface UseRunActionPeriodicallyWhenVisible {
  condition: () => boolean;
  action: () => void;
  period: number;
}

/**
 * This hook will periodically run the given action when the page is visible and the condition is true.
 * Also, if the page is not visible and becomes visible and the condition is true, the execute the action.
 */
export const useRunActionPeriodicallyWhenVisible = ({
  condition,
  action,
  period,
}: UseRunActionPeriodicallyWhenVisible) => {
  const visibilityState = usePageVisibility();

  useInterval(
    () => {
      if (condition() && visibilityState === 'visible') {
        action();
      }
    },
    visibilityState === 'visible' ? period : null
  );

  React.useEffect(() => {
    // do action again when becomes visible again.
    if (condition() && visibilityState === 'visible') {
      action();
    }
  }, [visibilityState]);
};
