import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';

import { useStyles } from './styles';

export const OptionTypes = {
  OPTION: 'option',
};

export interface DraggableOptionProps {
  id: any;
  text: string;
  index: number;
  moveOption: (dragIndex: number, hoverIndex: number) => void;
  removeOption: (text: string) => void;
}

interface DragOption {
  index: number;
  id: string;
  type: string;
}

export const DraggableOption: React.FC<DraggableOptionProps> = ({ id, text, index, moveOption, removeOption }) => {
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
      moveOption(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: OptionTypes.OPTION,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));
  return (
    <div ref={ref} className={styles.dndContainer} style={{ opacity }} data-handler-id={handlerId}>
      <DragIndicatorIcon className={styles.dndDragIndicatorIcon} />
      <Typography className={styles.dndText}>{text}</Typography>
      <Tooltip title="Remove definition from trigger" className={styles.dndTooltip}>
        <IconButton aria-label="delete" onClick={() => removeOption(text)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
};
