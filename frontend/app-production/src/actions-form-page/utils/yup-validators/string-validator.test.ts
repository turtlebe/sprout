import { getYupStringValidator } from './string-validator';

describe('getYupStringValidator()', () => {
  function getTestValidator({
    type,
    rules,
    isOptional,
    isDisabled,
  }: {
    type: ProdActions.FundamentalFieldTypes;
    rules?: ProdActions.StringRules;
    isOptional?: boolean;
    isDisabled?: boolean;
  }) {
    const stringArg: ProdActions.FundamentalField = {
      name: 'test_field',
      displayName: 'Test Field',
      type,
      options: {
        farmosRpc: {
          description: 'some field',
          isOptional,
        },
        rules,
      },
    };
    return getYupStringValidator(stringArg.options, isOptional, isDisabled);
  }

  it('gives error for invalid string type', () => {
    const validator = getTestValidator({ type: 'TYPE_STRING' });
    expect(validator.isValidSync('')).toBe(false);
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });

  it('gives no error for valid string', () => {
    const validator = getTestValidator({ type: 'TYPE_STRING' });
    expect(validator.isValidSync('hello world')).toBe(true);
  });

  it('gives error if regex rule is not matched', () => {
    const rule = {
      string: {
        pattern: '[1-3][a-z]A{2}', // test regex pattern
      },
    };
    const validator = getTestValidator({ type: 'TYPE_STRING', rules: rule });
    expect(validator.isValidSync('1aAA')).toBe(true);
    expect(validator.isValidSync('4aAA')).toBe(false);
  });

  it('gives error if max length rule is violated', () => {
    const rule = {
      string: {
        maxLen: '5',
      },
    };
    const validator = getTestValidator({ type: 'TYPE_STRING', rules: rule });
    expect(validator.isValidSync('1234')).toBe(true);
    expect(validator.isValidSync('12345')).toBe(true);
    expect(validator.isValidSync('123456')).toBe(false);
  });

  it('give error if combo of rules is violated', () => {
    const rule = {
      string: {
        maxLen: '5',
        pattern: '[1-3][a-z]A+', // test regex pattern
      },
    };
    const validator = getTestValidator({ type: 'TYPE_STRING', rules: rule });
    expect(validator.isValidSync('1aA')).toBe(true);
    expect(validator.isValidSync('1aAAAAAA')).toBe(false);
    expect(validator.isValidSync('1a')).toBe(false);
  });

  it('succeeds because field is optional', () => {
    const rule = { string: { maxLen: '2' } };
    const validator = getTestValidator({ type: 'TYPE_STRING', rules: rule, isOptional: true });
    expect(validator.isValidSync(undefined)).toBe(true);
    expect(validator.isValidSync(null)).toBe(true);
    expect(validator.isValidSync('st')).toBe(true);
  });

  it('fails because field is required', () => {
    const rule = { string: { maxLen: '2' } };
    const validator = getTestValidator({ type: 'TYPE_STRING', rules: rule, isOptional: false });
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });

  it('does not apply rule when field is disabled', () => {
    const rule = { string: { maxLen: '2' } };
    const validator = getTestValidator({ type: 'TYPE_STRING', rules: rule, isOptional: false, isDisabled: true });

    // fails because field is still required
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
    expect(validator.isValidSync('')).toBe(false);

    // doesn't fail because rule is not applied when disabled.
    expect(validator.isValidSync('1')).toBe(true);
    expect(validator.isValidSync('123')).toBe(true);
  });
});
