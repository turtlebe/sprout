import { DeviceWorkflowInfo } from '@plentyag/app-devices/src/common/types';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useGetDevicesByDeviceIds } from '../common/hooks/use-get-devices-by-device-ids';
import { ROUTES } from '../routes';

import { SwapDevices } from './components/swap-devices';

interface SwapDevicesPageUrlParams {
  redisJsonObjectId: string;
}

export const SwapDevicesPage: React.FC<Pick<RouteComponentProps<SwapDevicesPageUrlParams>, 'match'>> = ({ match }) => {
  const { redisJsonObject, isLoading } = useRedisJsonObjectApi<DeviceWorkflowInfo>(match.params.redisJsonObjectId);
  const { data: paginatedDevices, isValidating } = useGetDevicesByDeviceIds(redisJsonObject?.value?.deviceIds);

  return (
    <AppLayout isLoading={isLoading || isValidating}>
      <AppHeader>
        <AppBreadcrumbs homePageRoute={ROUTES.devicesPage} homePageName="Devices" pageName="Swap Devices" />
      </AppHeader>

      <Box padding={2}>
        <SwapDevices devices={paginatedDevices?.data ?? []} isLoading={isLoading || isValidating} />
      </Box>
    </AppLayout>
  );
};
