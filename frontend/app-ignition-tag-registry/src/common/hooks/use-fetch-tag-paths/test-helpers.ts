import { mockTagPaths } from '@plentyag/app-ignition-tag-registry/src/common/test-helpers';

import { useFetchTagPaths } from '.';

jest.mock('@plentyag/app-ignition-tag-registry/src/hooks/use-fetch-tag-paths');

export function mockUseFetchTagPaths() {
  (useFetchTagPaths as jest.Mock).mockReturnValue({ tagPaths: mockTagPaths, isLoading: false });
}
