import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { Box, Card, CardContent, CardHeader, makeStyles, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { Action } from '../index';
const dataTestIds = { header: 'action-card-header' };

export { dataTestIds as dataTestIdsActionCard };

export const useStyles = makeStyles(() => ({
  card: {
    height: '100%',
  },
  link: {
    wordBreak: 'break-word',
    textDecoration: 'unset',
  },
  cardContent: {
    paddingTop: 0,
  },
}));

interface ActionCard {
  action: Action;
}

export const ActionCard: React.FC<ActionCard> = ({ action }) => {
  const { path, name, description, type } = action;
  const classes = useStyles();

  const { basePath } = useAppPaths();

  const pathToOpenAction = `${basePath}/actions/${path}`;

  const area = getKindFromPath(path, 'areas');
  const line = getKindFromPath(path, 'lines');
  const machine = getKindFromPath(path, 'machines');

  return (
    <Box m={2}>
      <Link
        className={classes.link}
        to={{
          pathname: pathToOpenAction,
        }}
      >
        <Card className={classes.card}>
          <CardHeader data-testid={dataTestIds.header} title={name} subheader={type} />
          <CardContent className={classes.cardContent}>
            <Typography>{description}</Typography>
            <Box mt={1} display="flex">
              {area && <Typography style={{ marginRight: '1rem' }}>Area: {area}</Typography>}
              {line && <Typography style={{ marginRight: '1rem' }}>Line: {line}</Typography>}
              {machine && <Typography>Machine: {machine}</Typography>}
            </Box>
          </CardContent>
        </Card>
      </Link>
    </Box>
  );
};
