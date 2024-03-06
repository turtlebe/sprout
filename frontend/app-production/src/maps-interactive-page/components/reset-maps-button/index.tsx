import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { noop } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { DialogConfirmation, getDialogConfirmationDataTestIds } from '@plentyag/brand-ui/src/components';
import { IconButton, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { ReactComponent as ResetIcon } from './assets/reset.svg';

const dataTestIds = {
  button: 'reset-button',
  dialogConfirmation: getDialogConfirmationDataTestIds('confirmation'),
};

export { dataTestIds as dataTestIdsResetMapsButton };

interface ResetMapsButton {
  onMapsReset?: () => void;
}

export const ResetMapsButton: React.FC<ResetMapsButton> = ({ onMapsReset = noop }) => {
  const { resetAllParameters } = useQueryParameter();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

  function handleReset() {
    setIsConfirmDialogOpen(false);
    onMapsReset();
    resetAllParameters();
  }

  return (
    <>
      <Tooltip arrow title={<Typography>Reset maps</Typography>}>
        <IconButton
          data-testid={dataTestIds.button}
          color="primary"
          size="small"
          icon={ResetIcon}
          onClick={() => {
            setIsConfirmDialogOpen(true);
          }}
        />
      </Tooltip>
      <DialogConfirmation
        data-testid={dataTestIds.dialogConfirmation.root}
        open={isConfirmDialogOpen}
        title="Are you sure you'd like to reset maps?"
        confirmLabel="Reset"
        onConfirm={handleReset}
        onCancel={() => setIsConfirmDialogOpen(false)}
      />
    </>
  );
};
