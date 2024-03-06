import { Box, Popover, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { AgGridEmptyRenderer } from '../ag-grid-empty-renderer';

const dataTestIds = {
  cell: 'cell',
  popOver: 'pop-over',
};

export { dataTestIds as dataTestIdsAgGridListRenderer };

interface AgGridListRenderer {
  list: string[];
}

/**
 * AgGrid renderer used to render a cell with a list of strings. Will render the cell
 * as a comma separated list showing an ellipsis on overflow. The user can click
 * the cell to view a popover with the list of all items.
 * @param list The list of strings to be displayed.
 */
export const AgGridListRenderer: React.FC<AgGridListRenderer> = ({ list }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | undefined>(undefined);

  if (!Array.isArray(list) || list.length === 0) {
    return <AgGridEmptyRenderer />;
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const open = Boolean(anchorEl);

  const popOverContent = list.map((value, index) => {
    return <Typography key={index}>{value}</Typography>;
  });

  return (
    <>
      <Box data-testid={dataTestIds.cell} onClick={handleClick} display="flex" alignItems="center" overflow="hidden">
        <Box overflow="hidden" textOverflow="ellipsis">
          {list.join(', ')}
        </Box>
      </Box>
      <Popover
        data-testid={dataTestIds.popOver}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box p={1}>{popOverContent}</Box>
      </Popover>
    </>
  );
};
