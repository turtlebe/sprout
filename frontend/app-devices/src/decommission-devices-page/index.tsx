import { DeviceWorkflowInfo } from '@plentyag/app-devices/src/common/types';
import {
  AppBreadcrumbs,
  AppHeader,
  AppLayout,
  CircularProgressCentered,
  Show,
} from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useGetDevicesByDeviceIds } from '../common/hooks/use-get-devices-by-device-ids';
import { ROUTES } from '../routes';

import { DecommissionDevices } from './components';

const dataTestIds = {
  loader: 'decommission-devices-page-loader',
};

interface DecommissionDevicesPageUrlParams {
  redisJsonObjectId: string;
}

export { dataTestIds as dataTestIdsDecommissionDevicesPage };

export const DecommissionDevicesPage: React.FC<
  Pick<RouteComponentProps<DecommissionDevicesPageUrlParams>, 'match'>
> = ({ match }) => {
  const { redisJsonObject, isLoading: isLoadingRedisJsonObject } = useRedisJsonObjectApi<DeviceWorkflowInfo>(
    match.params.redisJsonObjectId
  );
  const { data: devices, isValidating, revalidate } = useGetDevicesByDeviceIds(redisJsonObject?.value?.deviceIds);
  const [isDecommissioning, setIsDecommissioning] = React.useState<boolean>(false);

  const isLoading = isLoadingRedisJsonObject || isValidating;

  return (
    <AppLayout isLoading={isLoading || isDecommissioning}>
      <AppHeader>
        <AppBreadcrumbs homePageRoute={ROUTES.devicesPage} homePageName="Devices" pageName="Decommission Devices" />
      </AppHeader>

      <Box padding={2}>
        <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loader} />}>
          <DecommissionDevices
            devices={devices?.data}
            onIsDecommissioning={isDecommissioning => setIsDecommissioning(isDecommissioning)}
            onDecommissioned={async () => revalidate()}
          />
        </Show>
      </Box>
    </AppLayout>
  );
};
