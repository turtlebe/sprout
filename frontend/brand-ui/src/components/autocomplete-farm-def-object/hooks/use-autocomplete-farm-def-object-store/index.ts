import React from 'react';
import globalHook from 'use-global-hook';

import {
  actions,
  AutocompleteFarmDefObjectActions,
  AutocompleteFarmDefObjectGlobalActions,
  getActions,
} from './actions';
import {
  AutocompleteFarmDefObjectGlobalState,
  AutocompleteFarmDefObjectState,
  initialGlobalState,
  initialScopedState,
} from './state';

export type { AutocompleteFarmDefObjectActions } from './actions';
export type { AutocompleteFarmDefObjectState, AllowedObjects } from './state';
export { initialScopedState } from './state';

/**
 * Hook to instanciate the global store.
 *
 * This should not be exposed to the outside world. @see useAutocompleteFarmDefObjectStore instead.
 */
const useAutocompleteFarmDefObjectGlobalStore = globalHook<
  AutocompleteFarmDefObjectGlobalState,
  AutocompleteFarmDefObjectGlobalActions
>(React, initialGlobalState, actions);

/**
 * Exposes
 * @param id
 */
export const useAutocompleteFarmDefObjectStore = (
  id: string
): [AutocompleteFarmDefObjectState, AutocompleteFarmDefObjectActions] => {
  const [state, actions] = useAutocompleteFarmDefObjectGlobalStore<
    AutocompleteFarmDefObjectGlobalState,
    AutocompleteFarmDefObjectGlobalActions
  >();

  React.useEffect(() => {
    actions.registerState(id);
  }, []);

  const { scopedStates, ...globalStateWithoutScopes } = state;
  const scopedState = scopedStates[id] ?? initialScopedState;
  const scopedActions = getActions(id, actions);

  return [{ ...scopedState, ...globalStateWithoutScopes }, scopedActions];
};
