import { mockAssessmentTypes } from '../../test-helpers/mock-assessment-types';

import { getAssessmentTypeOverrideConfig } from '.';

describe('getAssessmentTypeOverrideConfig', () => {
  const labelOverride = mockAssessmentTypes[2].instructions.labelOverride;
  const titleOverride = mockAssessmentTypes[3].instructions.titleOverride;

  it('should return true if met the requirements for label override', () => {
    // ARRANGE
    const values = {
      skuWeight: 5,
    };

    // ACT
    const result = getAssessmentTypeOverrideConfig(labelOverride, values);

    // ASSERT
    expect(result).toBeTruthy();
  });

  it('should return false if not met the requirements for label override', () => {
    // ARRANGE
    const values = {
      skuWeight: 2,
    };

    // ACT
    const result = getAssessmentTypeOverrideConfig(labelOverride, values);

    // ASSERT
    expect(result).toBeFalsy();
  });

  it('should return true if met the requirements for title override', () => {
    // ARRANGE
    const values = {
      bestByDate: '12/12/2022',
    };

    // ACT
    const result = getAssessmentTypeOverrideConfig(titleOverride, values);

    // ASSERT
    expect(result).toBeTruthy();
  });

  it('should return false if not met the requirements for title override', () => {
    // ARRANGE
    const values = {
      bestByDate: '',
    };

    // ACT
    const result = getAssessmentTypeOverrideConfig(titleOverride, values);

    // ASSERT
    expect(result).toBeFalsy();
  });
});
