/**
 * Util to return a well-formed base path of another application
 * It includes a feature of appending the current Global Site and Farm path
 * @param currentBasePath
 * @param appName
 * @param includeGlobalSiteFarm
 * @returns
 */
export const getBasePathForApp = (currentBasePath: string, appName: string, includeGlobalSiteFarm = false): string => {
  if (!currentBasePath.startsWith('/')) {
    throw new Error(`Base path "${currentBasePath}" is malformed`);
  }

  if (includeGlobalSiteFarm) {
    const globalSiteFarmContext = currentBasePath.split('/').slice(2);
    return `/${appName}/${globalSiteFarmContext.join('/')}`;
  }

  return `/${appName}`;
};
