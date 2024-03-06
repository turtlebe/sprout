import { GridEmptySlot, Widget } from '@plentyag/core/src/types/environment';
import { isEqual, uniqWith } from 'lodash';

import { isOverlapping } from './is-overlapping';

/**
 * Calculate all the empty slot that a widget can be resized in.
 */
export function getGridResizeSlots(currentWidget: Widget, widgets: Widget[]): GridEmptySlot[] {
  if (!currentWidget) {
    return [];
  }

  const { rowStart, rowEnd } = currentWidget;
  const minColStart = currentWidget.colStart;
  const maxColEnd = Math.max(...widgets.map(widget => widget.colEnd)) + 1;
  const widgetsWithoutCurrent = widgets.filter(widget => widget.id !== currentWidget.id);

  const gridResizeSlots: GridEmptySlot[] = [];

  for (let col = minColStart; col < maxColEnd; col++) {
    const slot: GridEmptySlot = {
      id: `${rowStart}${col}${rowEnd}${col + 1}`,
      rowStart,
      colStart: col,
      rowEnd,
      colEnd: col + 1,
    };

    // exit the loop if any widget overlap on any of the resize slot
    if (widgetsWithoutCurrent.some(widget => isOverlapping(slot, widget))) {
      break;
    }

    gridResizeSlots.push(slot);
  }

  return uniqWith(gridResizeSlots, isEqual);
}
