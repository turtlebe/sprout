import { mockTagProviders } from '@plentyag/app-ignition-tag-registry/src/common/test-helpers';

import { useFetchTagProviders } from '.';

jest.mock('@plentyag/core/src/hooks/use-fetch-tag-providers');

export function mockUseFetchTagProviders() {
  (useFetchTagProviders as jest.Mock).mockReturnValue({ tagProviders: mockTagProviders, isLoading: false });
}
