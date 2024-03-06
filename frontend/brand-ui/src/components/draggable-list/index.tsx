import { cloneDeep } from 'lodash';
import React from 'react';
import { ConnectDragPreview, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDeepCompareEffect } from 'react-use';

import { DraggableListItem } from './draggable-list-item';

const dataTestIds = {};

export { dataTestIds as dataTestIdsDraggableList };

interface BaseListItem {
  id: string; // all list items must include an id to unique identify each list item.
}

export type DraggableListItemRenderer<T> = (listItem: T, index: number, dragPreview: ConnectDragPreview) => JSX.Element;

export interface DraggableList<T> {
  /**
   * Data for items in the list.
   */
  listItems: T[];
  /**
   * Function that will render an individual item in the list.
   */
  listItemRenderer: DraggableListItemRenderer<T>;
  /**
   * Should uniquely identify this list.
   */
  targetIdentifier: string;
  /**
   * When a successfull drop occurs this callback will be invoked with the new list.
   */
  onDrop?: (listItems: T[]) => void;
}

/**
 * Component that uses react-drag-and-drop library to support re-ordering list items.
 * The code here is adapted from example here: https://react-dnd.github.io/react-dnd/examples/sortable/cancel-on-drop-outside
 */
export function DraggableList<T extends BaseListItem>({
  listItems,
  listItemRenderer,
  targetIdentifier,
  onDrop,
}: DraggableList<T>): React.ReactElement {
  const [listIemsInternal, setListItemsInternal] = React.useState<T[]>(listItems);

  useDeepCompareEffect(() => {
    setListItemsInternal(listItems);
  }, [listItems]);

  const findListItem = React.useCallback(
    (id: string) => {
      const listItem = listIemsInternal.filter(c => `${c.id}` === id)[0];
      return {
        listItem,
        index: listIemsInternal.indexOf(listItem),
      };
    },
    [listIemsInternal]
  );

  const moveListItem = React.useCallback(
    (id: string, atIndex: number) => {
      const { listItem, index } = findListItem(id);
      const newListItems = cloneDeep(listIemsInternal);
      newListItems.splice(index, 1);
      newListItems.splice(atIndex, 0, listItem);
      setListItemsInternal(newListItems);
    },
    [findListItem, listIemsInternal, setListItemsInternal]
  );

  const renderListItemInternal = (listItem: T, index: number) => {
    return (
      <DraggableListItem
        key={listItem.id}
        onDrop={() => onDrop && onDrop(listIemsInternal)}
        listItemRenderer={dragPreview => listItemRenderer(listItem, index, dragPreview)}
        targetIdentifier={targetIdentifier}
        id={listItem.id}
        moveListItem={moveListItem}
        findListItem={findListItem}
      />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {listIemsInternal.map((listItem, index) => renderListItemInternal(listItem, index))}
    </DndProvider>
  );
}
