import {
  mockExecutionModeActionModel,
  mockMoveCarrierActionModel,
  mockOverrideRoutingTableActionModel,
} from '@plentyag/app-production/src/actions-modules/test-helpers/mock-action-models';

import { getInitialDataModelFromActionModel } from '.';

describe('getInitialDataModelFromActionModel', () => {
  it('converts an ActionModel to a exec service Data Model (complex: OverrideRoutingTable)', () => {
    // ACT
    const result = getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel);

    // ASSERT
    expect(result).toEqual({
      rule_1_from: {},
      rule_1_condition: {},
      rule_1_to: {},
      rule_2_from: {},
      rule_2_condition: {},
      rule_2_to: {},
      rule_3_from: {},
      rule_3_condition: {},
      rule_3_to: {},
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
      submitter: '',
      submission_method: 'FarmOS UI',
    });
  });

  it('converts an ActionModel to a exec service Data Model (simple: DefaultBehavior)', () => {
    // ACT
    const result = getInitialDataModelFromActionModel(mockExecutionModeActionModel);

    // ASSERT
    expect(result).toEqual({
      default_behavior_execution_mode: {},
      submitter: '',
      submission_method: 'FarmOS UI',
    });
  });

  it('adds username if core state is passed through', () => {
    // ARRANGE
    const mockCoreState = { currentUser: { username: 'dude' } } as any;

    // ACT
    const result = getInitialDataModelFromActionModel(mockExecutionModeActionModel, mockCoreState);

    // ASSERT
    expect(result).toEqual({
      default_behavior_execution_mode: {},
      submitter: 'dude',
      submission_method: 'FarmOS UI',
    });
  });

  it('returns correct "null" value instead of empty object for non-nested fields', () => {
    // ARRANGE
    const mockCoreState = { currentUser: { username: 'dude' } } as any;

    // ACT
    const result = getInitialDataModelFromActionModel(mockMoveCarrierActionModel, mockCoreState);

    // ASSERT
    expect(result).toEqual({
      carrier_id: null,
      to_location: {},
      submitter: 'dude',
      submission_method: 'FarmOS UI',
    });
  });

  it('returns an empty object if the action model is not ready', () => {
    // ACT
    const result = getInitialDataModelFromActionModel(undefined);

    // ASSERT
    expect(result).toEqual({});
  });
});
