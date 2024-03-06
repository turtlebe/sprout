import { getDataSchemaFromActionModel } from '../../shared/utils';
import {
  mockIncompleteOverrideRoutingDataModel,
  mockOverrideDataModel,
  mockOverrideRoutingTableActionModel,
} from '../../test-helpers';

import { additionalValidation } from '.';

describe('AddtionalValidationTest', () => {
  it('should detect incomplete data', () => {
    // ARRANGE
    const dataSchema = getDataSchemaFromActionModel(mockOverrideRoutingTableActionModel);
    const updatedSchema = dataSchema.test(additionalValidation);

    // ACT
    // -- completely wrong object
    const result1 = updatedSchema.isValidSync({
      wrong_object: 'yup',
    });
    // -- incomplete rule 3
    const result2 = updatedSchema.isValidSync(mockIncompleteOverrideRoutingDataModel);
    // -- missing rules 6-10
    const result3 = updatedSchema.isValidSync({
      rule_1_from: {
        value: 'GR1-1A',
      },
      rule_1_condition: {
        value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
      },
      submitter: 'bishopthesprinkler',
      submission_method: 'FarmOS UI',
    });

    // ASSERT
    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
  });

  it('should detect complete data', () => {
    // ARRANGE
    const dataSchema = getDataSchemaFromActionModel(mockOverrideRoutingTableActionModel);
    const updatedSchema = dataSchema.test(additionalValidation);

    // ACT
    const result = updatedSchema.isValidSync(mockOverrideDataModel);

    // ASSERT
    expect(result).toBeTruthy();
  });
});
