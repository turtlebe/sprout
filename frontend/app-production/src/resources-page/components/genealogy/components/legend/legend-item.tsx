import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const dataTestIds = {
  legendCategory: 'category',
};

interface CategoryItem {
  icon: JSX.Element;
  name: string;
}

interface LegendCategory {
  title: string;
  items: CategoryItem[];
}

export const LegendCategory: React.FC<LegendCategory> = props => {
  return (
    <Box mt={1}>
      <Typography variant="subtitle2">{props.title}</Typography>
      <Box data-testid={dataTestIds.legendCategory} display="flex" flexWrap="wrap" alignItems="center">
        {props.items.map(item => (
          <div key={item.name}>
            {item.icon}
            <Typography style={{ marginLeft: '0.25rem', marginRight: '1rem' }} component="span">
              {item.name}
            </Typography>
          </div>
        ))}
      </Box>
    </Box>
  );
};
