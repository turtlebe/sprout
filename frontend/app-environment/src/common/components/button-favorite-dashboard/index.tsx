import { Star, StarBorder } from '@material-ui/icons';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useDeleteRequest, usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { Dashboard, UsersDashboard } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  root: 'button-favorite-dashboard-root',
};

export { dataTestIds as dataTestIdsButtonFavoriteDashboard };

export interface ButtonFavoriteDashboard {
  dashboard: Dashboard;
  usersDashboards?: UsersDashboard[];
  disableFetching?: boolean;
}

/**
 * Button that lets a User mark/unmark a Dashboard as favorite.
 */
export const ButtonFavoriteDashboard: React.FC<ButtonFavoriteDashboard> = ({
  dashboard,
  usersDashboards = [],
  disableFetching = false,
}) => {
  const [coreStore] = useCoreStore();
  const username = coreStore.currentUser.username;
  const snackbar = useGlobalSnackbar();
  const [isFavorite, setIsFavorite] = React.useState<boolean>(
    Boolean(usersDashboards.find(usersDashboard => dashboard.id === usersDashboard.dashboardId))
  );
  const {
    data: usersDashboardsData,
    isValidating,
    revalidate,
  } = useSwrAxios<PaginatedList<UsersDashboard>>(
    !disableFetching && {
      url: dashboard ? EVS_URLS.usersDashboards.listUrl({ dashboardId: dashboard.id, username }) : null,
    }
  );
  const { makeRequest: makePostRequest, isLoading: isPostLoading } = usePostRequest({
    url: EVS_URLS.usersDashboards.createUrl(),
  });
  const { makeRequest: makeDeleteRequest, isLoading: isDeleteLoading } = useDeleteRequest({
    url: EVS_URLS.usersDashboards.deleteUrl(dashboard),
    headers: { 'X-Username': username },
  });
  const isUpdating = isPostLoading || isDeleteLoading;

  React.useEffect(() => {
    if (!disableFetching) {
      setIsFavorite(usersDashboardsData?.data?.length > 0);
    }
  }, [usersDashboardsData, disableFetching]);

  const handleClick = () => {
    if (isUpdating) {
      return;
    }

    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);

    if (newIsFavorite) {
      makePostRequest({
        data: { dashboardId: dashboard.id, username },
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
      disabled={Boolean(!dashboard || isValidating)}
      onClick={handleClick}
      color={isFavorite ? 'secondary' : 'default'}
      icon={isFavorite ? Star : StarBorder}
      data-testid={dataTestIds.root}
    />
  );
};
