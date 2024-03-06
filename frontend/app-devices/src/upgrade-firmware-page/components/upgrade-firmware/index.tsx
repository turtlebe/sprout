import { Device, DeviceWorkflowInfo, FirmwareUpgradeStatus } from '@plentyag/app-devices/src/common/types';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { RedisJsonObject, useRedisJsonObjectApi, useSwrAxios } from '@plentyag/core/src/hooks';
import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import { merge } from 'lodash';
import React from 'react';
import { useInterval } from 'react-use';

import { DialogUpgradeFirmware } from '../dialog-upgrade-firmware';
import { UpgradeFirmwareTable } from '../upgrade-firmware-table';

export interface UpgradeFirmware {
  deviceType: string;
  devices: Device[];
  redisJsonObject: RedisJsonObject<DeviceWorkflowInfo>;
}

export const UpgradeFirmware: React.FC<UpgradeFirmware> = ({
  deviceType,
  devices,
  redisJsonObject: propRedisJsonObject,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const { redisJsonObject, updateRedisJsonObject } = useRedisJsonObjectApi<DeviceWorkflowInfo>(propRedisJsonObject.id);
  const [processIds, setProcessIds] = React.useState<string[]>(null);
  const { data: firmwareUpgradeStatuses, revalidate } = useSwrAxios<FirmwareUpgradeStatus[]>(
    processIds && {
      url: `/api/plentyservice/device-management/get-firmware-upgrade-status${toQueryParams(
        { process_ids: processIds },
        { doNotEncodeArray: true }
      )}`,
    }
  );
  const deviceTypeProcessIds = redisJsonObject?.value?.firmwareUpgrade?.processIdsByDeviceTypeGroup[deviceType];

  useInterval(revalidate, 5000);

  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);
  const handleSuccess: DialogUpgradeFirmware['onSuccess'] = response => {
    setProcessIds(response.processIds);
    updateRedisJsonObject({
      value: merge(redisJsonObject.value, {
        firmwareUpgrade: { processIdsByDeviceTypeGroup: { [deviceType]: response.processIds } },
      }),
    });
    handleClose();
  };

  React.useEffect(() => {
    if (deviceTypeProcessIds) {
      setProcessIds(deviceTypeProcessIds);
    }
  }, [deviceTypeProcessIds]);

  return (
    <Box marginBottom={2} display="flex" flexDirection="column" alignItems="flex-end">
      <UpgradeFirmwareTable devices={devices} firmwareUpgradeStatuses={firmwareUpgradeStatuses} />
      <Box padding={1} />
      <Button variant="contained" onClick={handleOpen} disabled={Boolean(deviceTypeProcessIds)}>
        Upgrade {deviceType} Firmware
      </Button>
      <DialogUpgradeFirmware
        open={isDialogOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        deviceType={deviceType}
        devices={devices}
      />
    </Box>
  );
};
