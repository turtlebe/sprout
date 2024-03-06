import {
  mockOverrideDataModel,
  mockPreHarvestInspectionRoutingModeDataModel,
} from '@plentyag/app-production/src/actions-modules/test-helpers/mock-data-model';

import { getDataModelFieldValue, getDataModelValue, getEmptyValue, isNestedField } from '.';

describe('getAndSetValue', () => {
  describe('isNestedField', () => {
    it('should return if type is a nested field', () => {
      // ACT
      const result = isNestedField('TYPE_MESSAGE');

      // ASSERT
      expect(result).toBeTruthy();
    });

    it('should return false if type is a fundamental field', () => {
      // ACT
      const result = isNestedField('TYPE_STRING');

      // ASSERT
      expect(result).toBeFalsy();
    });
  });

  describe('getEmptyValue', () => {
    it('should return an nested empty value (default TYPE_MESSAGE)', () => {
      // ACT
      const result1 = getEmptyValue();
      const result2 = getEmptyValue('TYPE_MESSAGE');

      // ASSERT
      expect(result1).toEqual({});
      expect(result2).toEqual({});
    });

    it('should return null if type is a fundamental field', () => {
      // ACT
      const result1 = getEmptyValue('TYPE_BOOL');
      const result2 = getEmptyValue('TYPE_ENUM');

      // ASSERT
      expect(result1).toEqual(null);
      expect(result2).toEqual(null);
    });
  });

  describe('getDataModelFieldValue', () => {
    it('should return valid value in correct { value } format for nested field', () => {
      // ACT
      const result1 = getDataModelFieldValue('this is a value');
      const result2 = getDataModelFieldValue('this is a value', 'TYPE_MESSAGE');

      // ASSERT
      expect(result1).toEqual({ value: 'this is a value' });
      expect(result2).toEqual({ value: 'this is a value' });
    });

    it('should return valid value for fundamental field', () => {
      // ACT
      const result = getDataModelFieldValue('this is a value', 'TYPE_ENUM');

      // ASSERT
      expect(result).toEqual('this is a value');
    });

    it('should return empty value in correct empty value format', () => {
      // ACT
      const result1 = getDataModelFieldValue(undefined);
      const result2 = getDataModelFieldValue(null);
      const result3 = getDataModelFieldValue(null, 'TYPE_FLOAT');
      const result4 = getDataModelFieldValue(undefined, 'TYPE_FLOAT');

      // ASSERT
      expect(result1).toEqual(getEmptyValue());
      expect(result2).toEqual(getEmptyValue());
      expect(result3).toEqual(getEmptyValue('TYPE_FLOAT'));
      expect(result4).toEqual(getEmptyValue('TYPE_FLOAT'));
    });
  });

  describe('getDataModelValue', () => {
    it('should return submitter or submission_method', () => {
      // ACT
      const result1 = getDataModelValue(mockOverrideDataModel, 'submitter');
      const result2 = getDataModelValue(mockOverrideDataModel, 'submission_method');

      // ASSERT
      expect(result1).toEqual('bishopthesprinkler');
      expect(result2).toEqual('FarmOS UI');
    });

    it('should return valid value in correct nested { value } format', () => {
      // ACT
      const result1 = getDataModelValue(mockOverrideDataModel, 'rule_1_from', 'TYPE_MESSAGE');
      const result2 = getDataModelValue(mockOverrideDataModel, 'rule_2_condition', 'TYPE_MESSAGE');
      const result3 = getDataModelValue(mockOverrideDataModel, 'rule_3_to');

      // ASSERT
      expect(result1).toEqual('GR1-1A');
      expect(result2).toEqual('WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING');
      expect(result3).toEqual('GR1-3B');
    });

    it('should return valid value for fundamental field type', () => {
      // ACT
      const result = getDataModelValue(mockPreHarvestInspectionRoutingModeDataModel, 'mode', 'TYPE_ENUM');

      // ASSERT
      expect(result).toEqual('ROUTE_TO_PRE_HARVEST_LANE_2');
    });

    it('should return null if the value is not found', () => {
      // ACT
      const result1 = getDataModelValue(mockOverrideDataModel, 'rule_4_from', 'TYPE_MESSAGE');
      const result2 = getDataModelValue(mockOverrideDataModel, 'invalid_field');
      const result3 = getDataModelValue(mockPreHarvestInspectionRoutingModeDataModel, 'invalid_field', 'TYPE_ENUM');

      // ASSERT
      expect(result1).toBeNull();
      expect(result2).toBeNull();
      expect(result3).toBeNull();
    });
  });
});
