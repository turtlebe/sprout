import { PATHS } from '@plentyag/app-environment/src/paths';
import { LinkSuccess as Link, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Dashboard } from '@plentyag/core/src/types/environment';

export const dataTestIdLinkToDashboardPage = 'dataTestIdLinkToDashboardPage';

export interface useDashboardHandlerReturn {
  handleCreated: (responseOrId: Dashboard | string) => void;
  handleUpdated: (responseOrId: Dashboard | string) => void;
}

/**
 * Update/Create sucess handlers for Dashboards.
 */
export const useDashboardHandler = (): useDashboardHandlerReturn => {
  const snackbar = useGlobalSnackbar();

  const getLink = (responseOrId: Dashboard | string, isCreated?: boolean) => (
    <>
      <Link
        to={PATHS.dashboardPage(typeof responseOrId === 'object' ? responseOrId.id : responseOrId)}
        onClick={snackbar.closeSnackbar}
      >
        Dashboard
      </Link>{' '}
      successfully {isCreated ? 'created' : 'updated'}.
    </>
  );

  const handleCreated: useDashboardHandlerReturn['handleCreated'] = responseOrId => {
    snackbar.successSnackbar(getLink(responseOrId, true));
  };

  const handleUpdated: useDashboardHandlerReturn['handleUpdated'] = responseOrId => {
    snackbar.successSnackbar(getLink(responseOrId, false));
  };

  return { handleCreated, handleUpdated };
};
