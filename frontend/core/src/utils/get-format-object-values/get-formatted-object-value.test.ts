import { Settings } from 'luxon';

import { getFormattedObjectValue } from './get-formatted-object-value';

describe('getFormattedObjectValue', () => {
  beforeAll(() => {
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  it('converts to valid date format', () => {
    // ACT
    const result = getFormattedObjectValue('2022-09-08');

    // ASSERT
    expect(result).toEqual('09/08/2022');
  });

  it('converts to valid date with time format', () => {
    // ACT
    const result = getFormattedObjectValue('2022-09-08T20:35:25.430837Z');

    // ASSERT
    expect(result).toEqual('09/08/2022 01:35 PM');
  });

  it('converts to valid date with time format (alternate)', () => {
    // ACT
    const result = getFormattedObjectValue('2022-09-05 15:30:00.000 -0700');

    // ASSERT
    expect(result).toEqual('09/05/2022 03:30 PM');
  });

  it('passes through a normal string value', () => {
    // ACT
    const result = getFormattedObjectValue('normal string value');

    // ASSERT
    expect(result).toEqual('normal string value');
  });

  it('passes through a normal number string value', () => {
    // ACT
    const result = getFormattedObjectValue('12345');

    // ASSERT
    expect(result).toEqual('12345');
  });

  it('passes through a normal number value', () => {
    // ACT
    const result = getFormattedObjectValue(123451);

    // ASSERT
    expect(result).toEqual(123451);
  });
});
