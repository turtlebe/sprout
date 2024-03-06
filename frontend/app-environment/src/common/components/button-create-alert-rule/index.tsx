import { Add } from '@material-ui/icons';
import { useAlertRuleFormGenConfig } from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button, ButtonProps } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  root: 'button-create-alert-rule-root',
  dialog: 'button-create-alert-rule-diaolog',
};

export { dataTestIds as dataTestIdsButtonCreateAlertRule };

export interface ButtonCreateAlertRule extends ButtonProps {
  metric: Metric;
  onSuccess: () => void;
}

/**
 * Button to trigger a modal to add a new AlertRule
 */
export const ButtonCreateAlertRule: React.FC<ButtonCreateAlertRule> = ({ metric, onSuccess, ...buttonProps }) => {
  const [coreStore] = useCoreStore();
  const username = coreStore.currentUser.username;
  const formGenConfig = useAlertRuleFormGenConfig({ metric, username });
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <Button
        color="default"
        {...buttonProps}
        onClick={() => setOpen(true)}
        startIcon={<Add />}
        data-testid={dataTestIds.root}
      >
        Add Alert Rule
      </Button>
      <DialogBaseForm
        open={open}
        onSuccess={() => {
          setOpen(false);
          onSuccess();
        }}
        onClose={() => setOpen(false)}
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
      />
    </>
  );
};
