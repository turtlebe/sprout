import { mockPreHarvestInspectionRoutingModeActionModel, mockPreHarvestReactorState } from '../../test-helpers';

import { getDataModelFromReactorState } from '.';

describe('getDataSchemaFromActionModel', () => {
  it('returns correct data model', () => {
    // ACT
    const result = getDataModelFromReactorState(
      mockPreHarvestInspectionRoutingModeActionModel,
      mockPreHarvestReactorState,
      {
        currentUser: { username: 'olittle' },
      } as any
    );

    // ASSERT
    expect(result).toEqual({
      submitter: 'olittle',
      submission_method: 'FarmOS UI',
      mode: 'ROUTE_TO_PRE_HARVEST_LANE_2',
    });
  });
});
