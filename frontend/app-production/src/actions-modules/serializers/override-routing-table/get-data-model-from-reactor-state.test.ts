import { mockOverrideRoutingTableActionModel, mockTransferConveyanceReactorState } from '../../test-helpers';

import { getDataModelFromReactorState } from '.';

describe('getDataSchemaFromActionModel', () => {
  it('returns correct data model', () => {
    // ACT
    const result = getDataModelFromReactorState(
      mockOverrideRoutingTableActionModel,
      mockTransferConveyanceReactorState,
      { currentUser: { username: 'olittle' } } as any
    );

    // ASSERT
    expect(result).toEqual({
      rule_1_from: { value: 'GR1-1A' },
      rule_1_condition: { value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING' },
      rule_1_to: { value: 'GR1-1B' },
      rule_2_from: { value: 'GR1-1B' },
      rule_2_condition: { value: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING' },
      rule_2_to: { value: 'GR1-2A' },
      rule_3_from: { value: 'GR1-3A' },
      rule_3_condition: { value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING' },
      rule_3_to: { value: 'GR1-3B' },
      rule_4_from: {},
      rule_4_condition: {},
      rule_4_to: {},
      rule_5_from: {},
      rule_5_condition: {},
      rule_5_to: {},
      rule_6_from: {},
      rule_6_condition: {},
      rule_6_to: {},
      rule_7_from: {},
      rule_7_condition: {},
      rule_7_to: {},
      rule_8_from: {},
      rule_8_condition: {},
      rule_8_to: {},
      rule_9_from: {},
      rule_9_condition: {},
      rule_9_to: {},
      rule_10_from: {},
      rule_10_condition: {},
      rule_10_to: {},
      submitter: 'olittle',
      submission_method: 'FarmOS UI',
    });
  });
});
