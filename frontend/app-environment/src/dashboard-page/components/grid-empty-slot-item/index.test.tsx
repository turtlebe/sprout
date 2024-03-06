import { buildWidget, mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DashboardGridContext } from '../../hooks';
import { dataTestIdsGridWidgetItem, GridWidgetItem } from '../grid-widget-item';

import { dataTestIdsGridEmptySlotItem as dataTestIds, GridEmptySlotItem } from '.';

const widget = buildWidget({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 });
const slot = { id: '1223', rowStart: 1, colStart: 2, rowEnd: 2, colEnd: 3 };
const onDrop = jest.fn();
const startDateTime = new Date();
const endDateTime = new Date();

function renderGridEmptySlotItem(accept: GridEmptySlotItem['accept']) {
  return render(
    <DndProvider backend={HTML5Backend}>
      <DashboardGridContext.Provider
        value={{ canDrag: false, dashboard: mockDashboards[0], startDateTime, endDateTime }}
      >
        <GridWidgetItem widget={widget} canDrag onDeleted={jest.fn()} onDragging={jest.fn()} onResizing={jest.fn()} />
        <GridEmptySlotItem slot={slot} accept={accept} onDrop={onDrop} />
      </DashboardGridContext.Provider>
    </DndProvider>
  );
}

describe('GridEmptySlotItem', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('moves a widget to the empty slot', () => {
    const { queryByTestId } = renderGridEmptySlotItem('moveWidget');

    expect(onDrop).not.toHaveBeenCalled();

    fireEvent.dragStart(queryByTestId(dataTestIdsGridWidgetItem.move));
    fireEvent.drop(queryByTestId(dataTestIds.root));

    expect(onDrop).toHaveBeenCalledWith(slot, widget);
  });

  it('resizes a widget to the empty slot', () => {
    const { queryByTestId } = renderGridEmptySlotItem('resizeWidget');

    expect(onDrop).not.toHaveBeenCalled();

    fireEvent.dragStart(queryByTestId(dataTestIdsGridWidgetItem.resize));
    fireEvent.drop(queryByTestId(dataTestIds.root));

    expect(onDrop).toHaveBeenCalledWith(slot, widget);
  });
});
