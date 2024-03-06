interface GetParamsFromFarmDefPath {
  sitesNamespace?: string;
  siteName?: string;
  farmsNamespace?: string;
  farmName?: string;
}

/**
 * Parses currentFarmDefPath url into parts
 * - if the url does not match the "production" pattern then just return { root, app }
 * @param {string: currentFarmDefPath} path i.e. /production/sites/SSF2/farms/Tigris/maps/interactive
 * @returns {GetParamsFromFarmDefPath}
 */
export function getParamsFromFarmDefPath(farmDefPath: string): GetParamsFromFarmDefPath {
  const [sitesNamespace, siteName, farmsNamespace, farmName] = farmDefPath.split(/\//);
  return {
    sitesNamespace,
    siteName,
    farmsNamespace,
    farmName,
  };
}
