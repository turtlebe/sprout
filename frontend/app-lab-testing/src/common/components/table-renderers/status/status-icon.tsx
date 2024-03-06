import { Check, Close } from '@material-ui/icons';
import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

interface Props {
  status: boolean | null;
}

const useStyles = makeStyles(theme => ({
  error: {
    color: theme.palette.error.main,
  },
  success: {
    color: theme.palette.success.main,
  },
}));

export const StatusIcon: React.FC<Props> = ({ status }) => {
  const classes = useStyles({});

  if (status === false) {
    return <Close className={classes.error} fontSize="small" />;
  } else if (status === true) {
    return <Check className={classes.success} fontSize="small" />;
  }

  return null;
};
