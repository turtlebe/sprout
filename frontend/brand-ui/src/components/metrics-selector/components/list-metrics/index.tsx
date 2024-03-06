import { Truncated } from '@plentyag/brand-ui/src/components/truncated';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  SvgIcon,
} from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { groupBy, map } from 'lodash';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  subheader: (path: string) => `list-metrics-subheader-${path}`,
  item: (metric: Metric) => `list-metrics-item-${metric.id}`,
};

export { dataTestIds as dataTestIdsListMetrics };

type SvgIconComponent = typeof SvgIcon;

export interface ListMetrics {
  metrics: Metric[];
  onClick: (metric: Metric) => void;
  icon: SvgIconComponent;
}

/**
 * List Metrics grouped by path.
 */
export const ListMetrics: React.FC<ListMetrics> = ({ metrics, onClick, icon: Icon }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} variant="outlined">
      {map(groupBy(metrics, 'path'), (metrics, path) => (
        <List
          dense
          component="div"
          role="list"
          subheader={
            <ListSubheader className={classes.subheader} data-testid={dataTestIds.subheader(path)}>
              <Truncated text={getShortenedPath(path)} length={60} />
            </ListSubheader>
          }
          key={path}
        >
          {metrics.map(metric => (
            <ListItem
              key={metric.id}
              role="listitem"
              button
              onClick={() => onClick(metric)}
              data-testid={dataTestIds.item(metric)}
            >
              <ListItemText id={metric.id} primary={<Truncated text={metric.observationName} length={46} />} />
              <ListItemIcon className={classes.icon}>
                <Icon />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      ))}
    </Paper>
  );
};
