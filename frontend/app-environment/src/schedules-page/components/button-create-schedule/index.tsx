import { Add } from '@material-ui/icons';
import { useScheduleHandler } from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

import { useScheduleFormGenConfig } from '../../hooks';

const dataTestIds = {
  button: 'button-create-schedule',
  dialog: 'button-create-schedule-dialog',
};

export { dataTestIds as dataTestIdsButtonCreateSchedule };

export interface ButtonCreateSchedule {
  onSuccess: DialogBaseForm['onSuccess'];
}

/**
 * Button to trigger a Modal to create a Schedule.
 */
export const ButtonCreateSchedule: React.FC<ButtonCreateSchedule> = ({ onSuccess }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const { handleCreated } = useScheduleHandler();
  const formGenConfig = useScheduleFormGenConfig({ username: coreStore.currentUser?.username });

  const handleSuccess = (response, headers) => {
    setOpen(false);
    handleCreated(response, headers);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.EDIT} disableSnackbar>
      <Button data-testid={dataTestIds.button} variant="contained" onClick={() => setOpen(true)} startIcon={<Add />}>
        Create Schedule
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        disableDefaultOnSuccessHandler
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
      />
    </Can>
  );
};
