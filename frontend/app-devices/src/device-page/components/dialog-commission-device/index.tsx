import { Device } from '@plentyag/app-devices/src/common/types';
import {
  dataTestIdsDialogBaseForm,
  DialogBaseForm,
  DialogBaseFormProps,
} from '@plentyag/brand-ui/src/components/dialog-base-form';
import React from 'react';

import { useCommissionDeviceFormGenConfig } from './hooks/use-commission-device-form-gen-config';

export { dataTestIdsDialogBaseForm as dataTestIdsCommissionDeviceDialog };

export interface DialogCommissionDevice extends DialogBaseFormProps {
  device: Device;
}

export const DialogCommissionDevice: React.FC<DialogCommissionDevice> = ({ device, open, onClose, onSuccess }) => {
  const formGenConfig = useCommissionDeviceFormGenConfig({ device });

  return <DialogBaseForm open={open} onClose={onClose} onSuccess={onSuccess} formGenConfig={formGenConfig} />;
};
