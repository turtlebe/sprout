import { getMeasurementTypeLabel } from '.';

describe('getMeasurementTypeLabel', () => {
  it('titleize the measurement type key', () => {
    expect(getMeasurementTypeLabel('FLOW_RATE')).toBe('Flow Rate');
    expect(getMeasurementTypeLabel('FLOW_RATE_PLUS')).toBe('Flow Rate Plus');
  });
});
