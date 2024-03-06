import { Metric, Schedule, Widget, WidgetItem } from '@plentyag/core/src/types/environment';
import { isMetric } from '@plentyag/core/src/types/environment/type-guards';
import React from 'react';

export interface UseWidgetItemHandlers {
  widget: Widget;
}

export interface UseWidgetItemHandlersReturn {
  items: WidgetItem[];
  setItems: React.Dispatch<React.SetStateAction<WidgetItem[]>>;
  addItem: (metricOrSchedule: Metric | Schedule, options?: {}) => void;
  deleteItem: (item: WidgetItem) => void;
  editItem: (item: WidgetItem, metricOrSchedule: Metric | Schedule, options?: {}) => void;
}

export const useWidgetItemHandlers = ({ widget }: UseWidgetItemHandlers): UseWidgetItemHandlersReturn => {
  const [items, setItems] = React.useState<WidgetItem[]>(widget.items);

  React.useEffect(() => {
    setItems(widget.items);
  }, [widget.items]);

  const addItem: UseWidgetItemHandlersReturn['addItem'] = (metricOrSchedule, options = {}) => {
    const itemType = isMetric(metricOrSchedule) ? 'METRIC' : 'SCHEDULE';
    setItems(previousItems => [
      ...previousItems,
      {
        widgetId: widget.id,
        itemId: metricOrSchedule.id,
        itemType,
        [itemType.toLowerCase()]: metricOrSchedule,
        options,
        // these attributes are empty because they'll be added by the backend.
        id: `new-item-${previousItems.length}`,
        createdAt: '',
        createdBy: '',
        updatedAt: '',
        updatedBy: '',
      },
    ]);
  };

  const deleteItem: UseWidgetItemHandlersReturn['deleteItem'] = deletedItem => {
    setItems(items.filter(item => item.id !== deletedItem.id));
  };

  const editItem: UseWidgetItemHandlersReturn['editItem'] = (editedItem, metricOrSchedule, options = {}) => {
    const itemType = isMetric(metricOrSchedule) ? 'METRIC' : 'SCHEDULE';
    const newItem: WidgetItem = {
      ...editedItem,
      options,
      itemId: metricOrSchedule.id,
      itemType,
      [itemType.toLowerCase()]: metricOrSchedule,
    };
    setItems(
      items.map(item => {
        if (item.id === editedItem.id) {
          return newItem;
        }

        return item;
      })
    );
  };

  return {
    items,
    setItems,
    addItem,
    deleteItem,
    editItem,
  };
};
