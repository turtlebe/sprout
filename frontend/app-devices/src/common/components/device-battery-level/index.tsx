import { Device } from '@plentyag/app-devices/src/common/types';
import { DeviceTypes } from '@plentyag/app-devices/src/common/types/device-types';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { NormalizedObservation, PaginatedList } from '@plentyag/core/src/types';
import { DateTime } from 'luxon';
import React from 'react';

import {
  BatteryLevelIconEmpty,
  BatteryLevelIconFull,
  BatteryLevelIconHigh,
  BatteryLevelIconLow,
  BatteryLevelIconMedium,
  BatteryLevelLoading,
  BatteryLevelUnknown,
  dataTestIdsBatteryLevels,
} from './battery-levels';

type BatteryLevelIconHelper = (voltage: number) => JSX.Element | false;

// Sprinkles1
// no bars/dead: < 2.4V
// 1 bar: 2.4-2.67V
// 2 bars: 2.67-2.83V
// 3 bars: 2.83-3V
// 4 bars: 3V+
const SprinklesV1BatteryLevelThresholds: BatteryLevelIconHelper[] = [
  voltage => voltage < 2.4 && <BatteryLevelIconEmpty />,
  voltage => voltage >= 2.4 && voltage < 2.67 && <BatteryLevelIconLow />,
  voltage => voltage >= 2.67 && voltage < 2.83 && <BatteryLevelIconMedium />,
  voltage => voltage >= 2.83 && voltage < 3 && <BatteryLevelIconHigh />,
  voltage => voltage >= 3 && <BatteryLevelIconFull />,
];

// Sprinkles2
// no bars/dead: < 3.3V
// 1 bar: 3.3-3.4V
// 2 bars: 3.4-3.65V
// 3 bars: 3.65-4V
// 4 bars: 4V+
const SprinklesV2BatteryLevelThresholds: BatteryLevelIconHelper[] = [
  voltage => voltage < 3.3 && <BatteryLevelIconEmpty />,
  voltage => voltage >= 3.3 && voltage < 3.4 && <BatteryLevelIconLow />,
  voltage => voltage >= 3.4 && voltage < 3.65 && <BatteryLevelIconMedium />,
  voltage => voltage >= 3.65 && voltage < 4 && <BatteryLevelIconHigh />,
  voltage => voltage >= 4 && <BatteryLevelIconFull />,
];

const BatteryLevelThresholds: { [key: string]: BatteryLevelIconHelper[] } = {
  [DeviceTypes.Sprinkle2Base]: SprinklesV2BatteryLevelThresholds,
  [DeviceTypes.Sprinkle2FIR]: SprinklesV2BatteryLevelThresholds,
  [DeviceTypes.Sprinkle2CO2]: SprinklesV2BatteryLevelThresholds,
  [DeviceTypes.Sprinkle]: SprinklesV1BatteryLevelThresholds,
};

const dataTestIds = {
  ...dataTestIdsBatteryLevels,
};

export { dataTestIds as dataTestIdsDeviceBatteryLevel };

export interface DeviceBatteryLevel {
  device: Device;
}

/**
 * Battery Level of a Sprinkle V1 or V2 device.
 *
 * This component reads the last BatteryVoltage Observation and calculate the battery level associated to the voltage.
 */
export const DeviceBatteryLevel: React.FC<DeviceBatteryLevel> = ({ device }) => {
  const isBatteryOperated = Boolean(BatteryLevelThresholds[device?.deviceTypeName]);
  const oneHourAgo = React.useMemo(() => DateTime.now().toUTC().minus({ hour: 1 }).toISO(), [device?.id]);
  const { data, isValidating } = useSwrAxios<PaginatedList<NormalizedObservation>>(
    isBatteryOperated && {
      method: 'POST',
      url: '/api/plentyservice/observation-digest-service/search-normalized-observations',
      data: {
        deviceId: device?.id,
        observationName: 'BatteryVoltage',
        startDateTime: oneHourAgo,
        limit: 1,
      },
    },
    { shouldRetryOnError: false }
  );

  const batteryLevelThreshold: BatteryLevelIconHelper[] = BatteryLevelThresholds[device?.deviceTypeName];

  // Render nothing if the deviceType does not have battery thresholds.
  if (!batteryLevelThreshold) {
    return null;
  }

  const [lastObservation] = data?.data ?? [];

  if (!lastObservation && isValidating) {
    return <BatteryLevelLoading />;
  }

  if (!lastObservation) {
    return <BatteryLevelUnknown />;
  }

  const voltage = lastObservation.valueNumeric;
  const batteryLevelHelper = batteryLevelThreshold.find(comp => comp(voltage));
  const BatteryLevelIcon = batteryLevelHelper && batteryLevelHelper(voltage);

  return BatteryLevelIcon || <BatteryLevelUnknown />;
};
