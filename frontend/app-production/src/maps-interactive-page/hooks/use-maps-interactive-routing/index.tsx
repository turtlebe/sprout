import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { useHistory } from 'react-router-dom';

import { useQueryParameter } from '../use-query-parameter';

interface UseMapsRoutingReturn {
  getMapsInteractiveRoute: (areaName?: string, lineName?: string) => string;
  routeToMapsInterative: (areaName?: string, lineName?: string) => void;
  basePath: string;
  resourcesPageBasePath: string;
}

/**
 * A hook to handle routing functions in the context of interactive maps
 * @returns {UseMapsRoutingReturn}
 */
export const useMapsInteractiveRouting = (): UseMapsRoutingReturn => {
  const { basePath: productionAppBasePath, resourcesPageBasePath } = useAppPaths();
  const basePath = `${productionAppBasePath}/maps/interactive`;

  const history = useHistory();
  const { resetParameters } = useQueryParameter();

  /**
   * Return the complete path to interactive maps given the area and line name
   * @param {string} areaName
   * @param {string} lineName
   * @returns {string} url
   */
  const getMapsInteractiveRoute = (areaName?: string, lineName?: string): string => {
    // when changing area/line then reset queryParameters to defaults and remove associated query parameter.
    const newSearch = resetParameters(['selectedDate', 'selectedCrops', 'ageCohortDate', 'selectedLabels'], false);

    const urlArr = [basePath];
    if (areaName) {
      urlArr.push(areaName);
    }
    if (lineName) {
      urlArr.push(lineName);
    }

    // if there any query params, add those
    return `${urlArr.join('/')}` + (newSearch ? `?${newSearch}` : '');
  };

  /**
   * Route to specific interactive maps page given the area and line name
   * @param {string} areaName
   * @param {string} lineName
   * @returns {string} url
   */
  const routeToMapsInterative = (areaName?: string, lineName?: string) => {
    const url = getMapsInteractiveRoute(areaName, lineName);
    history.push(url);
  };

  return {
    basePath,
    resourcesPageBasePath,
    getMapsInteractiveRoute,
    routeToMapsInterative,
  };
};
