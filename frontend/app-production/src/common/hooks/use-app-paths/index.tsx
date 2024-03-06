import { getBasePathForApp } from '@plentyag/core/src/utils/get-base-path-for-app';
import React from 'react';

interface AppPathsContextValue {
  basePath: string;
  resourcesPageBasePath: string;
  reactorsAndTasksBasePath: string;
  reactorsAndTasksDetailBasePath: string;
  workspacesBasePath: string;
  workcentersBasePath: string;
  qualityBasePath: string;
  postharvestBasePath: string;
}

const AppPathsContext = React.createContext<AppPathsContextValue>(null);

interface AppPathsProvider {
  basePath: string;
}

/**
 * Provides various application paths - mostly used in production apps to provide navigation links.
 * basePath is the base path for the production app (ex: /production/sites/LAX1/farms/LAX1).
 * The basePath can change dynamically when for example the user selects a new site/farm
 * via the global site/farm picker in the production app (or provides a new site/farm via the URL).
 */
export const AppPathsProvider: React.FC<AppPathsProvider> = ({ basePath, children }) => {
  const resourcesPageBasePath = `${basePath}/resources`;
  const reactorsAndTasksBasePath = `${basePath}/reactors-and-tasks`;
  const reactorsAndTasksDetailBasePath = `${reactorsAndTasksBasePath}/detail`;
  const workspacesBasePath = `${basePath}/workspaces`;
  const workcentersBasePath = `${basePath}/workcenters`;

  const qualityBasePath = getBasePathForApp(basePath, 'quality', true);
  const postharvestBasePath = `${qualityBasePath}/postharvest`;

  const value: AppPathsContextValue = {
    basePath,
    resourcesPageBasePath,
    reactorsAndTasksBasePath,
    reactorsAndTasksDetailBasePath,
    workspacesBasePath,
    workcentersBasePath,
    qualityBasePath,
    postharvestBasePath,
  };

  return <AppPathsContext.Provider value={value}>{children}</AppPathsContext.Provider>;
};

export const useAppPaths = (): AppPathsContextValue => {
  return React.useContext(AppPathsContext);
};
