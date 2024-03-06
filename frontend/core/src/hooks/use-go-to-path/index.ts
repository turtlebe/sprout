import React from 'react';
import { useHistory } from 'react-router-dom';

interface UseGoToPath {
  warningMessage?: string;
  isAllowed?: boolean;
  disabled?: boolean;
}

const DEFAULT_OPTIONS: UseGoToPath = {
  warningMessage: 'Changes have not been submitted. Are you sure you want to navigate away?',
  isAllowed: false,
};

export interface UseGoToPathReturn {
  setIsGoToAllowed: (allowed: boolean) => void;
  goToPath: (path: string) => void;
  isAllowed: React.MutableRefObject<boolean>;
}
/**
 * Hook that will show warning message with a confirmation dialog when navigation is not allowed.
 * Otherwise if allowed will allow navigation without warning.
 *
 * @param @see useGotToPath
 * @return @see UseGoToPathReturn
 */
export function useGoToPath(options?: UseGoToPath): UseGoToPathReturn {
  const optionsWithDefaults = { ...DEFAULT_OPTIONS, ...options };
  const history = useHistory();
  const isAllowed = React.useRef<boolean>(optionsWithDefaults.isAllowed);

  React.useEffect(() => {
    let unRegisterCallback = history.block(() => {
      if (!isAllowed.current && !optionsWithDefaults.disabled) {
        return optionsWithDefaults.warningMessage;
      }
    });
    return () => {
      // unregister block when unmounting.
      unRegisterCallback();
    };
  }, []);

  const goToPath: UseGoToPathReturn['goToPath'] = (path: string) => {
    history.push(path);
  };

  const setIsGoToAllowed: UseGoToPathReturn['setIsGoToAllowed'] = (allowed: boolean) => {
    isAllowed.current = allowed;
  };

  return { setIsGoToAllowed, isAllowed, goToPath };
}
