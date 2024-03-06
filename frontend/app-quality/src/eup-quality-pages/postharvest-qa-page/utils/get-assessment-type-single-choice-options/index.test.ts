import { mockAssessmentTypes } from '../../test-helpers/mock-assessment-types';
import { AssessmentTypeWithSingleChoiceValueType } from '../../types';

import { getAssessmentTypeSingleChoiceOptions } from '.';

describe('getAssessmentTypeSingleChoiceOptions', () => {
  const singleChoiceAssessmentType = mockAssessmentTypes[2] as AssessmentTypeWithSingleChoiceValueType;

  it('returns default value and label', () => {
    // ARRANGE
    const values = { skuWeight: undefined };

    // ACT
    const result = getAssessmentTypeSingleChoiceOptions(singleChoiceAssessmentType, values);

    // ASSERT
    expect(result).toEqual([
      {
        value: 'PASS',
        label: 'Pass',
      },
      {
        value: 'FAIL',
        label: 'Fail',
      },
    ]);
  });

  it('returns label override value and label (4.5 oz)', () => {
    // ARRANGE
    const values = { skuWeight: 4.5 };

    // ACT
    const result = getAssessmentTypeSingleChoiceOptions(singleChoiceAssessmentType, values);

    // ASSERT
    expect(result).toEqual([
      {
        value: 'PASS',
        label: '0-18 leaves',
      },
      {
        value: 'FAIL',
        label: '19+ leaves',
      },
    ]);
  });

  it('returns label override value and label (8.5 oz)', () => {
    // ARRANGE
    const values = { skuWeight: 8.5 };

    // ACT
    const result = getAssessmentTypeSingleChoiceOptions(singleChoiceAssessmentType, values);

    // ASSERT
    expect(result).toEqual([
      {
        value: 'PASS',
        label: '0-37 leaves',
      },
      {
        value: 'FAIL',
        label: '38+ leaves',
      },
    ]);
  });

  it('returns empty array if choices is not defined', () => {
    // ACT
    const result = getAssessmentTypeSingleChoiceOptions({ validation: {} } as any, {});

    // ASSERT
    expect(result).toEqual([]);
  });
});
