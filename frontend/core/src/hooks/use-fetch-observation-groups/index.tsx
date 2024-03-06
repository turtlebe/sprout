import { useSwrAxios } from '@plentyag/core/src/hooks';
import { ObservationGroup } from '@plentyag/core/src/types';
import React from 'react';

const SEARCH_OBSERVATION_GROUPS_URL =
  '/api/swagger/observation-digest-service/observation-groups-api/search-observation-groups';

export interface UseFetchObservationGroupsReturn {
  observationGroups: ObservationGroup[];
  isLoading: boolean;
}

/**
 * Simple hook to fetch and cache (for 30 minutes) ObservationGroups from ODS.
 */
export const useFetchObservationGroups = (fetchData = true): UseFetchObservationGroupsReturn => {
  const [observationGroups, setObservationGroups] = React.useState<ObservationGroup[]>();
  const { data, isValidating: isLoading } = useSwrAxios<ObservationGroup[]>(
    fetchData && { url: SEARCH_OBSERVATION_GROUPS_URL },
    { dedupingInterval: 60000 * 30 }
  );

  React.useEffect(() => {
    if (data) {
      setObservationGroups(data);
    }
  }, [data]);

  return {
    // "?? data" because there is a chance the data is already cached by useSwrAxios but the React.useEffect hasn't triggered yet
    // so observationGroups is undefined and data is defined.
    observationGroups: observationGroups ?? data,
    isLoading: !data && isLoading,
  };
};
