import { GridEmptySlot, Widget } from '@plentyag/core/src/types/environment';
import { isEqual, uniqWith } from 'lodash';

import { isOverlapping } from './is-overlapping';

/**
 * Calculate all the empty slot in the grid based on the widgets positioned in the grid.
 */
export function getGridEmptySlots(currentWidget: Widget, widgets: Widget[]): GridEmptySlot[] {
  if (!currentWidget) {
    return [];
  }

  // the beginning of a CSS grid starts at 1
  const minRowStart = 1;
  const minColStart = 1;
  // the last row/col should be one row after the highest row/col
  const maxRowEnd = Math.max(...widgets.map(widget => widget.rowEnd)) + 1;
  const maxColEnd = Math.max(...widgets.map(widget => widget.colEnd)) + 1;

  const gridEmptySlots: GridEmptySlot[] = [];

  for (let row = minRowStart; row < maxRowEnd; row++) {
    for (let col = minColStart; col < maxColEnd; col++) {
      // iterate over each position in the grid
      const slot: GridEmptySlot = {
        id: `${row}${col}${row + 1}${col + 1}`,
        rowStart: row,
        colStart: col,
        rowEnd: row + 1,
        colEnd: col + 1,
      };

      // if no widgets overlap with this position in the grid, then it is available
      if (widgets.every(widget => !isOverlapping(slot, widget))) {
        gridEmptySlots.push(slot);
      }
    }
  }

  return uniqWith(gridEmptySlots, isEqual);
}
