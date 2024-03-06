import { Show } from '@plentyag/brand-ui/src/components/show';
import { Box, LinearProgress, Paper, PaperProps } from '@plentyag/brand-ui/src/material-ui/core';
import { CommentableType, ContextType } from '@plentyag/core/src/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { dataTestIdsListComments, ListComments, TextAreaComment } from './components';
import { getTextAreaCommentDataTestIds } from './components/text-area-comment';
import { useCommentsApi } from './hooks';

const dataTestIds = getScopedDataTestIds(
  {
    loader: 'loader',
    listComments: dataTestIdsListComments,
    newComment: getTextAreaCommentDataTestIds('new-comment'),
  },
  'CommentsWidget'
);

export { dataTestIds as dataTestIdsCommentsWidget };

export interface CommentsWidget {
  commentableId: string;
  commentableType: CommentableType;
  contextId: string;
  contextType: ContextType;

  /**
   * In the context of commenting on Materials in a Tower, we might also want to fetch comments
   * on the Materials before it was Transplanted.
   */
  inheritedCommentableId?: string;
  renderContext?: ListComments['renderContext'];
  variant?: PaperProps['variant'];
}

export const CommentsWidget: React.FC<CommentsWidget> = ({
  commentableId,
  commentableType,
  contextId,
  contextType,
  inheritedCommentableId,
  renderContext,
  variant,
}) => {
  const {
    newComment,
    total,
    setNewComment,
    isLoading,
    comments,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLoadNextComments,
  } = useCommentsApi({
    commentableId,
    commentableType,
    contextId,
    contextType,
    inheritedCommentableId,
  });

  return (
    <Paper variant={variant}>
      <Show when={isLoading}>
        <LinearProgress data-testid={dataTestIds.loader} />
      </Show>
      <Box padding={2} display="flex" flexDirection="column" gridGap="1rem">
        <ListComments
          comments={comments}
          inheritedCommentableId={inheritedCommentableId}
          total={total}
          onUpdate={handleUpdateComment}
          onDelete={handleDeleteComment}
          onLoadNextComments={handleLoadNextComments}
          isLoading={isLoading}
          renderContext={renderContext}
        />
        <TextAreaComment
          comment={newComment}
          onChange={setNewComment}
          onSubmit={handleCreateComment}
          disabled={isLoading}
          data-testid={dataTestIds.newComment.root}
        />
      </Box>
    </Paper>
  );
};
