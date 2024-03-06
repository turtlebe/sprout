import { CheckCircleOutline } from '@material-ui/icons';
import { CREATE_METRIC_URL } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { PlentyLink, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { Metric } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { buildMetricForPhqa } from '../../utils/build-metric-for-phqa';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'metric-status-root',
  passIcon: 'metric-status-pass-icon',
  createMetricLink: 'metric-create-link',
  metricLink: 'metric-link',
};

export { dataTestIds as dataTestIdsMetricStatus };

export interface MetricStatus {
  dataTestId?: string;
  metric?: Metric;
  observationName: string;
  onCreateMetric?: () => void;
}

export const EV2_METRICS_PATH = '/environment-v2/metrics';

export const MetricStatus: React.FC<MetricStatus> = ({
  dataTestId,
  metric,
  onCreateMetric = () => {},
  observationName,
}) => {
  const classes = useStyles({});

  const [{ currentUser }] = useCoreStore();
  const { username } = currentUser;

  const snackbar = useGlobalSnackbar();

  const { makeRequest: createMetric } = usePostRequest({
    url: CREATE_METRIC_URL,
  });

  const isSynced = Boolean(metric);

  const handleCreateMetric = () => {
    createMetric({
      data: buildMetricForPhqa(username, observationName),
      onSuccess: () => {
        onCreateMetric();
        snackbar.successSnackbar('Created Metric with success');
      },
      onError: error => {
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ title: 'Error updating Alert Rules', message });
      },
    });
  };

  const currentStatusIcon = isSynced ? (
    <CheckCircleOutline data-testid={dataTestIds.passIcon} className={classes.passStatus} />
  ) : (
    <></>
  );
  const currentStatusText = isSynced ? (
    <PlentyLink data-testid={dataTestIds.metricLink} to={`${EV2_METRICS_PATH}/${metric.id}`}>
      Synced
    </PlentyLink>
  ) : (
    <Button data-testid={dataTestIds.createMetricLink} onClick={handleCreateMetric}>
      Not Synced
    </Button>
  );

  return (
    <Box display="flex" data-testid={dataTestId ?? dataTestIds.root}>
      {currentStatusIcon}
      <span className={classes.current}>{currentStatusText}</span>
    </Box>
  );
};
