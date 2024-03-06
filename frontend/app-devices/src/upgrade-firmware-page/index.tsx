import Alert from '@material-ui/lab/Alert';
import { DeviceWorkflowInfo } from '@plentyag/app-devices/src/common/types';
import { allowedDeviceTypes, isDfuCompatible } from '@plentyag/app-devices/src/common/utils';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import { groupBy, map } from 'lodash';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useGetDevicesByDeviceIds } from '../common/hooks/use-get-devices-by-device-ids';
import { Device } from '../common/types';
import { ROUTES } from '../routes';

import { IncompatibleDevices } from './components/incompatible-devices';
import { UpgradeFirmware } from './components/upgrade-firmware';

export interface UpgradeFirmwarePageUrlParams {
  redisJsonObjectId: string;
}

const groupMapping = {
  Sprinkle2Base: 'Sprinkle2Base',
  Sprinkle2FIR: 'Sprinkle2Base',
  Sprinkle2CO2: 'Sprinkle2Base',
};

export const UpgradeFirmwarePage: React.FC<RouteComponentProps<UpgradeFirmwarePageUrlParams>> = ({ match }) => {
  const { redisJsonObject, isLoading } = useRedisJsonObjectApi<DeviceWorkflowInfo>(match.params.redisJsonObjectId);
  const { data, isValidating } = useGetDevicesByDeviceIds(redisJsonObject?.value?.deviceIds);
  const devices = data?.data || [];
  const incompatibleDevices = devices.filter(device => !isDfuCompatible(device));
  const filteredDevices = devices.filter(isDfuCompatible);
  const devicesGroupedByDeviceType = groupBy(
    filteredDevices,
    (device: Device) => groupMapping[device.deviceTypeName] ?? device.deviceTypeName
  );

  return (
    <AppLayout isLoading={isLoading || isValidating}>
      <AppHeader justifyContent="flex-start">
        <AppBreadcrumbs homePageRoute={ROUTES.devicesPage} homePageName="Devices" pageName="Upgrade Firmware" />
        <Box width={34} />
        <Alert severity="warning">
          Device Firmware Upgrade is only supported for {allowedDeviceTypes.join(', ')} devices.
        </Alert>
      </AppHeader>

      <Box padding={2}>
        {map<Device[]>(devicesGroupedByDeviceType, (devices, deviceType) => (
          <UpgradeFirmware
            key={deviceType}
            deviceType={deviceType}
            devices={devices}
            redisJsonObject={redisJsonObject}
          />
        ))}
      </Box>

      <IncompatibleDevices devices={incompatibleDevices} />
    </AppLayout>
  );
};
