import { Delete, Edit } from '@material-ui/icons';
import { StyledTableCell } from '@plentyag/app-environment/src/common/components';
import {
  DialogBaseForm,
  DialogConfirmation,
  getDialogConfirmationDataTestIds,
  Show,
} from '@plentyag/brand-ui/src/components';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { Subscription } from '@plentyag/core/src/types/environment';
import { toMinutes } from '@plentyag/core/src/utils';
import React from 'react';

import { useSubscriptionFormGenConfig } from '../../hooks';

enum DialogName {
  edit = 'EDIT',
  delete = 'DELETE',
}

const dataTestIds = {
  root: 'table-subscriptions-root',
  tableRow: (subscription: Subscription) => `table-subscription-row-${subscription.id}`,
  cellType: (subscription: Subscription) => `table-subscription-cell-type-${subscription.id}`,
  cellMethod: (subscription: Subscription) => `table-subscription-cell-method-${subscription.id}`,
  cellTo: (subscription: Subscription) => `table-subscription-cell-to-${subscription.id}`,
  cellThreshold: (subscription: Subscription) => `table-subscription-cell-threshold-${subscription.id}`,
  cellDuration: (subscription: Subscription) => `table-subscription-cell-duration-${subscription.id}`,
  cellDistincSource: (subscription: Subscription) => `table-subscription-cell-distinct-source-${subscription.id}`,
  cellRenotifyPeriod: (subscription: Subscription) => `table-subscription-cell-renotify-period-${subscription.id}`,
  cellPriority: (subscription: Subscription) => `table-subscription-cell-priority-${subscription.id}`,
  cellDescription: (subscription: Subscription) => `table-subscription-cell-description-${subscription.id}`,
  cellTags: (subscription: Subscription) => `table-subscription-cell-tags-${subscription.id}`,
  editSubscription: (subscription: Subscription) => `table-subscription-edit-${subscription.id}`,
  deleteSubscription: (subscription: Subscription) => `table-subscription-delete-${subscription.id}`,
  dialogDeleteSubscription: getDialogConfirmationDataTestIds('table-subscription-dialog-delete-subscription'),
  dialogEditSubscription: 'table-subscription-dialog-edit-subscription',
};

export { dataTestIds as dataTestIdsTableSubscriptions };

export interface TableSubscriptions {
  subscriptions: Subscription[];
  onSubscriptionsUpdated: () => void;
  onDeleteSubscription: (subscription: Subscription) => void;
}

/**
 * Table listing Subscriptions. Provides CTA to edit and delete Subscriptions.
 */
export const TableSubscriptions: React.FC<TableSubscriptions> = ({
  subscriptions = [],
  onSubscriptionsUpdated,
  onDeleteSubscription,
}) => {
  const [selectedSubscription, setSelectedSubscription] = React.useState<Subscription>(null);
  const [dialogName, setDialogName] = React.useState<DialogName>(null);
  const [coreStore] = useCoreStore();
  const formGenConfig = useSubscriptionFormGenConfig({
    subscription: selectedSubscription,
    username: coreStore.currentUser?.username,
  });

  function handleEdit(subscription: Subscription) {
    setSelectedSubscription(subscription);
    setDialogName(DialogName.edit);
  }

  function handleDelete(subscription: Subscription) {
    setSelectedSubscription(subscription);
    setDialogName(DialogName.delete);
  }

  function handleCloseDialog() {
    setSelectedSubscription(null);
    setDialogName(null);
  }

  function handleUpdateSubscriptionSuccess() {
    handleCloseDialog();
    onSubscriptionsUpdated();
  }

  function handleConfirmDeleteSubscription() {
    onDeleteSubscription(selectedSubscription);
    handleCloseDialog();
  }

  return (
    <>
      {subscriptions.length > 0 ? (
        <TableContainer data-testid={dataTestIds.root}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Method</StyledTableCell>
                <StyledTableCell>To</StyledTableCell>
                <StyledTableCell>Count</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>Distinct Sources</StyledTableCell>
                <StyledTableCell>Renotify Every</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Tags</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map(subscription => (
                <TableRow key={subscription.id} data-testid={dataTestIds.tableRow(subscription)}>
                  <TableCell data-testid={dataTestIds.cellType(subscription)}>
                    {subscription.notificationType}
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellMethod(subscription)}>{subscription.method}</TableCell>
                  <TableCell data-testid={dataTestIds.cellTo(subscription)}>{subscription.to}</TableCell>
                  <TableCell data-testid={dataTestIds.cellThreshold(subscription)}>
                    {subscription.notificationThreshold}
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellDuration(subscription)}>
                    <Show when={Boolean(subscription.notificationDuration)}>{`${toMinutes(
                      subscription.notificationDuration
                    )} minutes`}</Show>
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellDistincSource(subscription)}>
                    <Show when={Boolean(subscription.notificationThreshold)}>
                      {subscription.notificationDistinctSource ? 'Yes' : 'No'}
                    </Show>
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellRenotifyPeriod(subscription)}>
                    <Show when={Boolean(subscription.renotifyPeriod)}>{`${toMinutes(
                      subscription.renotifyPeriod
                    )} minutes`}</Show>
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellPriority(subscription)}>{subscription.priority}</TableCell>
                  <TableCell data-testid={dataTestIds.cellDescription(subscription)}>
                    {subscription.description}
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellTags(subscription)}>
                    {subscription.tags ? subscription.tags.join(', ') : null}
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton
                        onClick={() => handleEdit(subscription)}
                        size="small"
                        color="default"
                        icon={Edit}
                        data-testid={dataTestIds.editSubscription(subscription)}
                      />
                      <IconButton
                        onClick={() => handleDelete(subscription)}
                        size="small"
                        color="default"
                        icon={Delete}
                        data-testid={dataTestIds.deleteSubscription(subscription)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box display="flex" justifyContent="center" padding={2} data-testid={dataTestIds.root}>
          <Typography>There is currently no Subscriptions.</Typography>
        </Box>
      )}

      <DialogBaseForm
        open={Boolean(selectedSubscription && dialogName === DialogName.edit)}
        formGenConfig={formGenConfig}
        initialValues={selectedSubscription}
        isUpdating={true}
        onSuccess={handleUpdateSubscriptionSuccess}
        onClose={handleCloseDialog}
        data-testid={dataTestIds.dialogEditSubscription}
      />
      <DialogConfirmation
        open={Boolean(selectedSubscription && dialogName === DialogName.delete)}
        title="Are you sure you want to delete this Subscription?"
        onConfirm={handleConfirmDeleteSubscription}
        onCancel={handleCloseDialog}
        data-testid={dataTestIds.dialogDeleteSubscription.root}
      />
    </>
  );
};
