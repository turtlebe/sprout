import { buildWidget, mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { DashboardGridContext } from '../../hooks';
import { getGridEmptySlots, getGridResizeSlots } from '../../utils';

import { dataTestIdsGridWidgets as dataTestIds, GridWidgets } from '.';

jest.mock('@plentyag/app-environment/src/dashboard-page/utils/get-grid-empty-slots');
jest.mock('@plentyag/app-environment/src/dashboard-page/utils/get-grid-resize-slots');

const widgets = [buildWidget({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 })];
const slot = { id: '1223', rowStart: 1, colStart: 2, rowEnd: 2, colEnd: 3 };

const onWidgetDeleted = jest.fn();
const onWidgetsMovedResized = jest.fn();
const mockGetGridEmptySlots = getGridEmptySlots as jest.Mock;
const mockGetGridResizeSlots = getGridResizeSlots as jest.Mock;

function renderGridWidgets() {
  return render(
    <DashboardGridContext.Provider
      value={{ dashboard: mockDashboards[0], canDrag: true, startDateTime: new Date(), endDateTime: new Date() }}
    >
      <GridWidgets
        widgets={widgets}
        canDrag
        onWidgetDeleted={onWidgetDeleted}
        onWidgetsMovedResized={onWidgetsMovedResized}
      />
    </DashboardGridContext.Provider>
  );
}

describe('GridWidgets', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('drags a widget to a new position', () => {
    // for whatever react-dnd is not returning the isDragging flag correctly so hacking it.
    mockGetGridEmptySlots.mockReturnValue([slot]);
    mockGetGridResizeSlots.mockReturnValue([]);

    const { queryByTestId } = renderGridWidgets();

    expect(onWidgetsMovedResized).toHaveBeenCalledTimes(1);

    fireEvent.dragStart(queryByTestId(dataTestIds.widget(widgets[0]).move));
    fireEvent.drop(queryByTestId(dataTestIds.emptySlot('1223').root));

    expect(onWidgetsMovedResized).toHaveBeenCalledTimes(2);
    expect(onWidgetsMovedResized).toHaveBeenNthCalledWith(1, widgets);
    expect(onWidgetsMovedResized).toHaveBeenNthCalledWith(2, [
      { ...widgets[0], rowStart: 1, colStart: 2, rowEnd: 2, colEnd: 3 },
    ]);
  });

  it('resizes a widget', () => {
    // for whatever react-dnd is not returning the isDragging flag correctly so hacking it.
    mockGetGridEmptySlots.mockReturnValue([]);
    mockGetGridResizeSlots.mockReturnValue([slot]);

    const { queryByTestId } = renderGridWidgets();

    expect(onWidgetsMovedResized).toHaveBeenCalledTimes(1);

    fireEvent.dragStart(queryByTestId(dataTestIds.widget(widgets[0]).resize));
    fireEvent.drop(queryByTestId(dataTestIds.emptySlot('1223').root));

    expect(onWidgetsMovedResized).toHaveBeenCalledTimes(2);
    expect(onWidgetsMovedResized).toHaveBeenNthCalledWith(1, widgets);
    expect(onWidgetsMovedResized).toHaveBeenNthCalledWith(2, [
      { ...widgets[0], rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 3 },
    ]);
  });
});
