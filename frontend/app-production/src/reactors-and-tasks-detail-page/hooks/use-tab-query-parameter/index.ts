import { useQueryParam } from '@plentyag/core/src/hooks';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { camelCase } from 'voca';

export const TAB_QUERY_PARAM = 'tab';

export enum TabStates {
  reactorState = 'reactor-state',
  taskState = 'task-state',
  taskStateBehaviorTree = 'task-state-behavior-tree',
  taskProgress = 'task-progress',
  reactorStateBehaviorTree = 'reactor-state-behavior-tree',
}

export interface UseTabQueryParameterReturn {
  tab: TabStates;
  setTab: (tab: TabStates) => void;
}

/**
 * This hook uses the query parameter "tab" to drive the state of the tab
 * in the reactors and task details page. Also this hook allows changing
 * the current tab via the setTab function. If the query "tab" query parameter
 * is not provided or is invalid value, then the default value (reactor-state)
 * is used.
 */
export const useTabQueryParameter = (taskId?: string): UseTabQueryParameterReturn => {
  const history = useHistory();
  const queryParamTab = useQueryParam().get(TAB_QUERY_PARAM);
  const tab = TabStates[camelCase(queryParamTab)] || TabStates.reactorState;

  function setTab(value: TabStates) {
    const newSearch = new URLSearchParams(history.location.search);
    newSearch.set(TAB_QUERY_PARAM, value);
    // note: using replace here, since we don't want a tab change adding a new history item.
    history.replace({
      search: newSearch.toString(),
    });
  }

  React.useEffect(() => {
    // if no tab query parameter is provided or is it invalid then use default.
    if (!queryParamTab || queryParamTab !== tab) {
      setTab(taskId ? TabStates.taskProgress : TabStates.reactorState);
    }
  }, [queryParamTab]);

  return { tab, setTab };
};
