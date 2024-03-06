import React from 'react';
import { ConnectDragPreview, useDrag, useDrop } from 'react-dnd';

export interface DraggableListItem {
  id: string;
  listItemRenderer: (dragPreview: ConnectDragPreview) => JSX.Element;
  targetIdentifier: string;
  moveListItem: (id: string, to: number) => void;
  findListItem: (id: string) => { index: number };
  onDrop: () => void;
}

interface DragItem {
  id: string;
  originalIndex: number;
}

export const DraggableListItem: React.FC<DraggableListItem> = ({
  id,
  listItemRenderer,
  targetIdentifier,
  moveListItem,
  findListItem,
  onDrop,
}) => {
  const originalIndex = findListItem(id).index;
  const dragItem: DragItem = { id, originalIndex };
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: targetIdentifier,
      item: dragItem,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (didDrop) {
          onDrop();
        } else {
          // move back to original position, was dropped out of bounds.
          moveListItem(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveListItem]
  );

  const [, drop] = useDrop(
    () => ({
      accept: targetIdentifier,
      hover({ id: draggedId }: DragItem) {
        if (draggedId !== id) {
          const { index: overIndex } = findListItem(id);
          moveListItem(draggedId, overIndex);
        }
      },
    }),
    [findListItem, moveListItem]
  );

  const opacity = isDragging ? 0 : 1;

  return (
    <div ref={node => drag(drop(node))} style={{ opacity }}>
      {listItemRenderer(dragPreview)}
    </div>
  );
};
