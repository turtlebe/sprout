import { getMaterialCommentableId } from '@plentyag/app-production/src/common/utils';
import { COMMENTABLE_URLS } from '@plentyag/core/src/constants';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { Commentable, PaginatedList } from '@plentyag/core/src/types';
import { uniq } from 'lodash';
import React from 'react';

import { MapsState } from '../../types';

export interface UseLoadCommentablesReturn {
  commentables: Commentable[];
  isLoading: boolean;
}

export const useLoadCommentables = (mapsState: MapsState): UseLoadCommentablesReturn => {
  const commentableIds = React.useMemo(() => {
    if (!mapsState) {
      return [];
    }

    return uniq(
      Object.values(mapsState)
        .map(resource => getMaterialCommentableId(resource.resourceState))
        .filter(Boolean)
    );
  }, [mapsState]);

  const swrAxios = useSwrAxios<PaginatedList<Commentable>>(
    commentableIds.length > 0 && {
      url: COMMENTABLE_URLS.searchUrl(),
      method: 'POST',
      data: {
        ids: commentableIds,
        limit: commentableIds.length,
      },
    }
  );

  useLogAxiosErrorInSnackbar(swrAxios.error);

  return {
    commentables: swrAxios.data?.data ?? [],
    isLoading: swrAxios.isValidating,
  };
};
