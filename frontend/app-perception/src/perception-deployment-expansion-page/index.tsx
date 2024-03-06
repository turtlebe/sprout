import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useGetObservations } from '@plentyag/core/src/hooks';
import React, { Fragment } from 'react';
import { RouteComponentProps } from 'react-router';

import { DetailCameraInfoPage } from './detail-camera-info-page';
import { PerceptionDeploymentImageObservationMonitor } from './perception-image-observation-monitoring';
import { useStyles } from './styles';

const dataTestIds = {
  perceptionDeploymentExpansionHeader: 'perception-deployment-expansion-header',
  perceptionDeploymentExpansionHostName: 'perception-deployment-expansion-host-name',
  perceptionDeploymentExpansionIsValidating: 'perception-deployment-expansion-is-validating',
  perceptionDeploymentExpansionErrorMsg: 'perception-deployment-expansion-error-msg',
};

export { dataTestIds as dataTestIdsPerceptionDeploymentExpansionPage };

export interface PerceptionDeploymentPageUrlParams {
  path: string;
}

export const PerceptionDeploymentExpansionPage: React.FC<RouteComponentProps<PerceptionDeploymentPageUrlParams>> = ({
  match,
}) => {
  const classes = useStyles({});

  const perceptionDeploymentPath = match.params.path;
  const { data, isValidating } = useGetObservations({
    observationName: 'CameraGatewayHealthCheck',
    path: perceptionDeploymentPath,
    amount: -20,
    unit: 'minutes',
    limit: 1,
  });
  if (!data && isValidating) {
    return (
      <div data-testid={dataTestIds.perceptionDeploymentExpansionIsValidating} className={classes.circularProgress}>
        <CircularProgress size="2rem" />
      </div>
    );
  }

  if (data && !isValidating) {
    let datum = data.data[0].rawObservation.datum.observedDatum.datumValue.stringValue;
    let healthCheckMsg = JSON.parse(datum);
    let hostName = healthCheckMsg.device_hostname;
    return (
      <Fragment>
        <Box overflow="auto" height="100%">
          <Box className={classes.deploymentExpansionResults}>
            <h1 data-testid={dataTestIds.perceptionDeploymentExpansionHeader}>{perceptionDeploymentPath}</h1>
            <Box flex="row">
              <h3 data-testid={dataTestIds.perceptionDeploymentExpansionHostName}>Host: {hostName}</h3>
              <PerceptionDeploymentImageObservationMonitor path={perceptionDeploymentPath} hostName={hostName} />
            </Box>
            <h3>Associated Cameras:</h3>
            <Box paddingRight="2rem">
              <DetailCameraInfoPage results={healthCheckMsg?.cameras} />
            </Box>
          </Box>
        </Box>
      </Fragment>
    );
  } else {
    return (
      <div data-testid={dataTestIds.perceptionDeploymentExpansionErrorMsg} className={classes.errorMessage}>
        Something went wrong. Contact #farmos-support
      </div>
    );
  }
};
