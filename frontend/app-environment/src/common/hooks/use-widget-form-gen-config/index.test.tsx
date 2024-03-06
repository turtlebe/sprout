import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { buildWidget } from '../../test-helpers';

import { useWidgetFormGenConfig } from '.';

const widget = buildWidget({ rowStart: 2, colStart: 2, rowEnd: 3, colEnd: 3 });
const { name, widgetType, dashboardId } = widget;

describe('useWidgetFormGenConfig', () => {
  beforeEach(() => {
    mockCurrentUser();
  });

  describe('serialize', () => {
    it('returns the widget with its coordinates when creating it', () => {
      const { result } = renderHook(() => useWidgetFormGenConfig({ dashboardId }));

      expect(result.current.serialize({ name, widgetType })).toEqual({
        dashboardId,
        name,
        widgetType,
        createdBy: 'olittle',
        rowStart: 1,
        colStart: 1,
        rowEnd: 2,
        colEnd: 2,
      });
    });

    it('does not modify the coordinates when updating the widget', () => {
      const { result } = renderHook(() => useWidgetFormGenConfig({ widget }));

      expect(result.current.serialize({ ...widget })).toEqual({ ...widget, updatedBy: 'olittle' });
    });
  });
});
