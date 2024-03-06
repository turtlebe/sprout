import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useLogAxiosErrorInSnackbar, useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { AlertEvent, Metric } from '@plentyag/core/src/types/environment';

export interface UseFetchAlertEvents {
  metric: Metric;
  startDateTime?: Date;
  endDateTime?: Date;
  active?: boolean;
}

/**
 * Fetch AlertEvents if the Metric has AlertRules for the given time window.
 */
export const useFetchAlertEvents = ({
  metric,
  startDateTime,
  endDateTime,
  active,
}: UseFetchAlertEvents): UseSwrAxiosReturn<PaginatedList<AlertEvent>> => {
  const alertRuleIds = metric?.alertRules?.map(alertRule => alertRule.id) || [];
  const queryParams = {
    alertRuleIds,
    includeAlertRule: true,
    sortBy: 'generatedAt',
    order: 'asc',
  };

  const swrAxios = useSwrAxios<PaginatedList<AlertEvent>>(
    alertRuleIds.length > 0 && {
      url: EVS_URLS.alertEvents.listUrl(
        startDateTime && endDateTime && !active
          ? {
              ...queryParams,
              startDateTime: startDateTime.toISOString(),
              endDateTime: endDateTime.toISOString(),
            }
          : {
              ...queryParams,
              activeOnly: active,
            },
        { doNotEncodeArray: true }
      ),
    }
  );

  useLogAxiosErrorInSnackbar(swrAxios.error);

  return swrAxios;
};
