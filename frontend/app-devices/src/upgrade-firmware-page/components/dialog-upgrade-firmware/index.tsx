import { Device } from '@plentyag/app-devices/src/common/types';
import {
  dataTestIdsDialogBaseForm,
  DialogBaseForm,
  DialogBaseFormProps,
} from '@plentyag/brand-ui/src/components/dialog-base-form';
import React from 'react';

import { useUpgradeFirmwareFormGenConfig } from './hooks/use-upgrade-firmware-form-gen-config';

export { dataTestIdsDialogBaseForm as dataTestIdsUpgradeFirmwareDialog };

interface FirmwareUpgradeResponse {
  processIds: string[];
}

export interface DialogUpgradeFirmware extends DialogBaseFormProps<FirmwareUpgradeResponse> {
  deviceType: string;
  devices: Device[];
}

export const DialogUpgradeFirmware: React.FC<DialogUpgradeFirmware> = ({
  devices,
  deviceType,
  onSuccess,
  onClose,
  open,
}) => {
  const formGenConfig = useUpgradeFirmwareFormGenConfig({ deviceType, devices });

  return <DialogBaseForm open={open} onClose={onClose} onSuccess={onSuccess} formGenConfig={formGenConfig} />;
};
