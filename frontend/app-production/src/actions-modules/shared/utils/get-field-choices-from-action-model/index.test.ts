import { mockExecutionModeActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers/mock-action-models';

import { getFieldChoicesFromActionModel } from '.';

describe('getFieldChoicesFromActionModel', () => {
  it('returns the valid choices given a valid field name', () => {
    // ACT
    const result = getFieldChoicesFromActionModel(mockExecutionModeActionModel, 'default_behavior_execution_mode');

    // ASSERT
    expect(result).toEqual(['EXECUTE_DEFAULT_BEHAVIORS', 'DO_NOT_EXECUTE_DEFAULT_BEHAVIORS']);
  });

  it('returns an empty array given an invalid field name', () => {
    // ACT
    const result = getFieldChoicesFromActionModel(mockExecutionModeActionModel, 'not_found');

    // ASSERT
    expect(result).toEqual([]);
  });
});
