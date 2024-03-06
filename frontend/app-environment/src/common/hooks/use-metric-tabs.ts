import { TabType } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface UseMetricTabs {
  tabType?: string;
  tabId?: string;
}

export interface UseMetricTabsReturn {
  currentTab: string;
  tabType: TabType;
  tabId: string;
  setTab: (type: TabType, id: string) => void;
  getTabId: (type: TabType, id: string) => string;
  parseTabValue: (value: string) => { type: TabType; id: string };
}

export const useMetricTabs = ({ tabType, tabId }: UseMetricTabs = {}): UseMetricTabsReturn => {
  const [currentTabType, setCurrentTabType] = React.useState<TabType>(tabType as TabType);
  const [currentTabId, setCurrentTabId] = React.useState<string>(tabId);

  const getTabId: UseMetricTabsReturn['getTabId'] = (type, id) => {
    if (!type || !id) {
      return undefined;
    }

    return `${type},${id}`;
  };

  const parseTabValue: UseMetricTabsReturn['parseTabValue'] = value => {
    const [type, id] = value.split(',');

    return {
      type: type as TabType,
      id,
    };
  };

  const setTab: UseMetricTabsReturn['setTab'] = (type, id) => {
    setCurrentTabType(type);
    setCurrentTabId(id);
  };

  return {
    currentTab: getTabId(currentTabType, currentTabId),
    tabType: currentTabType,
    tabId: currentTabId,
    getTabId,
    parseTabValue,
    setTab,
  };
};
