import { FarmDefMeasurementType } from '@plentyag/core/src/farm-def/types';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

const SEARCH_MEASUREMENT_TYPES_URL = '/api/plentyservice/farm-def-service/search-measurement-types';

export interface UseFetchMeasurementTypesReturn {
  measurementTypes: FarmDefMeasurementType[];
  isLoading: boolean;
}

/**
 * Simple hook to fetch and cache (for 30 minutes) MeasurementTypes from farm-def.
 */
export const useFetchMeasurementTypes = (): UseFetchMeasurementTypesReturn => {
  const [measurementTypes, setMeasurementTypes] = React.useState<FarmDefMeasurementType[]>();
  const { data, isValidating: isLoading } = useSwrAxios<FarmDefMeasurementType[]>(
    { url: SEARCH_MEASUREMENT_TYPES_URL },
    { dedupingInterval: 60000 * 30 }
  );

  React.useEffect(() => {
    if (data) {
      setMeasurementTypes(data);
    }
  }, [data]);

  return {
    // "?? data" because there is a chance the data is already cached by useSwrAxios but the React.useEffect hasn't triggered yet
    // so measurementTypes is undefined and data is defined.
    measurementTypes: measurementTypes ?? data,
    isLoading: !data && isLoading,
  };
};
