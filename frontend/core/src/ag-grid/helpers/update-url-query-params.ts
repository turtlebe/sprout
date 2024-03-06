import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import * as H from 'history';

/**
 * Sets the url search to the new provided query parameters.
 * If the optional "keepQueryParams" is provided then any query parameter
 * with a matching key will be kept and not touched by the update.
 * @param history The browser history instance that will be updated.
 * @param newQueryParams The new query parameters to set.
 * @param keepQueryParams Optional array of query parameter names not to touch during the update.
 */
export function updateUrlQueryParams({
  history,
  newQueryParams,
  keepQueryParams = [],
}: {
  history: H.History<any>;
  newQueryParams: { [key: string]: any };
  keepQueryParams?: string[];
}) {
  const params = new URLSearchParams(history.location.search);
  const preservedQueryParameters = {};
  params.forEach((value, key) => {
    if (keepQueryParams.includes(key)) {
      preservedQueryParameters[key] = value;
    }
  });

  history.push({
    search: toQueryParams({ ...newQueryParams, ...preservedQueryParameters }),
  });
}
