import { Add } from '@material-ui/icons';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { Subscription } from '@plentyag/core/src/types/environment';
import React from 'react';

import { useSubscriptionFormGenConfig } from '../../hooks';

const dataTestIds = {
  createSubscription: 'button-create-subscription-root',
  dialog: 'button-create-subscription-dialog',
};

export { dataTestIds as dataTestIdsButtonCreateSubscription };

export interface ButtonCreateSubscription {
  alertRuleId: string;
  onSubscriptionCreated: (subscription: Subscription) => void;
}

/**
 * Button that opens a Dialog to create a Subscription.
 */
export const ButtonCreateSubscription: React.FC<ButtonCreateSubscription> = ({
  alertRuleId,
  onSubscriptionCreated,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const formGenConfig = useSubscriptionFormGenConfig({ alertRuleId, username: coreStore.currentUser?.username });

  const handleSuccess = response => {
    setIsDialogOpen(false);
    void onSubscriptionCreated(response);
  };

  return (
    <>
      <Button
        variant="contained"
        color="default"
        startIcon={<Add />}
        onClick={() => setIsDialogOpen(true)}
        data-testid={dataTestIds.createSubscription}
      >
        Add a Subscription
      </Button>
      <DialogBaseForm
        formGenConfig={formGenConfig}
        open={isDialogOpen}
        onSuccess={handleSuccess}
        onClose={() => setIsDialogOpen(false)}
        data-testid={dataTestIds.dialog}
      />
    </>
  );
};
