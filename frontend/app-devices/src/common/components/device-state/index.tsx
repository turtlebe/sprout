import { Chip, ChipProps } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DmsDevice } from '../../types';
import { DeviceState as State } from '../../types/device-state';

const StateColorMapping: { [key: string]: ChipProps['color'] } = {
  [State.active]: 'primary',
  [State.registered]: 'secondary',
  [State.decommissioned]: 'default',
  [State.maintenance]: 'default',
};

export interface DeviceStatus {
  device: DmsDevice;
}

export const DeviceState: React.FC<DeviceStatus> = ({ device }) => {
  if (!device) {
    return null;
  }

  const state = device.deviceState;

  if (!state) {
    return null;
  }

  return <Chip color={StateColorMapping[state]} label={`status: ${state.toLocaleLowerCase()}`} />;
};
