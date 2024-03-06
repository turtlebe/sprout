import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { TreeItem, TreeView } from '@material-ui/lab';
import { getFormattedObjectKey, getFormattedObjectValue } from '@plentyag/core/src/utils';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import React from 'react';

const dataTestIds = {
  root: 'object-tree-view-root',
};

export { dataTestIds as dataTestIdsObjectTreeView };

interface ObjectIndexType {
  [key: string]: any;
}

export interface ObjectTreeView {
  object: ObjectIndexType;
  formatValue?: boolean;
  treeViewClassName?: string;
  treeViewItemClassName?: string;
}

/**
 * This component displays the given object in a tree view.
 * It will display strings, booleans, dates, numbers, arrays
 * and nested objects. If 'formatValue' is true then the key and
 * value will be "pretty" formatted. Ex: date values will be formatted to be
 * human readable.
 */
export const ObjectTreeView: React.FC<ObjectTreeView> = ({
  object,
  formatValue,
  treeViewClassName,
  treeViewItemClassName,
}) => {
  if (!object || Object.keys(object).length === 0) {
    return null;
  }

  const getTreeViewItems = (object: ObjectIndexType) => {
    return Object.keys(object).map(key => {
      const value = object[key];
      const id = uuidv4();
      const displayKey = Array.isArray(object) ? `Index ${key}` : formatValue ? getFormattedObjectKey(key) : key;

      if (Array.isArray(value)) {
        return (
          <TreeItem
            className={treeViewItemClassName}
            nodeId={id}
            key={id}
            label={value.length === 0 ? `${displayKey} (Array): empty` : `${displayKey} (Array)`}
            children={getTreeViewItems(value)}
          />
        );
      }

      if (value && typeof value === 'object') {
        const isEmptyObject = Object.keys(value).length === 0;
        return (
          <TreeItem
            className={treeViewItemClassName}
            nodeId={id}
            key={id}
            label={
              isEmptyObject
                ? `${formatValue ? getFormattedObjectKey(displayKey) : displayKey}: empty object`
                : `${displayKey}`
            }
            children={getTreeViewItems(value)}
          />
        );
      }

      let displayValue = typeof value === 'string' && value.length === 0 ? 'empty string' : value;
      if (formatValue) {
        displayValue = getFormattedObjectValue(displayValue);
      }

      return (
        <TreeItem className={treeViewItemClassName} nodeId={id} key={id} label={`${displayKey}: ${displayValue}`} />
      );
    });
  };

  return (
    <TreeView
      className={treeViewClassName}
      data-testid={dataTestIds.root}
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
    >
      {getTreeViewItems(object)}
    </TreeView>
  );
};
