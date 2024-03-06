import { SearchFields, SearchResult } from '@plentyag/app-perception/src/common/types/interfaces';
import { axiosRequest } from '@plentyag/core/src/utils/request';

const url = '/api/perception/search';

/**
 * Check if the query value is a comma separated list, if it is use the 'in' filter otherwise
 * use 'icontains' filter
 *
 * @param param query param
 * @param value query value
 */
function getQueryParam(param: string, value: string) {
  if (value?.includes(',')) {
    return `${param}__in=${value}`;
  }
  return `${param}=${value}`;
}

/**
 * Translate search fields into query params used by the backend perception object service
 *
 * @param searchFields search fields object comming from the search form
 * @param page the page of search results to return (pages of 100 results)
 */
function buildSearchUrl(searchFields: SearchFields, page: number) {
  const searchUrl = [];

  searchFields?.startTime && searchUrl.push(`dt_utc__gte=${new Date(searchFields.startTime).toISOString()}`);
  searchFields?.endTime && searchUrl.push(`dt_utc__lte=${new Date(searchFields.endTime).toISOString()}`);
  searchFields?.site && searchUrl.push(getQueryParam('site', searchFields.site));
  searchFields?.area && searchUrl.push(getQueryParam('area', searchFields.area));
  searchFields?.line && searchUrl.push(getQueryParam('line', searchFields.line));
  searchFields?.machine && searchUrl.push(getQueryParam('machine', searchFields.machine));
  searchFields?.owner && searchUrl.push(getQueryParam('owner', searchFields.owner));
  searchFields?.containerID && searchUrl.push(getQueryParam('container_id', searchFields.containerID));
  searchFields?.deviceSerial && searchUrl.push(getQueryParam('device__device_serial', searchFields.deviceSerial));
  searchFields?.tags && searchUrl.push(getQueryParam('object_tag__tag_id__name', searchFields.tags));
  searchFields?.labels && searchUrl.push(getQueryParam('label_set__label__label', searchFields.labels));
  searchFields?.trialNumber && searchUrl.push(getQueryParam('trial__trial_num', searchFields.trialNumber));
  searchFields?.treatmentNumber && searchUrl.push(getQueryParam('trial__treatment_num', searchFields.treatmentNumber));
  searchFields?.advancedSearch && searchUrl.push(...searchFields.advancedSearch.split(','));
  page && searchUrl.push(`page=${page}`);

  return searchUrl.join('&');
}

interface FetchSearchResult {
  data: {
    results: SearchResult[];
    count: number;
  };
}

/**
 * Fetch the search results from the perception object service that meet th filter
 * criteria based on the search fields input from the user
 *
 * @param searchFields search fields object comming from the search form
 * @param page the page of search results to return (pages of 100 results)
 */
export async function fetchSearchResults(searchFields: SearchFields, page: number) {
  let searchUrl = url;
  const queryString = buildSearchUrl(searchFields, page);
  if (queryString && queryString !== '') {
    searchUrl += '?' + queryString;
  }

  const result = await axiosRequest<FetchSearchResult>({ method: 'GET', url: searchUrl });
  return result;
}
