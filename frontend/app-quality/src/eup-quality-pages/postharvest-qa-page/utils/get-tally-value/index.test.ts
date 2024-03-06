import { mockPostharvestTallyMultipleSku } from '../../test-helpers/mock-postharvest-tally';

import { getTallyValue } from '.';

describe('getTallyValue', () => {
  it('parses a tally value into a concatenated string', () => {
    // ARRANGE
    const mockAssessmentTallyValue1 =
      mockPostharvestTallyMultipleSku.skuTallies[0].tallyResults.assessmentTally[0].values;
    const mockAssessmentTallyValue2 =
      mockPostharvestTallyMultipleSku.skuTallies[1].tallyResults.assessmentTally[1].values;

    // ACT
    const result1 = getTallyValue(mockAssessmentTallyValue1);
    const result2 = getTallyValue(mockAssessmentTallyValue2);

    // ASSERT
    expect(result1).toEqual('PASS: 1(50.0%), FAIL: 1(50.0%)');
    expect(result2).toEqual('PASS: 3(100.0%)');
  });

  it('returns "N/A" if value is falsy', () => {
    // ACT
    const result1 = getTallyValue(null);
    const result2 = getTallyValue(undefined);

    // ASSERT
    expect(result1).toEqual('N/A');
    expect(result2).toEqual('N/A');
  });
});
