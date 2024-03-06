import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  root: 'stacked-and-boxed-titles-root',
};

export { dataTestIds as dataTestIdsStackedBoxes };

export interface StackedAndBoxedTitles {
  titles: string[];
  'data-testid'?: string;
}

/**
 * This component renders a vertical stack of task titles where each title has a light-blue box around it.
 */
export const StackedAndBoxedTitles: React.FC<StackedAndBoxedTitles> = ({ titles, 'data-testid': dataTestId }) => {
  return (
    <Box display="flex" flexDirection="column" data-testid={dataTestId || dataTestIds.root}>
      {titles.map((title, index) => {
        return (
          <Typography
            key={title + index}
            style={{
              backgroundColor: '#dae8fc',
              border: 'solid 1px',
              lineHeight: '1.25',
              padding: '0.1rem 0.25rem',
              margin: '0.1rem 0.25rem',
            }}
          >
            {title}
          </Typography>
        );
      })}
    </Box>
  );
};
