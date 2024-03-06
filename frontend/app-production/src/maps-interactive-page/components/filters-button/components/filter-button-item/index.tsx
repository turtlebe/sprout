import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    title: 'title',
  },
  'FilterButtonItem'
);

export { dataTestIds as dataTestIdsFilterButtonItem };

export interface FilterButtonItem {
  title: string;
  icon: React.ReactElement;
}

/**
 * Shared component so all items in the filters button popover look the same.
 */
export const FilterButtonItem: React.FC<FilterButtonItem> = ({ icon, title, children }) => {
  const classes = useStyles();

  return (
    <Box m={1.25}>
      <Box my={0.5} display="flex" flexDirection="row" alignItems="center">
        {icon}
        <Typography data-testid={dataTestIds.title} className={classes.title}>
          {title}
        </Typography>
      </Box>
      <Box paddingLeft="1.25rem">{children}</Box>
    </Box>
  );
};
