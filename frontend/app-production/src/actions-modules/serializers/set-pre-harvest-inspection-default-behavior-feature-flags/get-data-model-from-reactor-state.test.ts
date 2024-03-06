import { mockPreHarvestInspectionFeatureFlagsActionModel, mockPreHarvestReactorState } from '../../test-helpers';

import { getDataModelFromReactorState } from '.';

describe('getDataSchemaFromActionModel', () => {
  it('returns correct data model', () => {
    // ACT
    const result = getDataModelFromReactorState(
      mockPreHarvestInspectionFeatureFlagsActionModel,
      mockPreHarvestReactorState,
      {
        currentUser: { username: 'olittle' },
      } as any
    );

    // ASSERT
    expect(result).toEqual({
      submitter: 'olittle',
      submission_method: 'FarmOS UI',
      route_tower_after_inspection: { value: 'no' },
    });
  });
});
