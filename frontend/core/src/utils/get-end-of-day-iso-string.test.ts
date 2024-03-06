import { Settings } from 'luxon';

import { getEndOfDayISOString } from '.';

describe('getEndOfDayISOString', () => {
  beforeAll(() => {
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  it('returns iso format for end of day', () => {
    expect(getEndOfDayISOString('2021-06-24 00:00:00')).toBe('2021-06-25T06:59:59.999Z');
  });
});
