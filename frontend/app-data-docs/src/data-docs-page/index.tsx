import { Iframe } from '@plentyag/brand-ui/src/components/iframe';
import { LinearProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

export const dataTestIds = {
  loader: 'loader',
  iframe: 'iframe',
};

export const DataDocsPage: React.FC = () => {
  const [isIframeLoading, setIsIframeLoading] = React.useState<boolean>(true);
  const classes = useStyles({ isLoading: isIframeLoading });

  return (
    <>
      <LinearProgress
        data-testid={dataTestIds.loader}
        className={classes.linearProgress}
        style={{ visibility: isIframeLoading ? 'visible' : 'hidden' }}
      />
      <Iframe
        data-testid={dataTestIds.iframe}
        src={'/api/data-docs/html/index.html'}
        className={classes.iframe}
        onLoad={() => setIsIframeLoading(false)}
      />
    </>
  );
};
