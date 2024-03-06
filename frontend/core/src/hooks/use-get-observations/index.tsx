import { Device } from '@plentyag/app-devices/src/common/types';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { NormalizedObservation, PaginatedList } from '@plentyag/core/src/types';
import { DateTime, DateTimeUnit, ToRelativeUnit } from 'luxon';
import React from 'react';

export interface GetObservations {
  device?: Device;
  observationName?: string;
  path?: string;
  amount: number;
  unit: DateTimeUnit | ToRelativeUnit; // Luxon accepts singular or plural
  limit?: number;
  from?: string;
  order?: string;
  partialPath?: boolean;
}

/**
 * Fetch observations for a given device or observationName based on a relative duration to now.
 */
export const useGetObservations = ({
  device,
  observationName,
  path,
  amount,
  unit,
  from,
  limit = 1,
  order = 'desc',
  partialPath = false,
}: GetObservations) => {
  const endDateTime = React.useMemo(() => from || DateTime.now().toUTC().toISO(), [from, device?.id]);
  const startDateTime = React.useMemo(
    () =>
      DateTime.fromISO(endDateTime)
        .plus({ [unit]: amount })
        .startOf('minute')
        .toUTC()
        .toISO(),
    [device?.id, amount, unit, from]
  );

  return useSwrAxios<PaginatedList<NormalizedObservation>>(
    (device || observationName || path) && {
      method: 'POST',
      url: '/api/plentyservice/observation-digest-service/search-normalized-observations',
      data: {
        observationName,
        deviceId: device?.id,
        path,
        startDateTime,
        endDateTime,
        limit,
        order,
        partialPath,
      },
    },
    { shouldRetryOnError: false }
  );
};
