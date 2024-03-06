import { Widget } from '@plentyag/core/src/types/environment';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  DropdownWidget,
  getGridEmptySlotItemDataTestIds,
  getGridWidgetItemDataTestIds,
  GridEmptySlotItem,
  GridWidgetItem,
} from '..';
import { areAllHistoricalAndOnSeparateRows, getGridEmptySlots, getGridResizeSlots } from '../../utils';

import { useStyles } from './styles';

const dataTestIds = {
  widget: (widget: Widget) => getGridWidgetItemDataTestIds(`widget-${widget.id}`),
  emptySlot: (slotId: string) => getGridEmptySlotItemDataTestIds(`slot-${slotId}`),
};

export { dataTestIds as dataTestIdsGridWidgets };

export interface GridWidgets {
  widgets: Widget[];
  canDrag: boolean;
  onWidgetDeleted: DropdownWidget['onWidgetDeleted'];
  onWidgetsMovedResized: (widgets: Widget[]) => void;
}

/**
 * Render a list of Widgets in a CSS Grid.
 *
 * Widgets can be dragged to an empty position in the grid and resized.
 */
export const GridWidgets: React.FC<GridWidgets> = ({
  widgets: propWidgets = [],
  canDrag,
  onWidgetDeleted,
  onWidgetsMovedResized,
}) => {
  const rowsCount = Math.max(...propWidgets.map(widget => widget.rowEnd));
  const columnsCount = Math.max(...propWidgets.map(widget => widget.colEnd));
  const [widgets, setWidgets] = React.useState(propWidgets);
  const fullWidth = areAllHistoricalAndOnSeparateRows(widgets);
  const classes = useStyles({ canDrag, rowsCount, columnsCount, fullWidth });
  const [widgetDragging, setWidgetDragging] = React.useState<Widget>();
  const [widgetResizing, setWidgetResizing] = React.useState<Widget>();

  React.useEffect(() => {
    setWidgets(propWidgets);
  }, [propWidgets]);
  React.useEffect(() => {
    onWidgetsMovedResized(widgets);
  }, [widgets]);

  const handleMoveWidget: GridEmptySlotItem['onDrop'] = (slot, movedWidget) => {
    setWidgets(previousWidgets =>
      previousWidgets.map(widget => {
        if (widget.id !== movedWidget.id) {
          return widget;
        }

        const width = movedWidget.colEnd - movedWidget.colStart - 1;
        return { ...movedWidget, ...slot, id: movedWidget.id, colEnd: slot.colEnd + width };
      })
    );
  };
  const handleResizeWidget: GridEmptySlotItem['onDrop'] = (slot, resizedWidget) => {
    setWidgets(previousWidgets =>
      previousWidgets.map(widget => {
        if (widget.id !== resizedWidget.id) {
          return widget;
        }

        return { ...resizedWidget, colEnd: slot.colEnd };
      })
    );
  };

  const gridEmptySlots = getGridEmptySlots(widgetDragging, widgets);
  const gridResizeSlots = getGridResizeSlots(widgetResizing, widgets);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={!canDrag && fullWidth ? classes.gridFullWidgth : classes.grid}>
        {widgets.map(widget => (
          <GridWidgetItem
            key={widget.id}
            widget={widget}
            canDrag={canDrag}
            onDeleted={onWidgetDeleted}
            onDragging={setWidgetDragging}
            onResizing={setWidgetResizing}
            data-testid={dataTestIds.widget(widget).root}
          />
        ))}
        {gridEmptySlots.map(slot => (
          <GridEmptySlotItem
            key={slot.id}
            data-testid={dataTestIds.emptySlot(slot.id).root}
            slot={slot}
            accept="moveWidget"
            onDrop={handleMoveWidget}
          />
        ))}
        {gridResizeSlots.map(slot => (
          <GridEmptySlotItem
            key={slot.id}
            data-testid={dataTestIds.emptySlot(slot.id).root}
            slot={slot}
            accept="resizeWidget"
            onDrop={handleResizeWidget}
          />
        ))}
      </div>
    </DndProvider>
  );
};
