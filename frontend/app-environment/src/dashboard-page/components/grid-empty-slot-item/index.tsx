import { GridEmptySlot, Widget } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';
import { useDrop } from 'react-dnd';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'grid-empty-slot-item-root',
};

export { dataTestIds as dataTestIdsGridEmptySlotItem };

export const getGridEmptySlotItemDataTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export interface GridEmptySlotItem {
  slot: GridEmptySlot;
  onDrop: (slot: GridEmptySlot, widget: Widget) => void;
  accept: 'moveWidget' | 'resizeWidget';
  'data-testid'?: string;
}

export const GridEmptySlotItem: React.FC<GridEmptySlotItem> = ({ slot, onDrop, accept, 'data-testid': dataTestId }) => {
  const dataTestIdsWithPrefix = getGridEmptySlotItemDataTestIds(dataTestId);

  const [{ isOver }, drop] = useDrop<Widget, unknown, { isOver: boolean }>(
    () => ({
      accept,
      drop: item => onDrop(slot, item),
      collect: monitor => ({ isOver: monitor.isOver() }),
      hover: item => {
        if (accept !== 'resizeWidget') {
          return;
        }

        const gridWidgetItemEl = document.querySelector<HTMLDivElement>(`.widget-${item.id}`);
        gridWidgetItemEl.style.gridArea = `${item.rowStart} / ${item.colStart} / ${slot.rowEnd} / ${slot.colEnd}`;
      },
    }),
    [accept, onDrop]
  );

  const classes = useStyles({ isOver: isOver && accept === 'moveWidget' });

  return (
    <div
      ref={node => drop(node)}
      className={classes.gridEmptySlotItem}
      style={{ gridArea: `${slot.rowStart} / ${slot.colStart} / ${slot.rowEnd} / ${slot.colEnd}` }}
      data-testid={dataTestIdsWithPrefix.root}
    />
  );
};
