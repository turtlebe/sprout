import { mockConsoleError } from '@plentyag/core/src/test-helpers';

import { CAN_NOT_RENDER_ERROR, getRecipeSettingValue } from '.';

describe('getRecipeSettingValue', () => {
  it('gets value for single setting with primitive type', () => {
    expect(getRecipeSettingValue(1)).toBe('1');
    expect(getRecipeSettingValue('str')).toBe('str');
    expect(getRecipeSettingValue(true)).toBe('true');
    expect(getRecipeSettingValue(false)).toBe('false');
  });

  it('gets value for setting with units', () => {
    expect(getRecipeSettingValue({ value: 1, units: 'm/s' })).toBe('1 m/s');
    expect(getRecipeSettingValue({ value: '2', units: 'm/s' })).toBe('2 m/s');
  });

  it('returns error when setting is neither primitive type or type with units', () => {
    const consoleError = mockConsoleError();

    // @ts-ignore
    expect(getRecipeSettingValue({ value: 1 })).toBe(CAN_NOT_RENDER_ERROR); // missing units
    // @ts-ignore
    expect(getRecipeSettingValue({})).toBe(CAN_NOT_RENDER_ERROR); // missing units
    expect(getRecipeSettingValue(undefined)).toBe(CAN_NOT_RENDER_ERROR); // missing units
    expect(getRecipeSettingValue(null)).toBe(CAN_NOT_RENDER_ERROR); // missing units

    expect(consoleError).toHaveBeenCalledTimes(4);
  });
});
