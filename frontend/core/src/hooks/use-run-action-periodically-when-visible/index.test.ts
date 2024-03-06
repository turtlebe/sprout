import { renderHook } from '@testing-library/react-hooks';

import { usePageVisibility } from '../use-page-visibility';

import { useRunActionPeriodicallyWhenVisible } from '.';

jest.mock('../use-page-visibility');
const mockUsePageVisibility = usePageVisibility as jest.Mock;

const timerPeriod = 1000;

describe('useRunActionPeriodicallyWhenVisible', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    mockUsePageVisibility.mockClear();
  });

  function renderTestHook({
    conditionResult,
    visibility,
  }: {
    conditionResult: boolean;
    visibility?: 'hidden' | 'visible';
  }) {
    if (visibility) {
      mockUsePageVisibility.mockReturnValue(visibility);
    }

    jest.useFakeTimers();

    const mockAction = jest.fn();
    const result = renderHook(
      ({ condition }) => useRunActionPeriodicallyWhenVisible({ condition, action: mockAction, period: timerPeriod }),
      {
        initialProps: { condition: () => conditionResult },
      }
    );

    return {
      mockAction,
      ...result,
    };
  }

  function advanceTimerToNextPeriod() {
    // advanced to next period plus a little so should trigger next interval.
    jest.advanceTimersByTime(timerPeriod + 10);
  }

  it('executes action periodically - when visible and condition is satisfied', () => {
    const { mockAction } = renderTestHook({ conditionResult: true, visibility: 'visible' });

    expect(mockAction).toHaveBeenCalledTimes(1);

    advanceTimerToNextPeriod();

    expect(mockAction).toHaveBeenCalledTimes(2);
  });

  it('does not execute action periodically when page is not visible', () => {
    const { mockAction } = renderTestHook({ conditionResult: true, visibility: 'hidden' });

    expect(mockAction).toHaveBeenCalledTimes(0);

    advanceTimerToNextPeriod();

    expect(mockAction).toHaveBeenCalledTimes(0);
  });

  it('does not execute action periodically when condition is not satisfied', () => {
    const { mockAction } = renderTestHook({ conditionResult: false, visibility: 'visible' });

    expect(mockAction).toHaveBeenCalledTimes(0);

    advanceTimerToNextPeriod();

    expect(mockAction).toHaveBeenCalledTimes(0);
  });

  it('executes action when page becomes visible and condition is satisfied', () => {
    mockUsePageVisibility.mockReturnValueOnce('hidden').mockReturnValueOnce('visible');

    const { mockAction, rerender } = renderTestHook({ conditionResult: true });

    expect(mockAction).toHaveBeenCalledTimes(0);

    advanceTimerToNextPeriod();

    expect(mockAction).toHaveBeenCalledTimes(0);

    rerender({ condition: () => true });

    expect(mockAction).toHaveBeenCalledTimes(1);

    advanceTimerToNextPeriod();

    expect(mockAction).toHaveBeenCalledTimes(2);
  });

  it('does not execute action when page becomes visible and condition is not satisfied', () => {
    mockUsePageVisibility.mockReturnValueOnce('hidden').mockReturnValueOnce('visible');

    const { mockAction, rerender } = renderTestHook({ conditionResult: true });

    expect(mockAction).toHaveBeenCalledTimes(0);

    advanceTimerToNextPeriod();

    expect(mockAction).toHaveBeenCalledTimes(0);

    rerender({ condition: () => false });

    expect(mockAction).toHaveBeenCalledTimes(0);

    advanceTimerToNextPeriod();

    expect(mockAction).toHaveBeenCalledTimes(0);
  });
});
