import { getShortenedPath } from '@plentyag/core/src/utils';

export function getShortenedPathWithoutSiteAndArea(farmDefPath: string): string {
  const regexStartingWithSiteAndArea = new RegExp(/^sites\/.+\/areas\/.+\//);
  return regexStartingWithSiteAndArea.test(farmDefPath)
    ? getShortenedPath(farmDefPath, false).split('/').slice(2).join('/')
    : farmDefPath;
}
