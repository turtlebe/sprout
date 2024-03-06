import { getYupBooleanValidator } from './boolean-validator';

describe('getYupBooleanValidator()', () => {
  function getTestValidator(type: ProdActions.FundamentalFieldTypes = 'TYPE_BOOL', isOptional?: boolean) {
    const boolArg: ProdActions.FundamentalField = {
      name: 'test_field',
      displayName: 'Test Field',
      type,
      options: {
        farmosRpc: {
          description: 'boolean field',
          isOptional,
        },
      },
    };
    return getYupBooleanValidator(boolArg, isOptional);
  }

  it('returns undefined if argument is not bool', () => {
    const validator = getTestValidator('TYPE_STRING');
    expect(validator).toBeUndefined();
  });

  it('gives error for invalid boolean type', () => {
    const validator = getTestValidator();
    expect(validator.isValidSync('t')).toBe(false);
    expect(validator.isValidSync('f')).toBe(false);
    expect(validator.isValidSync('')).toBe(false);
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });

  it('gives no error for valid boolean', () => {
    const validator = getTestValidator();
    expect(validator.isValidSync('true')).toBe(true);
    expect(validator.isValidSync('false')).toBe(true);
  });

  it('succeeds because field is optional', () => {
    const validator = getTestValidator('TYPE_BOOL', true);
    expect(validator.isValidSync(undefined)).toBe(true);
    expect(validator.isValidSync(null)).toBe(true);
    expect(validator.isValidSync(false)).toBe(true);
    expect(validator.isValidSync(true)).toBe(true);
  });

  it('fails because field is required', () => {
    const validator = getTestValidator('TYPE_BOOL', false);
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });
});
