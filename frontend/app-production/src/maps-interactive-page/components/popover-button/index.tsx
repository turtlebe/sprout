import { Box, Chip, Popover, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    button: 'button',
    popoverContent: 'popover-content',
  },
  'popOverButton'
);

export { dataTestIds as dataTestIdsPopoverButton };

interface PopoverButton {
  handleClear?: () => void;
  buttonTitle: string;
  tooltipTitle?: string;
  icon: React.ReactElement;
  'button-data-testid'?: string;
}

/**
 * Common control used by layers and filters buttons.
 */
export const PopoverButton: React.FC<PopoverButton> = ({
  handleClear,
  buttonTitle,
  tooltipTitle,
  icon,
  children,
  'button-data-testid': buttonDataTestId,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement>(null);

  function handleTogglePopoverVisibility(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(current => (current ? null : event.currentTarget));
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip arrow enterDelay={500} title={<Typography>{tooltipTitle}</Typography>}>
        <Chip
          data-testid={buttonDataTestId || dataTestIds.button}
          icon={icon}
          color={handleClear ? 'primary' : 'default'}
          label={buttonTitle}
          onClick={handleTogglePopoverVisibility}
          onDelete={handleClear}
        />
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: -4,
          horizontal: 'right',
        }}
      >
        <Box data-testid={dataTestIds.popoverContent}>{children}</Box>
      </Popover>
    </>
  );
};
