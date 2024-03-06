import { act, renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { TabStates, useTabQueryParameter } from '.';

const mockTaskId = '123';

describe('useTabQueryParameter', () => {
  function renderUseTabQueryParameterHook(initialSearch?: string, taskId?: string) {
    const mockInitialPath = '/production/reactors-and-tasks-details';

    const history = createMemoryHistory({ initialEntries: [`${mockInitialPath}${initialSearch}`] });
    const wrapper = ({ children }) => <Router history={history}>{children}</Router>;

    const result = renderHook(() => useTabQueryParameter(taskId), {
      wrapper,
    });

    return { ...result, history };
  }
  it('sets default tab to "reactor-state" when no query parameter provided', () => {
    const { history, result } = renderUseTabQueryParameterHook();

    expect(history.location.search).toBe('?tab=reactor-state');
    expect(result.current.tab).toBe(TabStates.reactorState);
  });

  it('sets default tab to "reactor-progress" when taskId and no query parameter provided', () => {
    const { history, result } = renderUseTabQueryParameterHook(`?taskId=${mockTaskId}`, mockTaskId);

    expect(history.location.search).toBe(`?taskId=${mockTaskId}&tab=task-progress`);
    expect(result.current.tab).toBe(TabStates.taskProgress);
  });

  it('sets tab to query string provided value when taskId is provided', () => {
    const { history, result } = renderUseTabQueryParameterHook(`?taskId=${mockTaskId}&tab=reactor-state`, mockTaskId);

    expect(history.location.search).toBe(`?taskId=${mockTaskId}&tab=reactor-state`);
    expect(result.current.tab).toBe(TabStates.reactorState);
  });

  it('sets tab state from "tab" query parameter', () => {
    const { history, result } = renderUseTabQueryParameterHook('?tab=reactor-state');

    expect(history.location.search).toBe('?tab=reactor-state');
    expect(result.current.tab).toBe(TabStates.reactorState);
  });

  it('sets tab state to default when "tab" query parameter is invalid', () => {
    const { history, result } = renderUseTabQueryParameterHook('?tab=invalid-tab');

    expect(history.location.search).toBe('?tab=reactor-state');
    expect(result.current.tab).toBe(TabStates.reactorState);
  });

  it('updates the "tab" query parameter when calling "setTab"', () => {
    const { history, result } = renderUseTabQueryParameterHook(`?taskId=${mockTaskId}&tab=reactor-state`, mockTaskId);

    expect(history.location.search).toBe(`?taskId=${mockTaskId}&tab=reactor-state`);
    expect(history.length).toBe(1);

    act(() => result.current.setTab(TabStates.taskProgress));

    expect(history.location.search).toBe(`?taskId=${mockTaskId}&tab=task-progress`);
    expect(result.current.tab).toBe(TabStates.taskProgress);

    // history should not increase as we are using history.replace rather than history.push.
    expect(history.length).toBe(1);
  });
});
