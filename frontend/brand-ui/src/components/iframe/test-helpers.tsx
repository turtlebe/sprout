import React from 'react';

export const MockIframeLoaded = ({ src, onLoad, ...props }, ref) => {
  React.useEffect(onLoad, [onLoad]);

  return <iframe ref={ref} data-testid={props['data-testid']} data-testsrc={src}></iframe>;
};

export const MockIframeLoading = (props, ref) => <iframe ref={ref} data-testid={props['data-testid']}></iframe>;
