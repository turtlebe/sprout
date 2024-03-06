import { TabType } from '@plentyag/core/src/types/environment';
import { act, renderHook } from '@testing-library/react-hooks';

import { useMetricTabs } from '.';

const id = 'mock-id';

describe('useMetricTabs', () => {
  it('returns undefined as the current tab by default', () => {
    const { result } = renderHook(() => useMetricTabs());

    expect(result.current.currentTab).toBeUndefined();
    expect(result.current.tabType).toBeUndefined();
    expect(result.current.tabId).toBeUndefined();
    expect(result.current.getTabId).toBeDefined();
    expect(result.current.setTab).toBeDefined();
    expect(result.current.parseTabValue).toBeDefined();
  });

  it('returns the tab type and tab id', () => {
    const { result } = renderHook(() => useMetricTabs());

    act(() => result.current.setTab(TabType.alertRule, id));

    expect(result.current.currentTab).toBe(`${TabType.alertRule},${id}`);
    expect(result.current.currentTab).toBe(result.current.getTabId(TabType.alertRule, id));
    expect(result.current.tabType).toBe(TabType.alertRule);
    expect(result.current.tabId).toBe(id);
    expect(result.current.parseTabValue(result.current.currentTab)).toEqual({ type: TabType.alertRule, id });
  });

  it('initializes the hook', () => {
    const { result } = renderHook(() => useMetricTabs({ tabType: TabType.alertRule, tabId: id }));

    expect(result.current.currentTab).toBe(`${TabType.alertRule},${id}`);
    expect(result.current.currentTab).toBe(result.current.getTabId(TabType.alertRule, id));
    expect(result.current.tabType).toBe(TabType.alertRule);
    expect(result.current.tabId).toBe(id);
    expect(result.current.parseTabValue(result.current.currentTab)).toEqual({ type: TabType.alertRule, id });
  });
});
