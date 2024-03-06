import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { startAnalytics, trackPageView } from '@plentyag/core/src/analytics';
import { CoreStoreProvider, useCoreStore } from '@plentyag/core/src/core-store';
import { useOverrideFarmDefPath } from '@plentyag/core/src/hooks';
import { isIgnition } from '@plentyag/core/src/utils/is-ignition';
import { AppBody, AppContainer, AppHeader } from '@plentyag/farmos-navbar/src';
import { createBrowserHistory } from 'history';
import React, { Suspense } from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import { Loading } from './components/app-state/loading';
import { PlentyErrorBoundary } from './components/error-boundary';
import { PlentyAppRoute } from './components/plenty-app-route';
import { getFarmPathFromUrl, handleRedirect, setLicenseKeys } from './utils';

setLicenseKeys();

const history = createBrowserHistory();

history.listen(location => trackPageView(location.pathname));

const AppRoutes: React.FC = React.memo(() => {
  const coreState = useCoreStore()[0];
  const currentUser = coreState?.currentUser;
  const farmOsModules = coreState?.farmOsModules;
  const hasCoreStateLoaded = currentUser && farmOsModules;
  const urlFarmPath = getFarmPathFromUrl(history.location.pathname);
  const farmPath = useOverrideFarmDefPath(
    currentUser?.currentFarmDefPath,
    currentUser?.allowedFarmDefPaths,
    urlFarmPath
  );
  const showNavBar = !isIgnition();

  startAnalytics(currentUser);

  return (
    <AppContainer>
      {showNavBar && (
        <AppHeader
          farmOsModules={farmOsModules || []}
          reactAppHostName="sprout"
          isDeveloper={currentUser?.isDeveloper()}
        />
      )}
      <AppBody>
        <Suspense fallback={<Loading />}>
          <Show when={Boolean(hasCoreStateLoaded && farmPath)} fallback={<Loading />}>
            <Switch>
              <PlentyAppRoute path={'/api-docs'} name="api-docs" />
              <PlentyAppRoute path={'/crops-skus'} name="crops-skus" />
              <PlentyAppRoute path={'/data-docs'} name="data-docs" />
              <PlentyAppRoute path={'/derived-observations'} name="derived-observations" />
              <PlentyAppRoute path={'/devices-v2'} name="devices" />
              <PlentyAppRoute path={'/environment-v2'} name="environment" />
              <PlentyAppRoute path={'/ignition-tag-registry'} name="ignition-tag-registry" />
              <PlentyAppRoute path={'/lab-testing'} name="lab-testing" />
              <PlentyAppRoute path={'/perception'} name="perception" />
              <PlentyAppRoute path={'/utilities'} name="utilities" />
              <PlentyAppRoute path={'/help'} name="help" />
              <PlentyAppRoute strict path={`/quality/${farmPath}`} name="quality" />
              <PlentyAppRoute strict path={`/production/${farmPath}`} name="production" />
              <PlentyAppRoute strict path={`/production-admin/${farmPath}`} name="production-admin" />
              <Route
                path={['/production', '/production-admin', '/quality']}
                render={routeProps =>
                  handleRedirect(routeProps.location.pathname, routeProps.location.search, farmPath)
                }
              />
            </Switch>
          </Show>
        </Suspense>
      </AppBody>
    </AppContainer>
  );
});

export const App: React.FC = React.memo(() => {
  return (
    <PlentyErrorBoundary>
      <Router history={history}>
        <GlobalSnackbar>
          <CoreStoreProvider>
            <AppRoutes />
          </CoreStoreProvider>
        </GlobalSnackbar>
      </Router>
    </PlentyErrorBoundary>
  );
});
