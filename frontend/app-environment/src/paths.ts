const BASE_PATH = '/environment-v2';

export const PATHS = {
  alertEventsPage: `${BASE_PATH}/alerts`,
  alertEventsHistoricalPage: `${BASE_PATH}/alerts/all`,
  bulkApplyPage: (redisObjectId: string) => `${BASE_PATH}/bulk-apply/${redisObjectId}`,
  dashboardPage: (dashboardId: string) => `${BASE_PATH}/dashboards/${dashboardId}`,
  dashboardLivePage: (dashboardId: string) => `${BASE_PATH}/dashboards/live/${dashboardId}`,
  dashboardWidgetPage: (dashboardId: string) => `${BASE_PATH}/dashboards/widget/${dashboardId}`,
  dashboardsPage: `${BASE_PATH}/dashboards`,
  favoriteDashboardsPage: `${BASE_PATH}/favorite-dashboards`,
  favoriteMetricsPage: `${BASE_PATH}/favorite-metrics`,
  metricPage: (metricId: string) => `${BASE_PATH}/metrics/${metricId}`,
  metricPageTab: (metricId: string, tabType: string, tabId: string | number) =>
    `${BASE_PATH}/metrics/${metricId}/${tabType}/${tabId}`,
  metricSourcesPage: (metricId: string) => `${BASE_PATH}/metrics/${metricId}/sources`,
  metricsPage: BASE_PATH,
  notificationDetailPage: (notificationEventId: string) => `${BASE_PATH}/notifications/${notificationEventId}`,
  settingsPage: `${BASE_PATH}/settings`,
  schedulePage: (scheduleId: string) => `${BASE_PATH}/schedules/${scheduleId}`,
  schedulesPage: `${BASE_PATH}/schedules`,
  subscriptionsPage: (metricId: string) => `${BASE_PATH}/metrics/${metricId}/subscriptions`,
  subscriptionsPageTab: (metricId: string, tabType: string, tabId: string | number) =>
    `${BASE_PATH}/metrics/${metricId}/subscriptions/${tabType}/${tabId}`,

  /**
   * External links to other applications:
   */
  ignitionTagsPage: (tagPagh: string) =>
    `/ignition-tag-registry?tagPath=filterType-text_type-contains_filter-${tagPagh}`,
  derivedObservationsDefinitionsPage: (observationName: string) =>
    `/derived-observations/derived-observation-definitions?observationName=filterType-text_type-contains_filter-${observationName}`,
  devicePage: (deviceId: string) => `/devices-v2/${deviceId}`,
};
