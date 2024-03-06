import { isValidTimeGranularity } from '@plentyag/app-environment/src/common/utils';
import { DEFAULT_TIME_GRANULARITY, timeGranularities } from '@plentyag/app-environment/src/common/utils/constants';
import { TimeGranularity } from '@plentyag/core/src/types/environment';
import React, { Dispatch, SetStateAction } from 'react';
import { useLocalStorage } from 'react-use';

export const LOCAL_STORAGE_KEY_TIME_GRANULARITY = 'environment-v2-time-granularity-preference';

export interface UseLocalStorageTimeGranularity {
  startDateTime: Date;
  endDateTime: Date;
}

export type UseLocalStorageTimeGranularityReturn = [TimeGranularity, Dispatch<SetStateAction<TimeGranularity>>];

export const useLocalStorageTimeGranularity = ({
  startDateTime,
  endDateTime,
}: UseLocalStorageTimeGranularity): UseLocalStorageTimeGranularityReturn => {
  const [timeGranularity, setTimeGranularity] = useLocalStorage<TimeGranularity>(
    LOCAL_STORAGE_KEY_TIME_GRANULARITY,
    DEFAULT_TIME_GRANULARITY
  );

  const adjustedTimeGranularity = React.useMemo(() => {
    return isValidTimeGranularity({ timeGranularity, startDateTime, endDateTime })
      ? timeGranularity
      : timeGranularities.find(t => isValidTimeGranularity({ timeGranularity: t, startDateTime, endDateTime }));
  }, [timeGranularity, startDateTime, endDateTime]);

  return [adjustedTimeGranularity, setTimeGranularity];
};
