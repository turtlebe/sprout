import {
  AlertEvent,
  AlertRule,
  Dashboard,
  DefaultModel,
  Metric,
  NotificationEvent,
  Schedule,
  Subscription,
  UsersDashboard,
  UsersMetric,
  Widget,
} from '@plentyag/core/src/types/environment';
import { toQueryParams, ToQueryParamsOptions } from '@plentyag/core/src/utils';

/**
 * /!\/!\ EnvironmentService endpoints /!\/!\
 */
const EVS_SWAGGER_PREFIX = '/api/swagger/environment-service';

/** Generic function to create all default CRUD URLs for a given Entity. */
function getCrudUrls<T extends DefaultModel>(entityName: string) {
  const apiName = `${entityName}s-api`;

  const getId = (entityOrId: T | string): string =>
    entityOrId ? (typeof entityOrId === 'string' ? entityOrId : entityOrId.id) : '';

  return {
    /**
     * Create URL
     */
    createUrl: () => `${EVS_SWAGGER_PREFIX}/${apiName}/create-${entityName}`,

    /**
     * Get by ID URL
     */
    getByIdUrl: (entityId: string, queryParams?: any, toQueryParamsOptions?: ToQueryParamsOptions) =>
      entityId
        ? `${EVS_SWAGGER_PREFIX}/${apiName}/get-${entityName}-by-id/${entityId}${toQueryParams(
            queryParams,
            toQueryParamsOptions
          )}`
        : null,

    /**
     * Update URL
     */
    updateUrl: (entityOrId: T | string) =>
      entityOrId ? `${EVS_SWAGGER_PREFIX}/${apiName}/update-${entityName}/${getId(entityOrId)}` : null,

    /**
     * GET Search endpoint URL
     */
    listUrl: (queryParams?: any, toQueryParamsOptions?: ToQueryParamsOptions) =>
      `${EVS_SWAGGER_PREFIX}/${apiName}/list-${entityName}s${toQueryParams(queryParams, toQueryParamsOptions)}`,

    /**
     * POST Search endpoint URL
     */
    searchUrl: () => `${EVS_SWAGGER_PREFIX}/${apiName}/search-${entityName}s`,

    /**
     * DELETE endpoint URL
     */
    deleteUrl: (entityOrId: T | string) =>
      entityOrId ? `${EVS_SWAGGER_PREFIX}/${apiName}/delete-${entityName}/${getId(entityOrId)}` : null,
  };
}

export const EVS_URLS = {
  metrics: {
    ...getCrudUrls<Metric>('metric'),

    /**
     * Copy one Metric to other Metrics.
     */
    bulkApplyUrl: () => `${EVS_SWAGGER_PREFIX}/metrics-api/bulk-apply`,
  },

  alertRules: {
    ...getCrudUrls<AlertRule>('alert-rule'),

    /**
     * Override create endpoint with custom Sprout python endpoint.
     */
    createUrl: () => '/api/environment-v2/alert-rules',

    /**
     * Bulk update Alert Rules
     */
    bulkUpdateUrl: () => `${EVS_SWAGGER_PREFIX}/alert-rules-api/update-alert-rules`,
  },

  subscriptions: getCrudUrls<Subscription>('subscription'),

  schedules: {
    ...getCrudUrls<Schedule>('schedule'),

    /**
     * Copy one Schedule configuration to other Schedules.
     */
    bulkApplyUrl: () => `${EVS_SWAGGER_PREFIX}/schedules-api/bulk-apply1`,

    /**
     * Custom Sprout endpoint to fetch a Schedule based on a Metric.
     */
    relatedScheduleUrl: (metric: Metric) =>
      `/api/environment-v2/related-schedule${toQueryParams({
        path: metric.path,
        measurementType: metric.measurementType,
        observationName: metric.observationName,
      })}`,
  },

  dashboards: getCrudUrls<Dashboard>('dashboard'),

  widgets: getCrudUrls<Widget>('widget'),

  alertEvents: getCrudUrls<AlertEvent>('alert-event'),

  notificationEvents: getCrudUrls<NotificationEvent>('notification-event'),

  usersMetrics: {
    ...getCrudUrls<UsersMetric>('users-metric'),

    /**
     * Non-Standard Create/Delete URLs
     */
    createUrl: () => `${EVS_SWAGGER_PREFIX}/users-metrics-api/mark-metric-as-favorite`,
    deleteUrl: (metric: Metric) => `${EVS_SWAGGER_PREFIX}/users-metrics-api/delete-metric-from-favorite/${metric?.id}`,
  },

  usersDashboards: {
    ...getCrudUrls<UsersDashboard>('users-dashboard'),

    /**
     * Non-Standard Create/Delete URLs
     */
    createUrl: () => `${EVS_SWAGGER_PREFIX}/users-dashboards-api/mark-dashboard-as-favorite`,
    deleteUrl: (dashboard: Dashboard) =>
      `${EVS_SWAGGER_PREFIX}/users-dashboards-api/delete-dashboard-from-favorite/${dashboard?.id}`,
  },
};

/**
 * /!\/!\ FarmDefService endpoints /!\/!\
 */
export const getScheduleDefinitionUrl = (path: string) =>
  `/api/swagger/farm-def-service/objects-v3-api/get-object-by-path2/${path}?depth=0`;

export const getSearchObservationSelectorsUrl = (queryParams?: any) =>
  `/api/swagger/farm-def-service/mappings-api/search-observation-selectors${toQueryParams(queryParams)}`;

export const getSearchMeasurementTypesUrl = () => '/api/plentyservice/farm-def-service/search-measurement-types';

/**
 * /!\/!\ ObservationDigestService endpoints /!\/!\
 */
export const getSearchObservationStatsUrl = () =>
  '/api/swagger/observation-digest-service/observation-stats-api/search-observation-stats';
