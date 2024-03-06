import { Link as LinkIcon } from '@material-ui/icons';
import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import { Chip } from '@plentyag/brand-ui/src/material-ui/core';
import { Comment } from '@plentyag/core/src/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';
import { Link } from 'react-router-dom';

const dataTestIds = getScopedDataTestIds({}, 'CommentsWidgetContext');

export { dataTestIds as dataTestIdsCommentsWidgetContext };

export interface CommentsWidgetContext {
  comment: Comment;
}

export const CommentsWidgetContext: React.FC<CommentsWidgetContext> = ({ comment }) => {
  const { resourcesPageBasePath } = useMapsInteractiveRouting();

  return comment.contextId ? (
    <Chip
      data-testid={dataTestIds.root}
      label={comment.contextType}
      component={Link}
      to={`${resourcesPageBasePath}?q=${comment.contextId}`}
      size="small"
      icon={<LinkIcon />}
      clickable
      variant="outlined"
      color="primary"
    />
  ) : null;
};
