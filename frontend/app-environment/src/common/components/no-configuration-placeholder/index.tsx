import { Edit } from '@material-ui/icons';
import { Box, Button, Card, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  title: 'no-configuration-placeholder-title',
  cta: 'no-configuration-placeholder-cta',
};

export { dataTestIds as dataTestIdsNoConfigurationPlaceholder };

export interface NoConfigurationPlaceholder {
  title: string;
  onClick?: () => void;
}

export const NoConfigurationPlaceholder: React.FC<NoConfigurationPlaceholder> = ({ title, onClick }) => {
  return (
    <Card>
      <Box padding={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography paragraph data-testid={dataTestIds.title}>
          {title}
        </Typography>
        <Button variant="contained" startIcon={<Edit />} onClick={onClick} data-testid={dataTestIds.cta}>
          Edit
        </Button>
      </Box>
    </Card>
  );
};
