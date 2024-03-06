import { getInitialDataModelFromActionModel } from '@plentyag/app-production/src/actions-modules/shared/utils';
import {
  mockIncompleteOverrideRoutingDataModel,
  mockOverrideDataModel,
  mockOverrideRoutingTableActionModel,
} from '@plentyag/app-production/src/actions-modules/test-helpers';

import {
  areAllRulesEmpty,
  getRule,
  isCompletedRule,
  isEmptyRule,
  isValidRule,
  restackRules,
  setRule,
  unsetRule,
} from '.';

describe('ModelUtils', () => {
  describe('setRule', () => {
    it('sets new values to a valid data model', () => {
      // ARRANGE
      const newValues = {
        from: 'GR1-4A',
        condition: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
        to: 'aux-buffer',
      };

      // ACT
      const result = setRule(mockOverrideDataModel, 4, newValues);

      // ASSERT
      expect(result['rule_4_from']).toEqual({ value: 'GR1-4A' });
      expect(result['rule_4_condition']).toEqual({ value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING' });
      expect(result['rule_4_to']).toEqual({ value: 'aux-buffer' });
    });
  });

  describe('unsetRule', () => {
    it('removes all the values of a particular rule', () => {
      // ACT
      const result = unsetRule(mockOverrideDataModel, 2);

      // ASSERT
      expect(result['rule_2_from']).toEqual({});
      expect(result['rule_2_condition']).toEqual({});
      expect(result['rule_2_to']).toEqual({});
    });
  });

  describe('getRule', () => {
    it('getRule => gets the values from a particular rule number', () => {
      // ACT
      const result = getRule(mockOverrideDataModel, 1);

      // ASSERT
      expect(result.from).toEqual('GR1-1A');
      expect(result.condition).toEqual('WAIT_FOR_CARRIER_FULL_BEFORE_MOVING');
      expect(result.to).toEqual('GR1-1B');
    });
  });

  describe('isCompletedRule', () => {
    it('returns true if the rule is completed', () => {
      // ACT
      const result = isCompletedRule(mockOverrideDataModel, 2);

      // ASSERT
      expect(result).toBeTruthy();
    });
    it('returns false if the rule is incomplete', () => {
      // ACT
      const result1 = isCompletedRule(mockIncompleteOverrideRoutingDataModel, 3);
      const result2 = isCompletedRule(mockIncompleteOverrideRoutingDataModel, 4);

      // ASSERT
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
  });

  describe('isEmptyRule', () => {
    it('returns true if the rule is empty', () => {
      // ACT
      const result = isEmptyRule(mockOverrideDataModel, 5);

      // ASSERT
      expect(result).toBeTruthy();
    });

    it('returns false if the rule is not empty', () => {
      // ACT
      const result1 = isEmptyRule(mockIncompleteOverrideRoutingDataModel, 2);
      const result2 = isEmptyRule(mockIncompleteOverrideRoutingDataModel, 3);

      // ASSERT
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
  });

  describe('areAllRulesEmpty', () => {
    it('returns true if all the rules are empty', () => {
      // ARRANGE
      const mockValues = getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel);

      // ACT
      const result = areAllRulesEmpty(mockValues);

      // ASSERT
      expect(result).toBeTruthy();
    });

    it('returns false if some rules are not empty', () => {
      // ARRANGE
      const mockValues = {
        ...getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
        rule_1_from: { value: 'aux-buffer-1' },
      };

      // ACT
      const result = areAllRulesEmpty(mockValues);

      // ASSERT
      expect(result).toBeFalsy();
    });
  });

  describe('isValidRule', () => {
    it('isValidRule => returns true if the rule is completely filled or completely empty', () => {
      // ACT
      const result1 = isValidRule(mockOverrideDataModel, 3);
      const result2 = isValidRule(mockOverrideDataModel, 4);

      // ASSERT
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });

    it('isValidRule => returns false if the rule is partially filled', () => {
      // ACT
      const result = isValidRule(mockIncompleteOverrideRoutingDataModel, 3);

      // ASSERT
      expect(result).toBeFalsy();
    });
  });

  describe('restackRules', () => {
    it('restackRules => should "restack" the rules as in defragmenting the rule sets', () => {
      // ACT
      const result = restackRules({
        rule_1_from: {
          value: 'GR1-1A',
        },
        rule_1_condition: {
          value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
        },
        rule_1_to: {
          value: 'GR1-1B',
        },
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
        rule_6_from: {
          value: 'GR1-1B',
        },
        rule_6_condition: {
          value: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING',
        },
        rule_6_to: {
          value: 'GR1-2A',
        },
        rule_7_from: {},
        rule_7_condition: {},
        rule_7_to: {},
        rule_8_from: {},
        rule_8_condition: {},
        rule_8_to: {},
        rule_9_from: {},
        rule_9_condition: {},
        rule_9_to: {},
        rule_10_from: {
          value: 'GR1-3A',
        },
        rule_10_condition: {
          value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
        },
        rule_10_to: {},
        submitter: 'bishopthesprinkler',
        submission_method: 'FarmOS UI',
      });

      // ASSERT
      expect(result).toEqual({
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
      });
    });
  });
});
