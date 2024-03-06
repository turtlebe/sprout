import { Close } from '@material-ui/icons';
import { Box, Drawer, IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    container: 'container',
    close: 'close',
  },
  'drawer-with-close'
);

export { dataTestIds as dataTestIdsDrawerWithClose };

export interface DrawerWithClose {
  open: boolean;
  onClose: () => void;
  title: JSX.Element;
  drawerWidth?: number;
  rightOffset?: number;
  closeDataTestId?: string;
}

/**
 * Renderers a Mui Drawer with a close button.
 * Takes an optional rightOffset prop to offset the drawer from the right side of the screen,
 * otherwise the drawer will be aligned to the right side of the screen.
 */
export const DrawerWithClose: React.FC<DrawerWithClose> = ({
  open,
  onClose,
  title,
  drawerWidth,
  rightOffset,
  closeDataTestId,
  children,
}) => {
  const classes = useStyles({ drawerWidth, rightOffset });

  return (
    <Drawer
      className={classes.drawer}
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      classes={{ paper: classes.drawerPaper }}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
      }}
    >
      <Box px={3} height="100%" data-testid={dataTestIds.container}>
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mt={1}>
            {title}
            <IconButton
              className={classes.closeIcon}
              size="small"
              color="default"
              icon={Close}
              onClick={onClose}
              data-testid={closeDataTestId || dataTestIds.close}
            />
          </Box>
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};
