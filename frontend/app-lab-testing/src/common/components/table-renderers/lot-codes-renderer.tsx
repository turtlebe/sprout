import { makeStyles, Popover, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { Placeholder } from './placeholder-renderer';

interface Props {
  value: string[];
}

const useStyles = makeStyles(() => ({
  popupWrapper: {
    padding: '0.4rem',
    maxWidth: '15rem',
  },
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export const LotCodesRenderer: React.FC<Props> = ({ value }) => {
  const classes = useStyles({});
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | undefined>(undefined);

  if (!Array.isArray(value)) {
    return <Placeholder />;
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const valueToDisplay = value.map((value, index) => {
    return <Typography key={index}>{value}</Typography>;
  });
  return (
    <>
      <div onClick={handleClick} className={classes.text}>
        <div className={classes.text}>{value.toString()}</div>
      </div>
      <Popover
        id={id}
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
        <div className={classes.popupWrapper}>{valueToDisplay}</div>
      </Popover>
    </>
  );
};
