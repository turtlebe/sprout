import {
  mockOverrideRoutingTableActionModel,
  mockPreHarvestInspectionRoutingModeActionModel,
} from '@plentyag/app-production/src/actions-modules/test-helpers';

import { getFieldTypeFromActionModel } from '.';

describe('getFieldTypeFromActionModel', () => {
  it('returns field type given the action model and the field', () => {
    // ACT
    const result1 = getFieldTypeFromActionModel(mockOverrideRoutingTableActionModel, 'rule_1_condition');
    const result2 = getFieldTypeFromActionModel(mockPreHarvestInspectionRoutingModeActionModel, 'mode');

    // ASSERT
    expect(result1).toEqual('TYPE_MESSAGE');
    expect(result2).toEqual('TYPE_ENUM');
  });

  it('does not return anything if action model field is not found', () => {
    // ACT
    const result1 = getFieldTypeFromActionModel(mockOverrideRoutingTableActionModel, 'rule_11_condition');
    const result2 = getFieldTypeFromActionModel({ randomObject: 'nope' } as any, 'mode');

    // ASSERT
    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });
});
