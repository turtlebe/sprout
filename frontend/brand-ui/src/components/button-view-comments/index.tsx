import { ReactComponent as CommentIcon } from '@plentyag/brand-ui/src/assets/svg/comment-icon.svg';
import { IconButton, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { COMMENTS_URLS } from '@plentyag/core/src/constants';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { Comment, CommentableType, PaginatedList } from '@plentyag/core/src/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    lastComment: 'lastComment',
  },
  'ButtonViewComment'
);

export { dataTestIds as dataTestIdsButtonViewComments };

export const getButtonViewCommentsDataTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export interface ButtonViewComments {
  commentableId: string;
  commentableType: CommentableType;
  onClick?: () => void;
  'data-testid'?: string;
}

export const ButtonViewComments: React.FC<ButtonViewComments> = ({
  onClick,
  commentableId,
  commentableType,
  'data-testid': dataTestId,
}) => {
  const dataTestIdsWithPrefix = getButtonViewCommentsDataTestIds(dataTestId);
  const { data: paginatedList } = useSwrAxios<PaginatedList<Comment>>(
    commentableId && {
      url: COMMENTS_URLS.listUrl({ commentableIds: [commentableId], commentableType, limit: 1, order: 'desc' }),
    }
  );

  const title = React.useMemo(() => {
    const lastCommentContent = paginatedList?.data?.[0]?.content;

    return lastCommentContent ? (
      <span>
        View Comments:
        <br />
        <br />
        <span data-testid={dataTestIds.lastComment}>{lastCommentContent}</span>
      </span>
    ) : (
      <span>View Comments</span>
    );
  }, [paginatedList]);

  return (
    <Tooltip title={title}>
      <IconButton data-testid={dataTestIdsWithPrefix.root} icon={CommentIcon} onClick={onClick} />
    </Tooltip>
  );
};
