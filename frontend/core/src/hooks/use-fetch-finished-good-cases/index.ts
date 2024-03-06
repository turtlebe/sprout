import { useLogAxiosErrorInSnackbar } from '@plentyag/core/src/hooks';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { toQueryParams } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

import { FinishedGoodCase } from '../../types';

export interface UseFetchFinishedGoodCasesReturn {
  cases: FinishedGoodCase[];
  isLoading: boolean;
}

export const useFetchFinishedGoodCases = (startDate?: Date, endDate?: Date): UseFetchFinishedGoodCasesReturn => {
  const queryParams = toQueryParams({
    created_at_start: DateTime.fromJSDate(startDate).startOf('day').toISO(),
    created_at_end: DateTime.fromJSDate(endDate).endOf('day').toISO(),
  });

  const url = startDate && endDate && `/api/plentyservice/traceability3/get-finished-goods-cases${queryParams}`;
  const { data, error, isValidating } = useSwrAxios<FinishedGoodCase[]>({
    url,
  });

  useLogAxiosErrorInSnackbar(error);

  return { cases: data, isLoading: isValidating };
};
