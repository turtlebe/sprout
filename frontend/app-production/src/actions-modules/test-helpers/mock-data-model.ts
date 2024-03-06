import { DataModel } from '@plentyag/app-production/src/actions-modules/types';

export const mockOverrideDataModel: DataModel = {
  rule_1_from: {
    value: 'GR1-1A',
  },
  rule_1_condition: {
    value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
  },
  rule_1_to: {
    value: 'GR1-1B',
  },
  rule_2_from: {
    value: 'GR1-1B',
  },
  rule_2_condition: {
    value: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING',
  },
  rule_2_to: {
    value: 'GR1-2A',
  },
  rule_3_from: {
    value: 'GR1-3A',
  },
  rule_3_condition: {
    value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
  },
  rule_3_to: {
    value: 'GR1-3B',
  },
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
  submitter: 'bishopthesprinkler',
  submission_method: 'FarmOS UI',
};

export const mockIncompleteOverrideRoutingDataModel: DataModel = {
  rule_1_from: {
    value: 'GR1-1A',
  },
  rule_1_condition: {
    value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
  },
  rule_1_to: {
    value: 'GR1-1B',
  },
  rule_2_from: {
    value: 'GR1-1B',
  },
  rule_2_condition: {
    value: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING',
  },
  rule_2_to: {
    value: 'GR1-2A',
  },
  rule_3_from: {
    value: 'GR1-3A',
  },
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
  submitter: 'bishopthesprinkler',
  submission_method: 'FarmOS UI',
};

export const mockMoveCarrierDataModel: DataModel = {
  carrier_id: 24,
  submission_method: 'FarmOS UI',
  submitter: 'olittle',
  to_location: {
    value: 'aux-buffer-1',
  },
};

export const mockPreHarvestInspectionFeatureFlagsDataModel: DataModel = {
  route_tower_after_inspection: { value: 'yes' },
  submitter: 'olittle',
  submission_method: 'FarmOS UI',
};

export const mockPreHarvestInspectionRoutingModeDataModel: DataModel = {
  mode: 'ROUTE_TO_PRE_HARVEST_LANE_2',
  submission_method: 'FarmOS UI',
  submitter: 'olittle',
};
