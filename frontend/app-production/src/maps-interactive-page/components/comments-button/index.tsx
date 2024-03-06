import {
  getMaterialCommentableId,
  getMaterialCommentableType,
  getMaterialContextId,
  getMaterialContextType,
  isCommentable,
} from '@plentyag/app-production/src/common/utils';
import { CommentsWidget, Show } from '@plentyag/brand-ui/src/components';
import { Box, Button, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { ContainerData } from '../../types';
import { DrawerWithClose } from '../drawer-with-close';

import { CommentsWidgetContext } from './components/comments-widget-context';

const dataTestIds = getScopedDataTestIds(
  {
    commentsContainer: 'commentsContainer',
  },
  'comments-button'
);

export { dataTestIds as dataTestIdsCommentsButton };

export interface CommentsButton {
  data: ContainerData;
  parentWidth: number;
}

/**
 * This components renders a button that opens a drawer displaying comments for Materials.
 */
export const CommentsButton: React.FC<CommentsButton> = ({ data, parentWidth }) => {
  const [showComments, setShowComments] = React.useState(false);

  return (
    <Show when={isCommentable(data?.resourceState)}>
      <Button data-testid={dataTestIds.root} onClick={() => setShowComments(true)} size="small" variant="outlined">
        View Comments
      </Button>

      <DrawerWithClose
        open={showComments}
        onClose={() => setShowComments(false)}
        rightOffset={parentWidth}
        title={<Typography variant="h6">Comments</Typography>}
        drawerWidth={800}
      >
        <Box flex="1 1 auto">
          <Box paddingY={0.5} data-testid={dataTestIds.commentsContainer}>
            <CommentsWidget
              variant="outlined"
              commentableId={getMaterialCommentableId(data?.resourceState)}
              commentableType={getMaterialCommentableType(data?.resourceState)}
              contextId={getMaterialContextId(data?.resourceState)}
              contextType={getMaterialContextType(data?.resourceState)}
              renderContext={comment => <CommentsWidgetContext comment={comment} />}
            />
          </Box>
        </Box>
      </DrawerWithClose>
    </Show>
  );
};
