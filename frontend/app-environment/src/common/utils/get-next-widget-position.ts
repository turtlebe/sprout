import { GridEmptySlot, Widget } from '@plentyag/core/src/types/environment';

export function getNextWidgetPosition(widgets: Widget[]): GridEmptySlot {
  const rowEnds = widgets?.map(widget => widget.rowEnd) || [];
  const lastRowEnd = rowEnds.length ? Math.max(...rowEnds) : 1;

  return {
    rowStart: lastRowEnd,
    colStart: 1,
    rowEnd: lastRowEnd + 1,
    colEnd: 2,
  };
}
