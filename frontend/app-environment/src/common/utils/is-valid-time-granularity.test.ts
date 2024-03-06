import { timeGranularities } from './constants';
import { isValidTimeGranularity } from './is-valid-time-granularity';

describe('isValidTimeGranularity', () => {
  it('returns true', () => {
    expect(
      isValidTimeGranularity({
        timeGranularity: timeGranularities.find(timeGranularity => timeGranularity.value === 1),
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-03T00:00:00Z'),
      })
    ).toBe(true);
    expect(
      isValidTimeGranularity({
        timeGranularity: timeGranularities.find(timeGranularity => timeGranularity.value === 60),
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-07T00:00:00Z'),
      })
    ).toBe(true);
  });

  it('returns false', () => {
    expect(
      isValidTimeGranularity({
        timeGranularity: timeGranularities.find(timeGranularity => timeGranularity.value === 1),
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-03T00:01:00Z'),
      })
    ).toBe(false);

    expect(
      isValidTimeGranularity({
        timeGranularity: timeGranularities.find(timeGranularity => timeGranularity.value === 5),
        startDateTime: new Date('2022-01-01T00:00:00Z'),
        endDateTime: new Date('2022-01-04T00:00:01Z'),
      })
    ).toBe(false);
  });
});
