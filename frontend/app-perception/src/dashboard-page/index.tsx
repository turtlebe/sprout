import { CircularProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useGetObservations } from '@plentyag/core/src/hooks';
import { NormalizedObservation } from '@plentyag/core/src/types';
import { uniq } from 'lodash';
import React from 'react';

import { PerceptionDeploymentItem } from './perception-deployment-item';
import { useStyles } from './styles';

const dataTestIds = {
  perceptionHeader: 'dashboard-perception-header',
  listItemId: (itemId: string) => `dashboard-deployment-item-${itemId}`,
  isValidatingId: 'dashboard-is-validating',
  errorMsg: 'dashboard-error-msg',
};

export { dataTestIds as dataTestIdsDashboardPage };

const getUniqueListOfObservationPaths = (data: NormalizedObservation[]) => {
  return uniq(data.map(observation => observation.path));
};

export const DashboardPage: React.FC = () => {
  const { data, isValidating } = useGetObservations({
    observationName: 'CameraGatewayHealthCheck',
    amount: -20,
    unit: 'minutes',
    limit: 100,
  });
  const classes = useStyles({});

  if (!data && isValidating) {
    return (
      <div data-testid={dataTestIds.isValidatingId} className={classes.circularProgress}>
        <CircularProgress size="2rem" />
      </div>
    );
  }

  if (!data && !isValidating) {
    return (
      <div data-testid={dataTestIds.errorMsg} className={classes.dashboardErrorMessage}>
        <Typography variant={'h5'}>No online Perception deployment found! Please contact #Farmos-support</Typography>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div>
        <h1 data-testid={dataTestIds.perceptionHeader} className={classes.deploymentHeader}>
          Perception Deloyments
        </h1>
        {data &&
          getUniqueListOfObservationPaths(data.data).map(path => (
            <ul key={path}>
              <li data-testid={dataTestIds.listItemId(path)}>
                <PerceptionDeploymentItem path={path} />
              </li>
            </ul>
          ))}
      </div>
    </React.Fragment>
  );
};
