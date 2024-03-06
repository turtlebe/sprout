import { Edit } from '@material-ui/icons';
import { useScheduleHandler } from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import React from 'react';

import { useScheduleFormGenConfig } from '../../hooks';

const dataTestIds = {
  button: 'button-edit-schedule',
  dialog: 'button-edit-schedule-dialog',
};

export { dataTestIds as dataTestIdsButtonEditSchedule };

export interface ButtonEditSchedule {
  schedule: Schedule;
  onSuccess: DialogBaseForm['onSuccess'];
  disabled: boolean;
}

/**
 * Button gated by permissions to open a dialog and edit an existing Schedule.
 */
export const ButtonEditSchedule: React.FC<ButtonEditSchedule> = ({ schedule, onSuccess, disabled }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const { handleUpdated } = useScheduleHandler();
  const formGenConfig = useScheduleFormGenConfig({ schedule, username: coreStore.currentUser?.username });

  const handleSuccess = (response, headers) => {
    setOpen(false);
    handleUpdated(response, headers);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.FULL} disableSnackbar>
      <Button
        data-testid={dataTestIds.button}
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<Edit />}
        disabled={disabled}
        color="default"
      >
        Edit Schedule
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        disableDefaultOnSuccessHandler
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
        isUpdating={true}
        initialValues={schedule}
      />
    </Can>
  );
};
