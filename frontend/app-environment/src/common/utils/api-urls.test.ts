import { buildMetric } from '../test-helpers';

import {
  EVS_URLS,
  getScheduleDefinitionUrl,
  getSearchMeasurementTypesUrl,
  getSearchObservationSelectorsUrl,
  getSearchObservationStatsUrl,
} from './api-urls';

const metric = buildMetric({});
const id = metric.id;

describe('EVS_URLS', () => {
  it('returns CRUD URLs for metrics', () => {
    expect(EVS_URLS.metrics.createUrl()).toBe('/api/swagger/environment-service/metrics-api/create-metric');
    expect(EVS_URLS.metrics.getByIdUrl(id)).toBe(`/api/swagger/environment-service/metrics-api/get-metric-by-id/${id}`);
    expect(EVS_URLS.metrics.listUrl()).toBe('/api/swagger/environment-service/metrics-api/list-metrics');
    expect(EVS_URLS.metrics.searchUrl()).toBe('/api/swagger/environment-service/metrics-api/search-metrics');
    expect(EVS_URLS.metrics.updateUrl(id)).toBe(`/api/swagger/environment-service/metrics-api/update-metric/${id}`);
    expect(EVS_URLS.metrics.updateUrl(metric)).toBe(`/api/swagger/environment-service/metrics-api/update-metric/${id}`);
    expect(EVS_URLS.metrics.deleteUrl(id)).toBe(`/api/swagger/environment-service/metrics-api/delete-metric/${id}`);
    expect(EVS_URLS.metrics.deleteUrl(metric)).toBe(`/api/swagger/environment-service/metrics-api/delete-metric/${id}`);
  });

  it('supports query parameters on GET endpoints', () => {
    expect(EVS_URLS.metrics.getByIdUrl(id, { key1: 'value1', key2: 'value2' })).toBe(
      `/api/swagger/environment-service/metrics-api/get-metric-by-id/${id}?key1=value1&key2=value2`
    );
    expect(EVS_URLS.metrics.listUrl({ key3: 'value3' })).toBe(
      '/api/swagger/environment-service/metrics-api/list-metrics?key3=value3'
    );
  });

  it('handles nulls on get/update/delete endpoints', () => {
    expect(EVS_URLS.metrics.getByIdUrl(null)).toBe(null);
    expect(EVS_URLS.metrics.updateUrl(null)).toBe(null);
    expect(EVS_URLS.metrics.deleteUrl(null)).toBe(null);
  });
});

describe('custom URLs', () => {
  it('returns URLs for ODS, FDS', () => {
    expect(getScheduleDefinitionUrl('sites/SSF2')).toBe(
      '/api/swagger/farm-def-service/objects-v3-api/get-object-by-path2/sites/SSF2?depth=0'
    );
    expect(getSearchObservationSelectorsUrl()).toBe(
      '/api/swagger/farm-def-service/mappings-api/search-observation-selectors'
    );
    expect(getSearchObservationSelectorsUrl({ foo: 'bar' })).toBe(
      '/api/swagger/farm-def-service/mappings-api/search-observation-selectors?foo=bar'
    );
    expect(getSearchMeasurementTypesUrl()).toBe('/api/plentyservice/farm-def-service/search-measurement-types');
    expect(getSearchObservationStatsUrl()).toBe(
      '/api/swagger/observation-digest-service/observation-stats-api/search-observation-stats'
    );
  });
});
