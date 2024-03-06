import { Settings } from 'luxon';

import { getStartOfDayISOString } from '.';

describe('getStartOfDayISOString', () => {
  beforeAll(() => {
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  it('returns iso format for start of day', () => {
    expect(getStartOfDayISOString('2021-05-02 00:00:00')).toBe('2021-05-02T07:00:00.000Z');
  });
});
