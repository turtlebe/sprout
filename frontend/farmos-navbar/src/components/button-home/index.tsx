import { Button, ButtonProps, makeStyles } from '@material-ui/core';
import React from 'react';

import { PlentyLogo } from './plenty-logo';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.common.white,
    paddingLeft: 0,
    '& > span': {
      justifyContent: 'initial',
    },
  },
}));

export const dataTestIds = {
  root: 'componnents-app-bar-button-home',
  img: 'componnents-app-bar-button-home-img',
};

/**
 * Sub-component used by <AppBar /> to render a generic home Button.
 *
 * @param props ButtonProps
 */
export const ButtonHome: React.FC<ButtonProps> = props => {
  const classes = useStyles({});
  return (
    <Button href="/" {...props} className={classes.root} data-testid={dataTestIds.root}>
      <PlentyLogo style={{ height: '25px', color: '#FFFFFF' }} />
    </Button>
  );
};
