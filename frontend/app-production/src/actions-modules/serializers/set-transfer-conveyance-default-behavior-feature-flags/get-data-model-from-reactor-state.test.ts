import { mockFeatureFlagsActionModel, mockTransferConveyanceReactorState } from '../../test-helpers';

import { getDataModelFromReactorState } from '.';

describe('getDataSchemaFromActionModel', () => {
  it('returns correct data model', () => {
    // ACT
    const result = getDataModelFromReactorState(mockFeatureFlagsActionModel, mockTransferConveyanceReactorState, {
      currentUser: { username: 'olittle' },
    } as any);

    // ASSERT
    expect(result).toEqual({
      lingering_carriers_management_enabled: { value: 'no' },
      buffer_management_enabled: { value: 'no' },
      empty_carriers_at_pre_harvest_lanes_management_enabled: { value: 'no' },
      pickup_robot_routing_enabled: { value: 'no' },
      routing_path_override_enabled: { value: 'no' },
      pre_harvest_buffer_flow_routing_enabled: { value: 'no' },
      submitter: 'olittle',
      submission_method: 'FarmOS UI',
    });
  });
});
