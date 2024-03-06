import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { act, renderHook } from '@testing-library/react-hooks';
import { DateTime } from 'luxon';

import { mockAreaWithPropagationLine, mockPropagationLine } from '../../test-helpers/farm-def-mocks';

import { useDefaultParameters } from '.';

describe('useDefaultParameters', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not change default after re-render when line/area do not change', () => {
    const now = DateTime.now();
    jest.setSystemTime(now.toJSDate());

    const { result, rerender } = renderHook(props => useDefaultParameters(props), {
      initialProps: { area: mockAreaWithPropagationLine, line: mockPropagationLine },
    });

    const defaultParameters = {
      ...mockDefaultQueryParameters,
      selectedDate: now,
    };
    expect(result.current.defaultParameters).toEqual(defaultParameters);

    const oneMinuteLater = now.plus({ minutes: 1 });
    jest.setSystemTime(oneMinuteLater.toJSDate());

    rerender({ area: mockAreaWithPropagationLine, line: mockPropagationLine });

    // doesn't change after rerender, since line/area didn't change.
    expect(result.current.defaultParameters).toEqual(defaultParameters);
  });

  it('gets new default after area/line change', () => {
    const now = DateTime.now();
    jest.setSystemTime(now.toJSDate());

    const { result, rerender } = renderHook(props => useDefaultParameters(props), {
      initialProps: {},
    });

    expect(result.current.defaultParameters).toEqual({
      ...mockDefaultQueryParameters,
      selectedDate: now,
    });

    const oneMinuteLater = now.plus({ minutes: 1 });
    jest.setSystemTime(oneMinuteLater.toJSDate());

    rerender({ area: mockAreaWithPropagationLine, line: mockPropagationLine });

    // changes since area/line changed.
    expect(result.current.defaultParameters).toEqual({
      ...mockDefaultQueryParameters,
      selectedDate: oneMinuteLater,
    });
  });

  it('gets new default after reset', () => {
    const now = DateTime.now();
    jest.setSystemTime(now.toJSDate());

    const { result } = renderHook(() =>
      useDefaultParameters({ area: mockAreaWithPropagationLine, line: mockPropagationLine })
    );

    expect(result.current.defaultParameters).toEqual({
      ...mockDefaultQueryParameters,
      selectedDate: now,
    });

    const oneMinuteLater = now.plus({ minutes: 1 });
    jest.setSystemTime(oneMinuteLater.toJSDate());

    act(() => {
      result.current.handleMapsReset();
    });

    expect(result.current.defaultParameters).toEqual({
      ...mockDefaultQueryParameters,
      selectedDate: oneMinuteLater,
    });
  });
});
