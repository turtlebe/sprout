import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';

import { getPreferredUnit } from '.';

const temperature = mockMeasurementTypes.find(measurementType => measurementType.key === 'TEMPERATURE');

describe('getPreferredUnit', () => {
  it('returns the preferred unit when supported', () => {
    expect(getPreferredUnit(temperature, 'F')).toEqual(temperature.supportedUnits['F']);
    expect(getPreferredUnit(temperature, 'C')).toEqual(temperature.supportedUnits['C']);
  });

  it('returns the default unit when the preferred unit does not exist', () => {
    expect(temperature.defaultUnit).toBe('C');
    expect(getPreferredUnit(temperature, 'K')).toEqual(temperature.supportedUnits[temperature.defaultUnit]);
    expect(getPreferredUnit(temperature, 'K')).toEqual(temperature.supportedUnits[temperature.defaultUnit]);
  });
});
