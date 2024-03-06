import { ObservationSource } from '@plentyag/app-environment/src/common/components';
import { Box, Paper } from '@plentyag/brand-ui/src/material-ui/core';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { SourceType } from '@plentyag/core/src/types/environment';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'metric-source-root',
  sourceType: (sourceType: SourceType) => `metric-source-type-${sourceType}`,
  link: 'metric-source-link',
};

export { dataTestIds as dataTestIdsMetricSource };

export interface MetricSource {
  observation: RolledUpByTimeObservation;
  'data-testid'?: string;
}

/**
 * Render the source that powers a given Observation.
 *
 * For device, derived and ignition sources, we include a link to the various other apps.
 *
 * For other sources, we simply show the clientId, deviceId, tagPath.
 */
export const MetricSource: React.FC<MetricSource> = ({ observation, 'data-testid': dataTestId = dataTestIds.root }) => {
  const classes = useStyles({});

  return (
    <Paper variant="outlined" className={classes.root} data-testid={dataTestId}>
      <Box padding={1}>
        <ObservationSource observation={observation} />
      </Box>
    </Paper>
  );
};
