import { AgGridDialogRenderer } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

interface AgGridListCountDialogDetailsRenderer {
  list: object[];
  title: string;
}

/**
 * AgGrid renderer used to render a cell with a list of objects. Will render the cell
 * as the number of items in the list (0 if empty or null). The user can click
 * the cell to view a popover with the details of all items.
 * @param list The list of strings to be displayed.
 * @param title The title to be shown on the dialog display
 */
export const AgGridListCountDialogDetailsRenderer: React.FC<AgGridListCountDialogDetailsRenderer> = ({
  list,
  title,
}) => {
  const classes = useStyles({});

  if (!Array.isArray(list) || list.length === 0) {
    return <Typography className={classes.listItemCount}>0</Typography>;
  }

  return (
    <AgGridDialogRenderer
      cellText={'' + list.length}
      title={title}
      content={<Typography className={classes.listObjectDetails}>{JSON.stringify(list, null, '\t')}</Typography>}
    />
  );
};
