import { Metric, Schedule, Widget, WidgetItem, WidgetType } from '@plentyag/core/src/types/environment';
import { isMetric } from '@plentyag/core/src/types/environment/type-guards';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import { uniqueId } from 'lodash';

export interface BuildWidget {
  widgetType?: WidgetType;
  name?: string;
  dashboardId?: string;
  rowStart?: number;
  colStart?: number;
  rowEnd?: number;
  colEnd?: number;
  items?: WidgetItem[];
}

export const buildWidget = ({
  dashboardId = uniqueId(),
  widgetType = WidgetType.historical,
  name = 'TestWidget',
  rowStart = 1,
  colStart = 1,
  rowEnd = 2,
  colEnd = 2,
  items = [],
}: BuildWidget): Widget => {
  return {
    dashboardId,
    widgetType,
    name,
    rowStart,
    colStart,
    rowEnd,
    colEnd,
    items,
    createdAt: '2021-09-21T14:28:38.740039Z',
    createdBy: 'llee',
    id: uniqueId(),
    updatedAt: '2021-09-21T14:28:38.740039Z',
    updatedBy: 'llee',
  };
};

const defaultAttributes = {
  widgetId: uuidv4(),
  createdBy: 'olittle',
  updatedBy: 'olittle',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function buildWidgetItem(item: Metric | Schedule, options = {}): WidgetItem {
  if (isMetric(item)) {
    return { ...defaultAttributes, id: uuidv4(), itemId: item.id, itemType: 'METRIC', metric: item, options };
  } else {
    return { ...defaultAttributes, id: uuidv4(), itemId: item.id, itemType: 'SCHEDULE', schedule: item, options };
  }
}
