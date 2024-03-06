import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  container: 'machine-diagram',
  displayName: 'machine-diagram-display-name',
};

export { dataTestIds as dataTestIdsMachineDiagram };

interface MachineDiagram {
  title: string;
  containerClassName?: string;
  machineClassName?: string;
  'data-testid'?: string;
}

export const MachineDiagram: React.FC<MachineDiagram> = ({
  title,
  containerClassName,
  machineClassName,
  children,
  'data-testid': dataTestId,
}) => {
  return (
    <Box className={containerClassName} mr={2} mb={2} data-testid={dataTestId || dataTestIds.container}>
      <Typography variant="subtitle2" data-testid={dataTestIds.displayName}>
        {title}
      </Typography>
      <Box borderRadius="4px" bgcolor="white" className={machineClassName}>
        {children}
      </Box>
    </Box>
  );
};
