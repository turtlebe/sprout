import { Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import {
  StyledBattery20,
  StyledBattery50,
  StyledBattery90,
  StyledBatteryAlert,
  StyledBatteryFull,
  StyledBatteryLoading,
  StyledBatteryUnknown,
} from './styles';

const dataTestIds = {
  loading: 'battery-level-loading',
  unknown: 'battery-level-unknown',
  empty: 'battery-level-empty',
  low: 'battery-level-low',
  medium: 'battery-level-medium',
  high: 'battery-level-high',
  full: 'battery-level-full',
};

export { dataTestIds as dataTestIdsBatteryLevels };

export const BatteryLevelLoading = () => (
  <Tooltip title="Battery Level: loading...">
    <StyledBatteryLoading data-testid={dataTestIds.loading} />
  </Tooltip>
);

export const BatteryLevelUnknown = () => (
  <Tooltip title="Battery Level: Unkown">
    <StyledBatteryUnknown data-testid={dataTestIds.unknown} />
  </Tooltip>
);

export const BatteryLevelIconEmpty = () => (
  <Tooltip title="Battery Level: Empty">
    <StyledBatteryAlert data-testid={dataTestIds.empty} />
  </Tooltip>
);

export const BatteryLevelIconLow = () => (
  <Tooltip title="Battery Level: 25%">
    <StyledBattery20 data-testid={dataTestIds.low} />
  </Tooltip>
);

export const BatteryLevelIconMedium = () => (
  <Tooltip title="Battery Level: 50%">
    <StyledBattery50 data-testid={dataTestIds.medium} />
  </Tooltip>
);

export const BatteryLevelIconHigh = () => (
  <Tooltip title="Battery Level: 75%">
    <StyledBattery90 data-testid={dataTestIds.high} />
  </Tooltip>
);

export const BatteryLevelIconFull = () => (
  <Tooltip title="Battery Level: Full">
    <StyledBatteryFull data-testid={dataTestIds.full} />
  </Tooltip>
);
