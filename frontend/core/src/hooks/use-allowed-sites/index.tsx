import { flatMap } from 'lodash';

const ALL_SITES = ['SANDBOX', 'SSF1', 'TIGRIS', 'LAR1'];
const SUBSITES = {
  SANDBOX: [],
  SSF1: ['SSF1_MTR', 'SSF1_NARW'],
  TIGRIS: [],
  LAR1: [],
};
const SITE_TO_FARM_PATH_MAPPING = {
  SSF1: 'sites/SSF2/farms/Taurus',
  TIGRIS: 'sites/SSF2/farms/Tigris',
  SANDBOX: 'sites/TEST/farms/TestFarm1',
  LAR1: 'sites/LAR1/farms/Laramie',
  LAX1: 'sites/LAX1/farms/LAX1',
};

// hack to map user store's site to farm def farms
export function siteToFarmPath(site: string): string {
  return SITE_TO_FARM_PATH_MAPPING[site];
}

// hack farm def farms to map user store's site
export function farmPathToSite(path: string): string {
  return Object.keys(SITE_TO_FARM_PATH_MAPPING).find(key => SITE_TO_FARM_PATH_MAPPING[key] === path);
}

export function isSubsite(site: string): boolean {
  return flatMap(SUBSITES).includes(site);
}

export function getSite(subsite: string): string {
  if (isSubsite(subsite)) {
    const [site] = subsite.split('_');
    return site;
  }
}

export interface UseAllowedSites {
  subsite?: boolean;
}

interface UseAllowedSitesReturn {
  primarySite: string;
  allowedSites: string[];
}

/**
 * Return primary site and allowed site of the current user.
 *
 * @param options @see useAllowedSites
 * @return @see UseAllowedSitesReturn
 */
export const useAllowedSites = (options?: UseAllowedSites): UseAllowedSitesReturn => {
  const allowedSites = ALL_SITES;
  const allowedSubsites = options?.subsite ? flatMap(allowedSites, site => SUBSITES[site]) : [];
  const allowedSitesAndSubsites = allowedSites.concat(allowedSubsites).sort((a, b) => a.localeCompare(b));

  return {
    primarySite: 'TIGRIS',
    allowedSites: allowedSitesAndSubsites,
  };
};
