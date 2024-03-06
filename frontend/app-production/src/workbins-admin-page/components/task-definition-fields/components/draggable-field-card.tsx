import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Chip, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';

import { useStyles } from '../styles';

const dataTestIds = {
  delete: 'draggable-field-card-delete',
};

export { dataTestIds as dataTestIdsDraggableFieldCard };

export const OptionTypes = {
  OPTION: 'option',
};

export interface DraggableFieldCardProps {
  fieldName: string;
  fieldType: string;
  isRequired: boolean;
  index: number;
  moveFieldCard: (dragIndex: number, hoverIndex: number) => void;
  removeFieldCard: (text: string) => void;
  disabled: boolean;
}

interface DragOption {
  index: number;
  id: string;
  type: string;
}

/*
Renders a workbin task definition field in a card component that is draggable thus allowing
users to easily re-order the fields using drag'n'drop.
*/
export const DraggableFieldCard: React.FC<DraggableFieldCardProps> = ({
  fieldName,
  fieldType,
  isRequired,
  index,
  moveFieldCard,
  removeFieldCard,
  disabled,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const styles = useStyles();

  const [{ handlerId }, drop] = useDrop({
    accept: OptionTypes.OPTION,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragOption, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveFieldCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: OptionTypes.OPTION,
    item: () => {
      return { fieldName, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !disabled,
  });
  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));
  return (
    <div ref={ref} className={styles.dndContainer} style={{ opacity }} data-handler-id={handlerId}>
      <DragIndicatorIcon className={styles.dndDragIndicatorIcon} />
      <Chip label={`Name: ${fieldName}`} className={styles.fieldName} variant="outlined" />
      <Chip label={fieldType} className={styles.fieldType} variant="outlined" />
      <Chip label={isRequired ? 'Required' : 'Optional'} className={styles.fieldRequired} variant="outlined" />

      <IconButton
        data-testid={dataTestIds.delete}
        disabled={disabled}
        aria-label="delete"
        onClick={() => removeFieldCard(fieldName)}
      >
        <Tooltip title="Remove field from definition" className={styles.dndTooltip}>
          <DeleteIcon fontSize="small" />
        </Tooltip>
      </IconButton>
    </div>
  );
};
