import { Device, FirmwareUpgradeStatus } from '@plentyag/app-devices/src/common/types';
import { Chip } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const statusColors = {
  QUEUED: 'default', // DFU process was initiated.
  NOT_READY: 'secondary', // Lights were on for the device so the DFU request was not sent to AWS job service.
  FAILED: 'secondary', // The terminal state after error state.
  REJECTED: 'secondary', // DFU process was rejected because. Example cause: lights are on.
  CANCELLED: 'secondary', // DFU process was canceled in AWS.
  SUCCEEDED: 'primary', // The DFU process for the device was successful.
};

export interface LastFirmwareUpgradeStatus {
  device: Device;
  firmwareUpgradeStatuses: FirmwareUpgradeStatus[];
}

export const LastFirmwareUpgradeStatus: React.FC<LastFirmwareUpgradeStatus> = ({
  device,
  firmwareUpgradeStatuses = [],
}) => {
  const [lastFirmwareUpgradeStatus] = firmwareUpgradeStatuses

    .filter(status => device.id === status.deviceId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const status = lastFirmwareUpgradeStatus?.status?.name;

  return status ? <Chip label={status} color={statusColors[status] ?? 'default'} /> : <>--</>;
};
