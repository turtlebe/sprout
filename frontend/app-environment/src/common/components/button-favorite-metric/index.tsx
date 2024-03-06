import { Star, StarBorder } from '@material-ui/icons';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useDeleteRequest, usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { Metric, UsersMetric } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  root: 'button-favorite-metric-root',
};

export { dataTestIds as dataTestIdsButtonFavoriteMetric };

export interface ButtonFavoriteMetric {
  metric: Metric;
  usersMetrics?: UsersMetric[];
  disableFetching?: boolean;
}

/**
 * Button that lets a User mark/unmark a Metric as favorite.
 */
export const ButtonFavoriteMetric: React.FC<ButtonFavoriteMetric> = ({
  metric,
  usersMetrics = [],
  disableFetching = false,
}) => {
  const [coreStore] = useCoreStore();
  const username = coreStore.currentUser.username;
  const snackbar = useGlobalSnackbar();
  const [isFavorite, setIsFavorite] = React.useState<boolean>(
    Boolean(usersMetrics.find(usersMetric => metric.id === usersMetric.metricId))
  );
  const {
    data: usersMetricsData,
    isValidating,
    revalidate,
  } = useSwrAxios<PaginatedList<UsersMetric>>(
    !disableFetching && {
      url: metric ? EVS_URLS.usersMetrics.listUrl({ metricId: metric.id, username }) : null,
    }
  );
  const { makeRequest: makePostRequest, isLoading: isPostLoading } = usePostRequest({
    url: EVS_URLS.usersMetrics.createUrl(),
  });
  const { makeRequest: makeDeleteRequest, isLoading: isDeleteLoading } = useDeleteRequest({
    url: EVS_URLS.usersMetrics.deleteUrl(metric),
    headers: { 'X-Username': username },
  });
  const isUpdating = isPostLoading || isDeleteLoading;

  React.useEffect(() => {
    if (!disableFetching) {
      setIsFavorite(usersMetricsData?.data?.length > 0);
    }
  }, [usersMetricsData, disableFetching]);

  const handleClick = () => {
    if (isUpdating) {
      return;
    }

    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);

    if (newIsFavorite) {
      makePostRequest({
        data: { metricId: metric.id, username },
        onSuccess: () => void revalidate(),
        onError: () => snackbar.errorSnackbar(),
      });
    } else {
      makeDeleteRequest({
        onSuccess: () => void revalidate(),
        onError: () => snackbar.errorSnackbar(),
      });
    }
  };

  return (
    <IconButton
      disabled={Boolean(!metric || isValidating)}
      onClick={handleClick}
      color={isFavorite ? 'secondary' : 'default'}
      icon={isFavorite ? Star : StarBorder}
      data-testid={dataTestIds.root}
    />
  );
};
