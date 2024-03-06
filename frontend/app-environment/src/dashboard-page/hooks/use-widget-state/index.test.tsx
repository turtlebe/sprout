import { buildWidget } from '@plentyag/app-environment/src/common/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { useDashboardGridContext } from '..';

import { useWidgetState } from '.';

jest.mock('../use-dashboard-grid-context');

const mockUseDashboardGridContext = useDashboardGridContext as jest.Mock;
const overrideWidget = jest.fn();
const widget = buildWidget({});
const updatedWidget = { ...widget, rowStart: 2, rowEnd: 3 };

describe('useWidgetState', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUseDashboardGridContext.mockReturnValue({ overrideWidget });
  });

  it('reacts to prop change', () => {
    const { result, rerender } = renderHook(({ widget }) => useWidgetState({ widget }), { initialProps: { widget } });

    expect(result.current.widget).toEqual(widget);

    rerender({ widget });

    expect(result.current.widget).toEqual(widget);

    rerender({ widget: updatedWidget });

    expect(result.current.widget).toEqual(updatedWidget);
    expect(overrideWidget).not.toHaveBeenCalled();
  });

  it('returns an open/setOpen state', () => {
    const { result } = renderHook(() => useWidgetState({ widget }));

    expect(result.current.open).toBe(false);

    act(() => result.current.setOpen(true));

    expect(result.current.open).toBe(true);
    expect(overrideWidget).not.toHaveBeenCalled();
  });

  it('updates the widget and sets open as false', () => {
    const { result } = renderHook(() => useWidgetState({ widget }));

    expect(result.current.open).toBe(false);
    expect(result.current.widget).toEqual(widget);

    act(() => result.current.setOpen(true));

    expect(result.current.open).toBe(true);
    expect(result.current.widget).toEqual(widget);
    expect(overrideWidget).not.toHaveBeenCalled();

    act(() => result.current.handleWidgetUpdated(updatedWidget));

    expect(result.current.open).toBe(false);
    expect(result.current.widget).toEqual(updatedWidget);
    expect(overrideWidget).toHaveBeenCalledWith(updatedWidget);
  });
});
