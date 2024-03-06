import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { useLogAxiosErrorInSnackbar } from '@plentyag/core/src/hooks';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { PackagingLot } from '@plentyag/core/src/types';
import { DateTimeFormat, toQueryParams } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

export interface UseFetchPackagingLots {
  farmPath: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UseFetchPackagingLotsReturn {
  lots: PackagingLot[];
  lotsRecord: Record<string, PackagingLot>;
  isLoading: boolean;
  refresh: () => void;
}

export const INVALID_FARM_PATH_MESSAGE = 'Farm path with specific farm required (i.e. LAX1)';
export const PACKAGING_LOTS_URL = '/api/plentyservice/traceability3/get-packaging-lots';

export const useFetchPackagingLots = ({
  farmPath,
  startDate,
  endDate,
}: UseFetchPackagingLots): UseFetchPackagingLotsReturn => {
  let farmPathError;
  if (!getKindFromPath(farmPath, 'farms')) {
    farmPathError = new Error('Invalid farm path!');
    farmPathError.message = INVALID_FARM_PATH_MESSAGE;
  }

  const endDateTime = endDate ? DateTime.fromJSDate(endDate) : DateTime.now();
  const startDateTime = startDate ? DateTime.fromJSDate(startDate) : endDateTime.minus({ days: 30 }); // default to 30 day range

  const url =
    !farmPathError &&
    `${PACKAGING_LOTS_URL}${toQueryParams({
      farm_path: farmPath,
      start_date: startDateTime.toFormat(DateTimeFormat.SQL_DATE_ONLY),
      end_date: endDateTime.toFormat(DateTimeFormat.SQL_DATE_ONLY),
    })}`;

  const {
    data: lots,
    error: respondError,
    isValidating,
    revalidate,
  } = useSwrAxios<PackagingLot[]>({
    url,
  });

  useLogAxiosErrorInSnackbar(farmPathError || respondError);

  const lotsRecord: Record<string, PackagingLot> = useMemo(() => {
    return lots
      ? lots.reduce((agg, lot) => {
          const { lotName } = lot;
          agg[lotName] = lot;
          return agg;
        }, {})
      : {};
  }, [lots]);

  return { lots, lotsRecord, refresh: revalidate, isLoading: isValidating };
};
