import { useGetObservations } from '@plentyag/app-devices/src/common/hooks';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Card } from '@plentyag/brand-ui/src/components/card';
import { Box, Button, CircularProgress, Grid, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { usePostRequest } from '@plentyag/core/src/hooks';
import {
  DateTimeFormat,
  getExecutiveServiceRequestUrl,
  getExecutiveServiceSubmitterHeaders,
  parseErrorMessage,
} from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';
import { useHarmonicIntervalFn } from 'react-use';

import { useStyles } from './styles';

export const NO_CONSOLE_LOG_MESSAGE = 'No recent console logs found. Request the console log.';

const dataTestIds = {
  root: 'tab-panel-device-console-log-root',
  consoleLog: 'tab-panel-device-console-log-text',
  latestLogTimestamp: 'tab-panel-latest-log-timestamp',
  requestButton: 'tab-panel-request-hathor-console-log',
};

export { dataTestIds as dataTestIdsTabPanelHathorConsoleLog };

export interface TabPanelHathorConsoleLog {
  device;
  reloadRate?: number;
}

const RELOAD_RATE = 1000 * 30; // 30 seconds.

/**
 * Hathor devices send console logs when maualally requested. From the frontend POV, we just list these 'HathorConsoleLog' observations as they are.
 */
export const TabPanelHathorConsoleLog: React.FC<TabPanelHathorConsoleLog> = ({ device, reloadRate = RELOAD_RATE }) => {
  const classes = useStyles();

  // Holds when the latest timestamp when the console log was requested.
  const [latestConsoleLogRequest, setLatestConsoleLogRequest] = React.useState<DateTime>(null);

  const { makeRequest } = usePostRequest({
    url: getExecutiveServiceRequestUrl(device?.location?.interfaces?.Hathor?.methods?.CommandDevice?.path),
  });
  const snackbar = useGlobalSnackbar();
  const [state] = useCoreStore();
  const handleRequestConsoleLog = () => {
    setLatestConsoleLogRequest(DateTime.now().toUTC());
    makeRequest({
      // Command to request the console log from the Hathor.
      data: { command: 'SEND_CONSOLE_LOG', ...getExecutiveServiceSubmitterHeaders(state) },
      onSuccess: () => {
        snackbar.successSnackbar('Console log requested successfully. Please wait a couple of minutes.');
      },
      onError: error => {
        setLatestConsoleLogRequest(null);
        snackbar.errorSnackbar({ message: parseErrorMessage(error) });
      },
    });
  };

  // Load the console logs in the last 6 hour.
  const [from, setFrom] = React.useState(DateTime.now().toUTC().toISO());
  const { data, isValidating } = useGetObservations({
    device,
    observationName: 'HathorConsoleLog',
    amount: -6,
    unit: 'hour',
    from,
    limit: 100,
    order: 'asc',
  });

  const isWaitingForConsoleLog = () =>
    latestConsoleLogRequest != null &&
    latestConsoleLogRequest > DateTime.now().minus({ minutes: 10 }) &&
    (!data?.data ||
      data?.data?.length == 0 ||
      DateTime.fromSQL(data?.data?.[0].observedAt, { zone: 'utc' }) < latestConsoleLogRequest);

  useHarmonicIntervalFn(() => {
    // Automatically reload the logs if the console logs were requested until the new logs are received.
    // The reloading stops if no new logs were received for 10 minutes.
    if (isWaitingForConsoleLog()) {
      setFrom(DateTime.now().toUTC().toISO());
    }
  }, reloadRate);

  return (
    <Grid item xs={6}>
      <Card
        data-testid={dataTestIds.root}
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>Recent console logs</Typography>
            <Button
              endIcon={isWaitingForConsoleLog() && <CircularProgress size="1rem" />}
              disabled={!device.hasCertificate || isWaitingForConsoleLog()}
              color="secondary"
              variant="contained"
              onClick={handleRequestConsoleLog}
              data-testid={dataTestIds.requestButton}
            >
              Request Console Log
            </Button>
          </Box>
        }
        isLoading={isValidating}
        fallback={NO_CONSOLE_LOG_MESSAGE}
        doNotPadContent
      >
        {data?.data?.length > 0 && (
          <Box paddingLeft={2} paddingTop={2}>
            <Typography data-testid={dataTestIds.latestLogTimestamp}>
              <strong>
                Latest log received at{' '}
                {DateTime.fromSQL(data?.data?.[0].observedAt, { zone: 'utc' })
                  .toLocal()
                  .toFormat(DateTimeFormat.VERBOSE_DEFAULT)}
              </strong>
            </Typography>
            <Typography data-testid={dataTestIds.consoleLog} className={classes.consoleLog}>
              {data.data.map(observation => observation.valueString)}
            </Typography>
          </Box>
        )}
      </Card>
    </Grid>
  );
};
