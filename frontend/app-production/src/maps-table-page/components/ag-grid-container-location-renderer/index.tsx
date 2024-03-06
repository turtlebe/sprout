import { Error as ErrorIcon } from '@material-ui/icons';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  conflictIcon: 'ag-grid-container-location-renderer-icon',
  root: 'ag-grid-container-location-renderer-root',
};

export { dataTestIds as dataTestIdsAgGridContainerLocationRenderer };

export interface AgGridContainerLocationRenderer {
  containerLocation: string;
  hasConflicts: boolean;
}

/**
 * This ag-grid cell renderer shows the given container location name.
 * If the container location has conflicts (that is, multiple containers at the
 * same location), then an error icon with tooltip is also displayed.
 */
export const AgGridContainerLocationRenderer: React.FC<AgGridContainerLocationRenderer> = ({
  containerLocation,
  hasConflicts,
}) => {
  return (
    <Box data-testid={dataTestIds.root} display="flex" alignItems="center">
      {containerLocation}
      <Show when={hasConflicts}>
        <Tooltip arrow title={<Typography>Multiple resources assigned to this location</Typography>}>
          <ErrorIcon
            data-testid={dataTestIds.conflictIcon}
            style={{ marginLeft: '0.25rem' }}
            fontSize="small"
            color="error"
          />
        </Tooltip>
      </Show>
    </Box>
  );
};
