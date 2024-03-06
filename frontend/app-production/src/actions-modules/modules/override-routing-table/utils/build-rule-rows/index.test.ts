import {
  mockIncompleteOverrideRoutingDataModel,
  mockOverrideDataModel,
} from '@plentyag/app-production/src/actions-modules/test-helpers';

import { buildRuleRows } from '.';

describe('buildRuleRows', () => {
  it('returns a sequential array of available rule numbers', () => {
    // ACT
    const result1 = buildRuleRows(mockOverrideDataModel);
    const result2 = buildRuleRows(mockIncompleteOverrideRoutingDataModel);

    expect(result1).toEqual([1, 2, 3]);
    expect(result2).toEqual([1, 2, 3]);
  });
});
