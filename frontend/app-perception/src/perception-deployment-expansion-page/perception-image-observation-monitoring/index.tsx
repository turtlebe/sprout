import { Show } from '@plentyag/brand-ui/src/components';
import { CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useGetObservations } from '@plentyag/core/src/hooks';
import React, { Fragment } from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  perceptionDeploymentImageObservationsResults: 'perception-deployment-image-observations-monitor-result',
  perceptionDeploymentImageObservationsResultsNumber: 'perception-deployment-image-observations-monitor-result-number',
  perceptionDeploymentImageObservationsResultsDate: 'perception-deployment-image-observations-monitor-result-date',
  isValidatingId: 'perception-deployment-image-observations-monitor-is-validating',
  errorMsg: 'perception-deployment-image-observations-monitor-error-msg',
};

export { dataTestIds as dataTestIdsPerceptionDeploymentImageObservationMonitor };

export const PerceptionDeploymentImageObservationMonitor: React.FC<{ path: string; hostName: string }> = ({
  path,
  hostName,
}) => {
  const classes = useStyles({});
  const { data, isValidating } = useGetObservations({
    path: path,
    observationName: 'CameraPerception',
    amount: -24,
    unit: 'hour',
    limit: 1000,
    partialPath: true,
  });

  if (!data && isValidating) {
    return (
      <div data-testid={dataTestIds.isValidatingId} className={classes.cameraPerceptionImagesObservationResults}>
        <CircularProgress size="2rem" />
      </div>
    );
  }
  if (data && !isValidating) {
    const getObservationListPublishedFromHost = data.data.filter(observation => observation.clientId === hostName);
    let totalObservationPublished = getObservationListPublishedFromHost.length;
    return (
      <Fragment>
        <div
          data-testid={dataTestIds.perceptionDeploymentImageObservationsResults}
          className={classes.cameraPerceptionImagesObservationResults}
        >
          <h3 data-testid={dataTestIds.perceptionDeploymentImageObservationsResultsNumber}>
            Number of images published over the last 24 hours: {totalObservationPublished}
          </h3>
          <Show when={totalObservationPublished > 0}>
            <h3 data-testid={dataTestIds.perceptionDeploymentImageObservationsResultsDate}>
              Last observation published at (in UTC): {getObservationListPublishedFromHost[0]?.createdAt}
            </h3>
          </Show>
        </div>
      </Fragment>
    );
  }
  if (!data && !isValidating) {
    return (
      <div data-testid={dataTestIds.errorMsg}>
        Failed to get observations. Please contact #farmos-support slack channel
      </div>
    );
  }
};
