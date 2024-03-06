import { mockRolledUpByTimeObservations } from '@plentyag/app-environment/src/common/test-helpers';

import { convertUnitForRolledUpByTimeObservation } from '.';

const conversionFn = values => values * 10;
const [observation] = mockRolledUpByTimeObservations;

describe('convertUnitForRolledUpByTimeObservation', () => {
  it('converts the numeric values using the conversion function', () => {
    const convertedObservation = convertUnitForRolledUpByTimeObservation(conversionFn)(observation);

    expect(convertedObservation.mean).toBe(100);
    expect(convertedObservation.median).toBe(200);
    expect(convertedObservation.min).toBe(300);
    expect(convertedObservation.max).toBe(400);
  });
});
