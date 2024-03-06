import { CheckCircleOutline } from '@material-ui/icons';
import { DialogConfirmation } from '@plentyag/brand-ui/src/components';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { getScopedDataTestIds, parseErrorMessage } from '@plentyag/core/src/utils';
import React, { useState } from 'react';

import { CREATE_INGEST_URL } from '../../constants';
import { PostharvestIngest } from '../../types';
import { buildPostharvestIngestRequest } from '../../utils/build-postharvest-ingest-request';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    button: 'button',
    submitted: 'submitted',
    passIcon: 'pass-icon',
  },
  'IngestButton'
);

export { dataTestIds as dataTestIdsIgestButton };

export interface IngestButton {
  isIngested: boolean;
  siteName: string;
  farmName: string;
  lotName: string;
  skuName: string;
  onCreateIngest?: (data: PostharvestIngest) => void;
}

export const IngestButton: React.FC<IngestButton> = ({
  isIngested,
  siteName,
  farmName,
  lotName,
  skuName,
  onCreateIngest = () => {},
}) => {
  const classes = useStyles({});
  const [{ currentUser }] = useCoreStore();
  const { username } = currentUser;
  const snackbar = useGlobalSnackbar();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { makeRequest: createIngest, isLoading } = usePostRequest({
    url: CREATE_INGEST_URL,
  });

  const handleConfirmAuditsClick = () => {
    setConfirmOpen(true);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  function handleConfirm() {
    createIngest({
      data: buildPostharvestIngestRequest({
        username,
        siteName,
        farmName,
        lotName,
        skuName,
      }),
      onSuccess: (response: PostharvestIngest) => {
        setConfirmOpen(false);
        onCreateIngest(response);
        snackbar.successSnackbar('Submitted audits with success');
      },
      onError: error => {
        setConfirmOpen(false);
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ title: 'Error submitting audits', message });
      },
    });
  }

  return (
    <Box display="flex" alignItems="center" data-testid={dataTestIds.root}>
      {isIngested ? (
        <Box display="flex" data-testid={dataTestIds.submitted}>
          <CheckCircleOutline data-testid={dataTestIds.passIcon} className={classes.passStatus} />
          <span className={classes.current}>Submitted</span>
        </Box>
      ) : (
        <Button variant="outlined" size="small" data-testid={dataTestIds.button} onClick={handleConfirmAuditsClick}>
          COMPLETE
        </Button>
      )}
      <DialogConfirmation
        title={`Do you want to submit audits for ${lotName}/${skuName}?`}
        isConfirmInProgress={isLoading}
        open={confirmOpen}
        cancelLabel="No, go back"
        confirmLabel="Yes, submit"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      ></DialogConfirmation>
    </Box>
  );
};
