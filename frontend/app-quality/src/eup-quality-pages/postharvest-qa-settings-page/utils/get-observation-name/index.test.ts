import { getObservationFailName } from '.';

describe('getObservationFailName', () => {
  it('returns the correct observation name for fail metrics of an assessment type', () => {
    // ARRANGE
    const assessmentTypeName = 'largeLeaves';

    // ACT
    const result = getObservationFailName(assessmentTypeName);

    // ASSERT
    expect(result).toEqual('LargeLeavesFailPercentage');
  });
});
