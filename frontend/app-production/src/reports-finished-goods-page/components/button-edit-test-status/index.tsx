import EditIcon from '@material-ui/icons/Edit';
import { DialogBaseForm, Show } from '@plentyag/brand-ui/src/components';
import { IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { PackagingLot } from '@plentyag/core/src/types';
import { useState } from 'react';

import { useFinishedGoodsTestStatusFormGenConfig } from '../../hooks/use-finished-goods-test-status-form-gen-config';
import { FinishedGoodsStatus, TestStatusField } from '../../types';
import { getReleaseDetails } from '../../utils/get-release-details';

import { useStyles } from './styles';

const dataTestIds = {
  button: 'button-edit-test-status',
  dialog: 'button-edit-test-status-dialog',
};

export { dataTestIds as dataTestIdsButtonEditTestStatus };

export interface ButtonEditTestStatus {
  lot: PackagingLot;
  sku?: FarmDefSku;
  field: TestStatusField;
  status: FinishedGoodsStatus;
  'data-testid'?: string;
  onSuccess: DialogBaseForm['onSuccess'];
  onError: DialogBaseForm['onError'];
}

/**
 * Button gated by permissions to open a dialog and create a new Metric.
 */
export const ButtonEditTestStatus: React.FC<ButtonEditTestStatus> = ({
  lot,
  sku,
  field,
  status,
  onSuccess,
  onError,
  'data-testid': dataTestId,
}) => {
  const permissionResource = field === TestStatusField.QA ? Resources.HYP_QUALITY : Resources.HYP_LAB_TESTING;
  const [open, setOpen] = useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const formGenConfig = useFinishedGoodsTestStatusFormGenConfig({
    lotName: lot.lotName,
    skuName: sku?.displayName,
    field,
    netSuiteItem: sku?.netsuiteItem,
    username: coreStore.currentUser?.username,
  });
  const classes = useStyles({});
  const isEditable = [FinishedGoodsStatus.HOLD, FinishedGoodsStatus.UNRELEASED].includes(status);
  const releaseDetails = getReleaseDetails(lot, sku);

  const handleSuccess = response => {
    setOpen(false);
    void onSuccess(response);
  };

  const handleError = err => {
    void onError(err);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Show when={isEditable}>
      <Can resource={permissionResource} level={PermissionLevels.EDIT} disableSnackbar>
        <IconButton
          className={classes.button}
          data-testid={dataTestId ?? dataTestIds.button}
          icon={EditIcon}
          onClick={handleClick}
        />
        <DialogBaseForm
          open={open}
          onClose={handleClose}
          onSuccess={handleSuccess}
          onError={handleError}
          disableDefaultOnSuccessHandler
          disableDefaultOnErrorHandler
          formGenConfig={formGenConfig}
          data-testid={dataTestIds.dialog}
          initialValues={releaseDetails}
          maxWidth="lg"
          isUpdating
        />
      </Can>
    </Show>
  );
};
