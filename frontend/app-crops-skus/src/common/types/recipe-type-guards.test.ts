import {
  isRecipeSettingWithPrimitiveType,
  isRecipeSettingWithUnits,
  isRecipeWithListSettings,
  isRecipeWithSingleSetting,
  isRecipeWithTableSettings,
} from '.';

describe('Recipe type guard tests, ', () => {
  describe('isRecipeWithListSettings', () => {
    it('is valid', () => {
      expect(isRecipeWithListSettings({ test: 1, test2: 'str' })).toBe(true);
      expect(isRecipeWithListSettings({ test: true })).toBe(true);
      expect(isRecipeWithListSettings({ test: 'str' })).toBe(true);
      expect(isRecipeWithListSettings({ test: 1, test2: { units: 'm', value: 1 } })).toBe(true);
    });

    it('is not valid', () => {
      expect(isRecipeWithListSettings({})).toBe(false);
      expect(isRecipeWithListSettings(1)).toBe(false);
      expect(isRecipeWithListSettings('str')).toBe(false);
      expect(isRecipeWithListSettings(true)).toBe(false);
      expect(isRecipeWithListSettings(undefined)).toBe(false);
    });
  });

  describe('isRecipeWithSingleSetting', () => {
    it('is valid', () => {
      expect(isRecipeWithSingleSetting('test')).toBe(true);
      expect(isRecipeWithSingleSetting(1)).toBe(true);
      expect(isRecipeWithSingleSetting(false)).toBe(true);
      expect(isRecipeWithSingleSetting({ units: 'm', value: 1 })).toBe(true);
    });

    it('is not valid', () => {
      expect(isRecipeWithSingleSetting({ test: 1, test2: { units: 'm', value: 1 } })).toBe(false);
      expect(isRecipeWithSingleSetting({ test: 1 })).toBe(false);
      expect(isRecipeWithSingleSetting({})).toBe(false);
      expect(isRecipeWithSingleSetting(undefined)).toBe(false);
    });
  });

  describe('isRecipeSettingWithPrimitiveType', () => {
    it('is valid', () => {
      expect(isRecipeSettingWithPrimitiveType(1)).toBe(true);
      expect(isRecipeSettingWithPrimitiveType(true)).toBe(true);
      expect(isRecipeSettingWithPrimitiveType('str')).toBe(true);
    });

    it('is not valid', () => {
      expect(isRecipeSettingWithPrimitiveType({ value: 1, units: 'm' })).toBe(false);
      expect(isRecipeSettingWithPrimitiveType(undefined)).toBe(false);
      // @ts-ignore
      expect(isRecipeSettingWithPrimitiveType({})).toBe(false);
    });
  });

  describe('isRecipeSettingWithUnits', () => {
    it('is valid', () => {
      expect(isRecipeSettingWithUnits({ units: 'm', value: 5 })).toBe(true);
    });

    it('is not valid', () => {
      expect(isRecipeSettingWithUnits(1)).toBe(false);
      expect(isRecipeSettingWithUnits(true)).toBe(false);
      expect(isRecipeSettingWithUnits('str')).toBe(false);
      expect(isRecipeSettingWithUnits(undefined)).toBe(false);
      // @ts-ignore
      expect(isRecipeSettingWithUnits({ units: 'm' })).toBe(false);
    });
  });

  describe('isRecipeWithTableSettings', () => {
    it('is valid', () => {
      expect(isRecipeWithTableSettings({ '1': 1, '2': true, '3': 'str', '4': { value: 1, units: 'm' } })).toBe(true);
    });

    it('is not valid', () => {
      expect(isRecipeWithTableSettings({})).toBe(false);
      expect(isRecipeWithTableSettings(undefined)).toBe(false);
      // @ts-ignore
      expect(isRecipeWithTableSettings({ '4': { units: 'm' } })).toBe(false); // missing values
    });
  });
});
