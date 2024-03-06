import CommentIcon from '@material-ui/icons/Comment';
import { Show } from '@plentyag/brand-ui/src/components';
import { DialogConfirmation } from '@plentyag/brand-ui/src/components/dialog-confirmation';
import { Box, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { AgGridEmptyRenderer } from '../ag-grid-empty-renderer';

const dataTestIds = {
  cell: 'ag-grid-dialog-renderer-cell',
  popOver: 'ag-grid-dialog-renderer-pop-over',
  commentIcon: 'ag-grid-dialog-renderer-comment-icon',
};

export { dataTestIds as dataTestIdsAgGridDialogRenderer };

interface AgGridDialogRenderer {
  cellText: string;
  title: string;
  content: JSX.Element;
  showCommentIcon?: boolean;
  dialogWidth?: DialogConfirmation['dialogWidth'];
}

/**
 * AgGrid renderer used to render a cell with text - when click a dialog will
 * appear show the provided "content"
 * @param cellText Text to appear in ag-grid cell.
 * @param title Title of dialog.
 * @param content Dialog content.
 * @param showCommentIcon (default: false) Shows icon next to "cellText" with
 *  tooltip - so user knows they can click to see dialog.
 * @param dialogWidth (default: xl) Allows adjusting the width the dialog.
 */
export const AgGridDialogRenderer: React.FC<AgGridDialogRenderer> = ({
  cellText,
  title,
  content,
  showCommentIcon,
  dialogWidth = 'xl',
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | undefined>(undefined);

  if (!content) {
    return <AgGridEmptyRenderer />;
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        data-testid={dataTestIds.cell}
        onClick={handleClick}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Show when={showCommentIcon}>
          <Tooltip title="Click to view content.">
            <CommentIcon
              data-testid={dataTestIds.commentIcon}
              fontSize="small"
              style={{ opacity: 0.5, marginRight: '2px' }}
            />
          </Tooltip>
        </Show>
        {cellText}
      </Box>
      <DialogConfirmation
        dialogWidth={dialogWidth}
        open={open}
        title={title}
        confirmLabel="Close"
        onConfirm={handleClose}
      >
        {content}
      </DialogConfirmation>
    </>
  );
};
