import { Launch } from '@material-ui/icons';
import { ChipMetric, LegendColor } from '@plentyag/app-environment/src/common/components';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { Box, IconButton, Paper } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';
import { Link } from 'react-router-dom';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'related-metric-root',
  checkbox: 'related-metric-checkbox',
};

export { dataTestIds as dataTestIdsLinkMetric };

export interface LinkMetric {
  metric: Metric;
  color: string;
  'data-testid'?: string;
}

export const LinkMetric: React.FC<LinkMetric> = ({ metric, color, 'data-testid': dataTestId }) => {
  const classes = useStyles({});

  return (
    <Paper variant="outlined" className={classes.root}>
      <Box display="flex" alignItems="center" data-testid={dataTestId || dataTestIds.root} gridGap="0.5rem">
        <Link to={PATHS.metricPage(metric.id)}>
          <IconButton icon={Launch} />
        </Link>
        <LegendColor backgroundColor={color} />
        <ChipMetric metric={metric} />
      </Box>
    </Paper>
  );
};
