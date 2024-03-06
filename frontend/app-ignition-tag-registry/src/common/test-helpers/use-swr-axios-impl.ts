import { mockTagPaths, mockTagProviders } from '@plentyag/app-ignition-tag-registry/src/common/test-helpers';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';

export const useSwrAxiosImpl = args => {
  if (!args || !args.url) {
    return { data: undefined, error: undefined, isValidating: false };
  }

  if (args.url.includes('search-measurement-types')) {
    return { data: mockMeasurementTypes, isValidating: false };
  } else if (args.url.includes('providers')) {
    return { data: mockTagProviders, isValidating: false };
  } else if (args.url.includes('tag-paths')) {
    return { data: mockTagPaths, isValidating: false };
  }

  return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
};
