import { mockObservationGroups } from '@plentyag/core/src/test-helpers/mocks';

import { root } from '.';

const mockSites = [root.sites['SSF2'], root.sites['LAR1']];

export const mockUseSwrAxiosImpl = function (args) {
  if (!args || !args.url) {
    return { data: undefined, error: undefined, isValidating: false };
  }

  if (args.url.includes('search-object?kind=site')) {
    return { data: mockSites, isValidating: false };
  }

  if (args.url.includes(`get-object-by-id2/${root.sites['SSF2'].id}`)) {
    return { data: root.sites['SSF2'], isValidating: false };
  }

  if (args.url.includes(`get-object-by-path2/${root.sites['SSF2'].path}`)) {
    return { data: root.sites['SSF2'], isValidating: false };
  }

  if (args.url.includes('search-observation-groups')) {
    return { data: mockObservationGroups, isValidating: false };
  }

  return { data: undefined, error: undefined, isValidating: false };
};
