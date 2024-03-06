import { Show } from '@plentyag/brand-ui/src/components/show';
import { Box, Button, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Comment } from '@plentyag/core/src/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { UseCommentsApiReturn } from '../../hooks';
import { geListItemCommentDataTestIds, ListItemComment } from '../list-item-comment';

const dataTestIds = getScopedDataTestIds(
  {
    loadMore: 'loadMore',
    emptyPlaceholder: 'emptyPlaceholder',
    comment: (comment: Comment) => geListItemCommentDataTestIds(`comment-${comment.id}`),
  },
  'ListComments'
);

export { dataTestIds as dataTestIdsListComments };

export interface ListComments {
  comments: Comment[];
  total: number;
  onUpdate: UseCommentsApiReturn['handleUpdateComment'];
  onDelete: UseCommentsApiReturn['handleDeleteComment'];
  onLoadNextComments: UseCommentsApiReturn['handleLoadNextComments'];
  isLoading: boolean;
  inheritedCommentableId?: string;
  renderContext?: ListItemComment['renderContext'];
}

export const ListComments: React.FC<ListComments> = ({
  comments = [],
  total,
  onUpdate,
  onDelete,
  onLoadNextComments,
  isLoading,
  inheritedCommentableId,
  renderContext,
}) => {
  const [lastCommentRef, setLastCommentRef] = React.useState<HTMLDivElement>();

  React.useEffect(() => {
    lastCommentRef && lastCommentRef.scrollIntoView && lastCommentRef.scrollIntoView();
  }, [lastCommentRef]);

  return (
    <Box display="flex" gridGap="1rem" flexDirection="column" style={{ overflowY: 'auto', maxHeight: '400px' }}>
      <Show when={comments.length < total}>
        <Button data-testid={dataTestIds.loadMore} onClick={onLoadNextComments}>
          Load More
        </Button>
      </Show>
      <Show
        when={comments.length > 0}
        fallback={
          <Show when={!isLoading}>
            <Typography align="center" data-testid={dataTestIds.emptyPlaceholder}>
              No comments yet.
            </Typography>
          </Show>
        }
      >
        {comments.map(comment => (
          <ListItemComment
            key={comment.id}
            comment={comment}
            immutable={inheritedCommentableId && comment.commentableId === inheritedCommentableId}
            onUpdate={onUpdate}
            onDelete={onDelete}
            renderContext={renderContext}
            data-testid={dataTestIds.comment(comment).root}
            ref={ref => (comment.id === comments[comments.length - 1].id ? setLastCommentRef(ref) : null)}
          />
        ))}
      </Show>
    </Box>
  );
};
