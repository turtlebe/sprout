import { Box, Switch, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    switch: 'switch',
  },
  'layersButtonItem'
);

export { dataTestIds as dataTestIdsLayersButtonItem };

export interface LayersButtonItem {
  icon: React.ReactNode;
  title: string;
  isChecked: boolean;
  handleToggle: (isChecked: boolean) => void;
  switchDataTestId?: string;
}

/**
 * Shared component so all items in the layers button popover look and
 * operate in the same way.
 */
export const LayersButtonItem: React.FC<LayersButtonItem> = ({
  icon,
  title,
  isChecked,
  handleToggle,
  switchDataTestId,
}) => {
  return (
    <Box m={0.5} display="flex" flexDirection="row" alignItems="center">
      <Box minWidth="2rem" textAlign="center" style={{ opacity: 0.8 }}>
        {icon}
      </Box>
      <Typography>{title}</Typography>
      <Box marginLeft="auto" paddingLeft="2px">
        <Switch
          data-testid={switchDataTestId || dataTestIds.switch}
          checked={isChecked}
          color="primary"
          onChange={(_e, checked) => handleToggle(checked)}
        />
      </Box>
    </Box>
  );
};
