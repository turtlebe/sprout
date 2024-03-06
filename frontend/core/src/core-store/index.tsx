import React from 'react';

import { useLogAxiosErrorInSnackbar } from '../hooks/use-log-axios-error-in-snackbar';
import { DEFAULT_ERROR_MESSSAGE } from '../utils';

import { CurrentUserImpl } from './current-user-impl';
import { useFetchCurrentUser, useFetchFarmOsModules } from './hooks';
import { CoreActions, CoreState } from './types';
export { CurrentUserImpl };

export const initialCoreState: CoreState = {
  currentUser: undefined,
  farmOsModules: undefined,
};

interface CoreStoreContextValue {
  coreState: CoreState;
  coreActions: CoreActions;
}

const CoreStoreContext = React.createContext<CoreStoreContextValue>(null);

export const CoreStoreProvider: React.FC = ({ children }) => {
  const [coreState, setCoreState] = React.useState<CoreState>(initialCoreState);
  const { data: userData, error: errorLoadingUser } = useFetchCurrentUser();
  const { data: farmOsModulesData, error: errrLoadingFarmOsModules } = useFetchFarmOsModules();

  const error = errorLoadingUser || errrLoadingFarmOsModules;
  useLogAxiosErrorInSnackbar(error, DEFAULT_ERROR_MESSSAGE);

  React.useEffect(() => {
    setCoreState({
      currentUser: userData ? new CurrentUserImpl(userData) : undefined,
      farmOsModules: farmOsModulesData?.farmOsModules,
    });
  }, [userData, farmOsModulesData]);

  const coreActions = React.useMemo<CoreActions>(() => {
    return {
      setCurrentFarmDefPath: (newPath: string) =>
        setCoreState(currentCoreState => ({
          ...currentCoreState,
          currentUser: new CurrentUserImpl({ ...currentCoreState.currentUser, currentFarmDefPath: newPath }),
        })),
    };
  }, [coreState, setCoreState]);

  return <CoreStoreContext.Provider value={{ coreState, coreActions }}>{children}</CoreStoreContext.Provider>;
};

export const useCoreStore = (): [CoreState, CoreActions] => {
  const context = React.useContext(CoreStoreContext);

  // note: for unit testing some places don't mock useCoreStore, so they will get null context. in this
  // case we return initialCoreState.
  const coreState = context?.coreState || initialCoreState;

  return [coreState, context?.coreActions];
};

export default useCoreStore;
