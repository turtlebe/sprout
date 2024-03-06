import { Link as LinkIcon } from '@material-ui/icons';
import { useAppPaths } from '@plentyag/app-production/src/common/hooks';
import {
  getMaterialCommentableId,
  getMaterialCommentableType,
  getMaterialContextId,
  getMaterialContextType,
} from '@plentyag/app-production/src/common/utils';
import { SearchActions, SearchState, useSearch } from '@plentyag/app-production/src/resources-page/hooks/use-search';
import { CommentsWidget } from '@plentyag/brand-ui/src/components';
import { Chip } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';
import { Link } from 'react-router-dom';

const dataTestIds = getScopedDataTestIds(
  {
    context: 'context',
  },
  'comments'
);

export { dataTestIds as dataTestIdsComments };

export const Comments: React.FC = () => {
  const [searchResult] = useSearch<SearchState['searchResult'], SearchActions>(state => state.searchResult);
  const { resourcesPageBasePath } = useAppPaths();

  if (!searchResult) {
    return null;
  }

  return (
    <CommentsWidget
      commentableId={getMaterialCommentableId(searchResult)}
      commentableType={getMaterialCommentableType(searchResult)}
      contextId={getMaterialContextId(searchResult)}
      contextType={getMaterialContextType(searchResult)}
      renderContext={comment =>
        comment.contextId && comment.contextId !== searchResult?.containerObj?.id ? (
          <Chip
            data-testid={dataTestIds.context}
            label={comment.contextType}
            component={Link}
            to={`${resourcesPageBasePath}?q=${comment.contextId}`}
            size="small"
            icon={<LinkIcon />}
            clickable
            variant="outlined"
            color="primary"
          />
        ) : null
      }
    />
  );
};
