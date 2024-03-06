import { useGetObservations } from '@plentyag/app-devices/src/common/hooks';
import { Device } from '@plentyag/app-devices/src/common/types';
import { Chip, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { getRelativeTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

const dataTestIds = {
  root: 'device-last-communication',
  loader: 'device-last-communication-loader',
};

export { dataTestIds as dataTestIdsDeviceLastCommunication };

export interface DeviceLastCommunication {
  device: Device;
  noChip?: boolean;
}

/**
 * Renders the last time a Device communicated to FarmOs.
 *
 * This component reads the last Observation associated to the device and display its timestamp as a relative time.
 */
export const DeviceLastCommunication: React.FC<DeviceLastCommunication> = ({ device, noChip }) => {
  const { data, isValidating } = useGetObservations({ device, amount: -1, unit: 'hour' });
  const [lastObservation] = data?.data ?? [];

  const lastCommunication = lastObservation
    ? getRelativeTime(DateTime.fromSQL(lastObservation.createdAt, { zone: 'utc' }).toJSDate())
    : '--';

  if (!data && isValidating) {
    return <CircularProgress size={12} data-testid={dataTestIds.loader} />;
  }

  if (noChip) {
    return <>{lastCommunication}</>;
  }

  return <Chip color="default" label={`last communication: ${lastCommunication}`} data-testid={dataTestIds.root} />;
};
