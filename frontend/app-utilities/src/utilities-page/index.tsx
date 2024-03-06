import { Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  LinearProgress,
  Typography,
  useTheme,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useGetData, usePostSync } from './hooks';
import { useStyles } from './styles';

export const dataTestIds = {
  loader: 'loader',
  buttonEditSpreadsheet: 'button-edit-spreadsheet',
  buttonSync: 'button-sync',
  buttonControls: 'button-controls',
  syncLoader: 'sync-button-loader',
  snackbar: 'utilities-snackbar',
  syncResponse: 'sync-response',
};

export const UtilitiesPage: React.FC = () => {
  document.title = 'FarmOS - Utilities';
  const theme = useTheme();
  const snackbarProps = useSnackbar();
  const { data, isValidating } = useGetData();
  const { data: syncResponse, isLoading, makeRequest } = usePostSync();
  const classes = useStyles({});

  const handleSync = () => {
    void makeRequest({
      onSuccess: () => snackbarProps.successSnackbar && snackbarProps.successSnackbar('Success!'),
      onError: () => snackbarProps.errorSnackbar && snackbarProps.errorSnackbar(),
    });
  };

  return (
    <>
      <LinearProgress data-testid={dataTestIds.loader} style={{ visibility: isValidating ? 'visible' : 'hidden' }} />
      <Container maxWidth="md" className={classes.container}>
        <Snackbar {...snackbarProps} />

        <Typography variant="h4" paragraph>
          Tigris Nutrient Dosing
        </Typography>

        <Typography paragraph>
          Bulk edit Tigris nutrient dosing schedule using google sheets and sync it with FarmOS
        </Typography>

        <Box display="flex" flex="0 0 auto" mb={theme.spacing(0.25)}>
          <Box mr={theme.spacing(0.25)}>
            <Button
              variant="contained"
              href={data?.sheet}
              disabled={Boolean(isValidating)}
              data-testid={dataTestIds.buttonEditSpreadsheet}
            >
              Edit in Google Sheets
            </Button>
          </Box>
          <Box mr={theme.spacing(0.25)}>
            <Button
              disabled={Boolean(isLoading)}
              variant="contained"
              onClick={handleSync}
              data-testid={dataTestIds.buttonSync}
            >
              Sync &nbsp;
              {isLoading && <CircularProgress data-testid={dataTestIds.syncLoader} size="1rem" />}
            </Button>
          </Box>
          <Button
            variant="contained"
            href={'/controls/TIGRIS/NUTRIENT?control=nutrient_dosing'}
            data-testid={dataTestIds.buttonControls}
          >
            Go To Nutrient Controls
          </Button>
        </Box>

        {syncResponse && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="inherit" component="pre" data-testid={dataTestIds.syncResponse}>
                {JSON.stringify(syncResponse, null, 2)}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};
