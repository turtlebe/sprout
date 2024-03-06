import { mockExecutionModeActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers/mock-action-models';

import { getDataSchemaFromActionModel } from '.';

describe('getDataSchemaFromActionModel', () => {
  describe('converting an ActionModel to a valid Yup data schema', () => {
    it('should catch invalid data models', () => {
      // ARRANGE
      const schema = getDataSchemaFromActionModel(mockExecutionModeActionModel);

      // ACT
      const result1 = schema.isValidSync({
        unknown_field: { value: 'no' },
        submitter: '',
        submission_method: 'FarmOS UI',
      });
      const result2 = schema.isValidSync({
        default_behavior_execution_mode: { value: 'no' },
        submitter: '',
        submission_method: 'FarmOS UI',
      });
      const result3 = schema.isValidSync({
        default_behavior_execution_mode: 'EXECUTE_DEFAULT_BEHAVIORS',
        submitter: '',
        submission_method: 'FarmOS UI',
      });
      const result4 = schema.isValidSync({
        default_behavior_execution_mode: null,
        submitter: '',
        submission_method: 'FarmOS UI',
      });

      // ASSERT
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
      expect(result3).toBeFalsy();
      expect(result4).toBeFalsy();
    });

    it('should pass valid data models', () => {
      // ARRANGE
      const schema = getDataSchemaFromActionModel(mockExecutionModeActionModel);

      // ACT
      const result1 = schema.isValidSync({
        default_behavior_execution_mode: { value: 'EXECUTE_DEFAULT_BEHAVIORS' },
        submitter: '',
        submission_method: 'FarmOS UI',
      });
      const result2 = schema.isValidSync({
        default_behavior_execution_mode: {},
        submitter: '',
        submission_method: 'FarmOS UI',
      });

      // ASSERT
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });
  });
});
