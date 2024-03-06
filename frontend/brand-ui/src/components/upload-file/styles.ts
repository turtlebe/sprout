import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export interface StyleProps {
  isDragActive?: boolean;
  isDragReject?: boolean;
  hasFile?: boolean;
}

export const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    border: ({ isDragActive, isDragReject, hasFile }: StyleProps) => {
      if (isDragReject) {
        return `2px dashed  ${theme.palette.error.main}`;
      }
      if (isDragActive) {
        return `2px dashed ${theme.palette.grey[500]}`;
      }
      if (hasFile) {
        return '2px dashed transparent';
      }

      return `2px dashed ${theme.palette.grey[300]}`;
    },
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  close: {
    position: 'absolute',
    right: '.5rem',
  },
}));
