import { Device } from '@plentyag/app-devices/src/common/types';
import {
  DialogConfirmation,
  getDialogConfirmationDataTestIds,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { usePostRequest } from '@plentyag/core/src/hooks';
import {
  getExecutiveServiceRequestUrl,
  getExecutiveServiceSubmitterHeaders,
  getScopedDataTestIds,
  parseErrorMessage,
} from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    dialogConfirmation: getDialogConfirmationDataTestIds('rebootDeviceConfirmation'),
  },
  'ButtonRebootDevice'
);

export const getButtonRebootDeviceTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export { dataTestIds as dataTestIdsButtonRebootDevice };

export interface ButtonRebootDevice {
  device: Device;
  'data-testid'?: string;
}

export const ButtonRebootDevice: React.FC<ButtonRebootDevice> = ({ device, 'data-testid': dataTestId }) => {
  const dataTestIds = getButtonRebootDeviceTestIds(dataTestId);
  const [open, setOpen] = React.useState<boolean>(false);
  const { makeRequest } = usePostRequest({
    url: getExecutiveServiceRequestUrl(device?.location?.interfaces?.Hathor?.methods?.CommandDevice?.path),
  });
  const snackbar = useGlobalSnackbar();
  const [state] = useCoreStore();

  const handleRebootDevice = () => {
    makeRequest({
      data: { command: 'REBOOT', ...getExecutiveServiceSubmitterHeaders(state) },
      onSuccess: () => {
        snackbar.successSnackbar('Device successfully rebooted');
        setOpen(false);
      },
      onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
    });
  };

  return (
    <>
      <Button color="primary" variant="contained" onClick={() => setOpen(true)} data-testid={dataTestIds.root}>
        Reboot
      </Button>
      <DialogConfirmation
        data-testid={dataTestIds.dialogConfirmation.root}
        open={open}
        title="Are you sure you'd like to reboot this device?"
        confirmLabel="Reboot Device"
        onConfirm={handleRebootDevice}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
