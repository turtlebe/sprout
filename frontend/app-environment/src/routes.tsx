import { SideNavLayout } from '@plentyag/brand-ui/src/components';
import { TabType } from '@plentyag/core/src/types/environment';

import { AlertEventsHistoricalPage } from './alert-events-historical-page';
import { AlertEventsPage } from './alert-events-page';
import { BulkApplyPage } from './bulk-apply-page';
import { DashboardPage } from './dashboard-page';
import { DashboardsPage } from './dashboards-page';
import { FavoriteDashboardsPage } from './favorite-dashboards-page';
import { FavoriteMetricsPage } from './favorite-metrics-page';
import { MetricPage } from './metric-page';
import { MetricSourcesPage } from './metric-sources-page';
import { MetricsPage } from './metrics-page';
import { NotificationEventPage } from './notification-event-page';
import { PATHS } from './paths';
import { SchedulePage } from './schedule-page';
import { SchedulesPage } from './schedules-page';
import { SettingsPage } from './settings-page';
import { SubscriptionsPage } from './subscriptions-page';

/**
 * Declare all react-router-dom Route and their associated Component.
 *
 * This mapping is used in app-environment/index.tsx and required for using @plentya/brand-ui/src/components/side-nav-layout
 */
export const environmentRoutes: SideNavLayout['routes'] = {
  AlertEvents: {
    path: PATHS.alertEventsPage,
    component: AlertEventsPage,
  },
  AlertEventsHistorical: {
    path: PATHS.alertEventsHistoricalPage,
    component: AlertEventsHistoricalPage,
  },
  BulkApply: {
    path: PATHS.bulkApplyPage(':redisObjectId'),
    component: BulkApplyPage,
  },
  DashboardsPage: {
    path: PATHS.dashboardsPage,
    component: DashboardsPage,
  },
  DashboardPage: {
    path: [
      PATHS.dashboardPage(':dashboardId'),
      PATHS.dashboardLivePage(':dashboardId'),
      PATHS.dashboardWidgetPage(':dashboardId'),
    ],
    component: DashboardPage,
  },
  FavoriteDashboardsPage: {
    path: PATHS.favoriteDashboardsPage,
    component: FavoriteDashboardsPage,
  },
  FavoriteMetricsPage: {
    path: PATHS.favoriteMetricsPage,
    component: FavoriteMetricsPage,
  },
  MetricsPage: {
    path: PATHS.metricsPage,
    component: MetricsPage,
  },
  MetricPage: {
    path: [
      PATHS.metricPage(':metricId'),
      PATHS.metricPageTab(':metricId', `:tabType(${Object.values(TabType).join('|')})`, ':tabId'),
    ],
    component: MetricPage,
  },
  MetricSourcesPage: {
    path: PATHS.metricSourcesPage(':metricId'),
    component: MetricSourcesPage,
  },
  NotificationEventPage: {
    path: PATHS.notificationDetailPage(':notificationEventId'),
    component: NotificationEventPage,
  },
  SchedulesPage: {
    path: PATHS.schedulesPage,
    component: SchedulesPage,
  },
  SchedulePage: {
    path: PATHS.schedulePage(':scheduleId'),
    component: SchedulePage,
  },
  SettingsPage: {
    path: PATHS.settingsPage,
    component: SettingsPage,
  },
  SubscriptionPage: {
    path: [
      PATHS.subscriptionsPage(':metricId'),
      PATHS.subscriptionsPageTab(':metricId', `:tabType(${Object.values(TabType).join('|')})`, ':tabId'),
    ],
    component: SubscriptionsPage,
  },
};
