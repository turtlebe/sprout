import { getYupEnumValidator } from './enum-validator';

describe('getYupEnumValidator()', () => {
  function getTestValidator(type: ProdActions.EnumField['type'] = 'TYPE_ENUM', isOptional?: boolean) {
    const field: ProdActions.EnumField = {
      name: 'test_field',
      displayName: 'Test Field',
      typeName: 'long.path.Options',
      type,
      options: {
        farmosRpc: {
          description: 'boolean field',
          isOptional,
        },
      },
      enumOptions: {
        name: 'Options',
        value: [
          {
            name: 'no',
            number: 0,
          },
          {
            name: 'yes',
            number: 1,
          },
        ],
      },
    };
    return getYupEnumValidator(field, isOptional);
  }

  it('returns undefined if argument is not bool', () => {
    const validator = getTestValidator('TYPE_STRING' as any);
    expect(validator).toBeUndefined();
  });

  it('gives error for invalid enum choice', () => {
    const validator = getTestValidator();
    expect(validator.isValidSync('t')).toBe(false);
    expect(validator.isValidSync('0')).toBe(false);
    expect(validator.isValidSync('1')).toBe(false);
    expect(validator.isValidSync('')).toBe(false);
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });

  it('gives no error for valid choice', () => {
    const validator = getTestValidator();
    expect(validator.isValidSync('no')).toBe(true);
    expect(validator.isValidSync('yes')).toBe(true);
  });

  it('succeeds because field is optional', () => {
    const validator = getTestValidator('TYPE_ENUM', true);
    expect(validator.isValidSync(undefined)).toBe(true);
    expect(validator.isValidSync(null)).toBe(true);
  });

  it('fails because field is required', () => {
    const validator = getTestValidator('TYPE_ENUM', false);
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });
});
