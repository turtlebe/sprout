import { Iframe } from '@plentyag/brand-ui/src/components/iframe';
import {
  RefreshButton,
  dataTestids as RefreshButtonDataTestIds,
} from '@plentyag/brand-ui/src/components/refresh-button';
import { Box, LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { useGetReport, useUpdateCache } from './hooks';
import { useStyles } from './styles';

const dataTestIds = {
  loader: 'loader',
  iframe: 'iframe',
  refreshButton: RefreshButtonDataTestIds,
};

export { dataTestIds as dataTestIdsSisenseDashboard };

interface SisenseDashboardUrlParams {
  dashboardName: string;
}

export interface SisenseDashboard {
  notFoundRedirectsTo?: string;
}

const TITLES = {
  'finished-goods': 'Finished Goods QA',
  postharvest: 'Postharvest QA',
  seedling: 'Seedling QA',
  sensory: 'Sensory',
  machines: 'Machines Summary',
};

export const SisenseDashboard: React.FC<
  Pick<RouteComponentProps<SisenseDashboardUrlParams>, 'match'> & SisenseDashboard
> = ({ match, notFoundRedirectsTo }) => {
  const { dashboardName } = match.params;

  const { data, isValidating, error } = useGetReport(dashboardName);

  const { makeRequest } = useUpdateCache(dashboardName);
  const [isIframeLoading, setIsIframeLoading] = React.useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>(null);
  const classes = useStyles({ isLoading: isValidating || isIframeLoading });
  const iframeRef = React.useRef(null);

  const handleClick = () => {
    iframeRef.current.contentWindow.postMessage({ event_type: 'refresh_charts' }, '*');

    void makeRequest({
      onSuccess: response => {
        setLastRefreshedAt(response.lastRefreshedAt);
      },
    });
  };

  React.useEffect(() => {
    if (data && data.lastRefreshedAt) {
      setLastRefreshedAt(data.lastRefreshedAt);
    }
  }, [data]);

  if (error?.response.status === 404) {
    return (
      <Redirect
        to={{
          pathname: notFoundRedirectsTo,
        }}
      />
    );
  }

  return (
    <>
      <LinearProgress data-testid={dataTestIds.loader} style={{ visibility: isValidating ? 'visible' : 'hidden' }} />
      <Box className={classes.view}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Typography variant="h4">{TITLES[dashboardName]}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            <RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={handleClick} />
          </Typography>
        </Box>

        <Iframe
          data-testid={dataTestIds.iframe}
          src={data?.url}
          className={classes.iframe}
          onLoad={() => setIsIframeLoading(false)}
          ref={iframeRef}
        />
      </Box>
    </>
  );
};
