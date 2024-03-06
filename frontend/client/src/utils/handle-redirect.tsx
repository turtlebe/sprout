import React from 'react';
import { Redirect } from 'react-router-dom';

import { getFarmPathFromUrl } from '.';

/**
 * This function inserts the "farmPath" (site and farm) into the url and redirects to the new url.
 * The url should be the format either;
 * 1. /production/site/{site}/farms/{farms}/...
 * 2. /production/...
 * In case 1, the result will replace the existing site and farm with one given by "farmPath".
 * In case 2, the url will be changed include the "farmPath".
 * In both cases, if there is trailing path or search, they will be preserved.
 *
 * if farmDefPath parameter is "sites/LAX1/farms/LAX1" then
 * ex1: /production/site/SSF2/farm/Tigris/actions?test=1 --> /production/site/LAX1/farms/LAX1/actions?test=1
 * ex2: /production/actions?test=1 --> /production/site/LAX1/farms/LAX1/actions?test=1
 *
 * @param urlPath The url pathname of the current url.
 * @param search The search query of the current url.
 * @param farmPath Site/Farm to be inserted into path.
 * @returns Redirect.
 */
export function handleRedirect(urlPath: string, search = '', farmPath: string) {
  // url begins with: ex: /production
  const parts = urlPath.split('/');
  const basePath = parts[1]; // ex: production
  const existingFarmPath = getFarmPathFromUrl(urlPath);
  const to = existingFarmPath
    ? urlPath.replace(existingFarmPath, farmPath)
    : urlPath.slice(0, basePath.length + 1) + '/' + farmPath + urlPath.slice(basePath.length + 1);
  return <Redirect to={`${to}${search}`} />;
}
