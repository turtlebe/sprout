import CachedIcon from '@material-ui/icons/Cached';
import { Box, ButtonProps, CircularProgress, IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { getLuxonDateTime, getRelativeTime } from '@plentyag/core/src/utils';
import clsx from 'clsx';
import React from 'react';
import { useHarmonicIntervalFn } from 'react-use';

import { useStyles } from './styles';

export const dataTestids = {
  loader: 'report-refresh-button-loader',
  button: 'report-refresh-button-refreshButton',
  lastRefreshedAt: 'report-refresh-button-lastRefreshedAt',
};

interface OverridableClassName {
  text?: string;
}

export interface RefreshButton {
  lastRefreshedAt: string;
  onClick: ButtonProps['onClick'];
  delay?: number;
  classes?: OverridableClassName;
}

const parseLastRefreshedAt = lastRefreshedAt =>
  Boolean(lastRefreshedAt) && getRelativeTime(getLuxonDateTime(lastRefreshedAt).toJSDate());

export const RefreshButton: React.FC<RefreshButton> = ({ lastRefreshedAt, onClick, delay = 1000, classes }) => {
  const defaultClasses = useStyles();

  const [fromNow, setFromNow] = React.useState<string>(() => parseLastRefreshedAt(lastRefreshedAt));

  useHarmonicIntervalFn(() => {
    setFromNow(parseLastRefreshedAt(lastRefreshedAt));
  }, delay);

  if (!Boolean(fromNow)) {
    return <CircularProgress style={{ margin: 'auto 0.25rem' }} size="1rem" data-testid={dataTestids.loader} />;
  }

  return (
    <Box display="flex" alignItems="center">
      <IconButton size="small" icon={CachedIcon} onClick={onClick} data-testid={dataTestids.button} />
      <Box className={clsx(defaultClasses.text, classes?.text)} data-testid={dataTestids.lastRefreshedAt}>
        <Box>Last Refresh:&nbsp;</Box>
        <Box>
          <strong>{fromNow}</strong>
        </Box>
      </Box>
    </Box>
  );
};
