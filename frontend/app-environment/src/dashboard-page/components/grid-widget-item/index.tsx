import { Widget, WidgetType } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { DropdownWidget, WidgetHistorical, WidgetLiveGroup, WidgetLiveMetric } from '..';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'grid-widget-item-root',
  move: 'grid-widget-item-move',
  resize: 'grid-widget-item-resize',
  card: 'grid-widget-item-card',
};

export { dataTestIds as dataTestIdsGridWidgetItem };

export const getGridWidgetItemDataTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export interface GridWidgetItem {
  widget: Widget;
  canDrag: boolean;
  onDeleted: DropdownWidget['onWidgetDeleted'];
  onDragging: (widget: Widget) => void;
  onResizing: (widget: Widget) => void;
  'data-testid'?: string;
}

export const GridWidgetItem: React.FC<GridWidgetItem> = ({
  widget,
  canDrag,
  onDeleted,
  onDragging,
  onResizing,
  'data-testid': dataTestId,
}) => {
  const dataTestIdsWithPrefix = getGridWidgetItemDataTestIds(dataTestId);
  const classes = useStyles({ canDrag });
  const [{ isDragging: isMoveDragging }, dragMove] = useDrag(
    () => ({
      type: 'moveWidget',
      item: widget,
      collect: monitor => ({ isDragging: monitor.isDragging() }),
      canDrag,
    }),
    [widget, canDrag]
  );
  const [{ isDragging: isResizeDragging }, dragResize, resizePreview] = useDrag(
    () => ({
      type: 'resizeWidget',
      item: widget,
      collect: monitor => ({ isDragging: monitor.isDragging() }),
      canDrag,
    }),
    [widget, canDrag]
  );

  // react-dnd code that makes the preview disappear for the resizing drag handler.
  React.useEffect(() => {
    resizePreview(getEmptyImage(), {});
  }, []);

  React.useEffect(() => {
    onDragging(isMoveDragging ? widget : undefined);
  }, [widget, isMoveDragging, onDragging]);
  React.useEffect(() => {
    onResizing(isResizeDragging ? widget : undefined);
  }, [widget, isResizeDragging, onResizing]);

  return (
    <div
      style={{
        position: 'relative',
        gridArea: `${widget.rowStart} / ${widget.colStart} / ${widget.rowEnd} / ${widget.colEnd}`,
      }}
      className={`widget-${widget.id}`}
    >
      <div
        className={classes.moveHandle}
        ref={node => canDrag && dragMove(node)}
        data-testid={dataTestIdsWithPrefix.move}
      >
        {widget.widgetType === WidgetType.liveMetric && <WidgetLiveMetric widget={widget} onDeleted={onDeleted} />}
        {widget.widgetType === WidgetType.liveGroup && <WidgetLiveGroup widget={widget} onDeleted={onDeleted} />}
        {widget.widgetType === WidgetType.historical && <WidgetHistorical widget={widget} onDeleted={onDeleted} />}
      </div>
      <div
        className={classes.resizeHandle}
        ref={node => canDrag && dragResize(node)}
        data-testid={dataTestIdsWithPrefix.resize}
      />
    </div>
  );
};
