import { mockAssessmentTypes } from '../../test-helpers/mock-assessment-types';
import { AssessmentTypeWithSingleChoiceValueType } from '../../types';

import { getAssessmentTypeTitle } from '.';

describe('getAssessmentTypeTitle', () => {
  const assessmentType = mockAssessmentTypes[3] as AssessmentTypeWithSingleChoiceValueType;

  it('returns default title', () => {
    // ARRANGE
    const values = { bestByDate: undefined };

    // ACT
    const result = getAssessmentTypeTitle(assessmentType, values);

    // ASSERT
    expect(result).toEqual('Best By Date Correct');
  });

  it('returns title override value', () => {
    // ARRANGE
    const values = { bestByDate: '12/12/2022' };

    // ACT
    const result = getAssessmentTypeTitle(assessmentType, values);

    // ASSERT
    expect(result).toEqual('Best By 12/12/2022');
  });
});
