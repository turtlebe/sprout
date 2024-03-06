import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export interface TabPanel {
  children?: React.ReactNode;
  index: string;
  value: string | false;
  'data-testid'?: string;
  className?: string;
}

export const TabPanel: React.FC<TabPanel> = props => {
  const { children, value, index, 'data-testid': dataTestId } = props;
  return value === index && children ? (
    <Box className={props.className} data-testid={dataTestId}>
      {children}
    </Box>
  ) : null;
};
