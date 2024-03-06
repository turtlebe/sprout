import * as yup from 'yup';

import { getYupNumberValidator } from './number-validator';

describe('getYupNumberValidator()', () => {
  function getTestValidator(
    type: ProdActions.FundamentalFieldTypes,
    rules?: ProdActions.UInt32Rules | ProdActions.Int32Rules | ProdActions.FloatRules,
    isOptional?: boolean
  ) {
    const floatArg: ProdActions.FundamentalField = {
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
    return getYupNumberValidator(floatArg.options, type, isOptional);
  }

  function testIntRule(
    type: 'TYPE_INT32' | 'TYPE_UINT32',
    intOrUint32Rule: ProdActions.Int32Rules | ProdActions.UInt32Rules,
    expectations: (validator: yup.NumberSchema<number>) => void
  ) {
    const intValidator = getTestValidator(type, intOrUint32Rule);
    expectations(intValidator);
  }

  it('returns undefined if argument is not float, int32 or uint32', () => {
    const validator = getTestValidator('TYPE_STRING');
    expect(validator).toBeUndefined();
  });

  it('gives error for invalid float type', () => {
    const validator = getTestValidator('TYPE_FLOAT');
    expect(validator.isValidSync('not-a-float')).toBe(false);
    expect(validator.isValidSync('')).toBe(false);
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });

  it('gives error for invalid int32 type', () => {
    const validator = getTestValidator('TYPE_INT32');
    expect(validator.isValidSync('not-a-int32')).toBe(false);
    expect(validator.isValidSync('1.1')).toBe(false);
    expect(validator.isValidSync('-2.1')).toBe(false);
    expect(validator.isValidSync('0.1')).toBe(false);
    expect(validator.isValidSync('0.0001e1')).toBe(false);
    expect(validator.isValidSync('')).toBe(false);
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });

  it('gives error for invalid uint32 type', () => {
    const validator = getTestValidator('TYPE_UINT32');
    expect(validator.isValidSync('not-a-uint32')).toBe(false);
    expect(validator.isValidSync('1.1')).toBe(false);
    expect(validator.isValidSync('-2.1')).toBe(false);
    expect(validator.isValidSync('0.1')).toBe(false);
    expect(validator.isValidSync('-1')).toBe(false);
    expect(validator.isValidSync('-3.141')).toBe(false);
    expect(validator.isValidSync('0.0001e1')).toBe(false);
    expect(validator.isValidSync('')).toBe(false);
    expect(validator.isValidSync(undefined)).toBe(false);
    expect(validator.isValidSync(null)).toBe(false);
  });

  it('gives no error for valid float', () => {
    const validator = getTestValidator('TYPE_FLOAT');
    expect(validator.isValidSync('1.1')).toBe(true);
    expect(validator.isValidSync('-1.1')).toBe(true);
    expect(validator.isValidSync('1')).toBe(true);
    expect(validator.isValidSync('1.1e10')).toBe(true);
  });

  it('gives no error for valid int32', () => {
    const validator = getTestValidator('TYPE_INT32');
    expect(validator.isValidSync('1')).toBe(true);
    expect(validator.isValidSync('0')).toBe(true);
    expect(validator.isValidSync('-1')).toBe(true);
  });

  it('gives no error for valid uint32', () => {
    const validator = getTestValidator('TYPE_UINT32');
    expect(validator.isValidSync('1')).toBe(true);
    expect(validator.isValidSync('0')).toBe(true);
  });

  it('gives error if moreThan rule is violated', () => {
    const floatrules = {
      float: {
        gt: 5,
      },
    };
    const floatValidator = getTestValidator('TYPE_FLOAT', floatrules);
    expect(floatValidator.isValidSync('1')).toBe(false);
    expect(floatValidator.isValidSync('5.0')).toBe(false);
    expect(floatValidator.isValidSync('5.5')).toBe(true);

    function intExpectation(intValidator) {
      expect(intValidator.isValidSync('1')).toBe(false);
      expect(intValidator.isValidSync('5')).toBe(false);
      expect(intValidator.isValidSync('6')).toBe(true);
    }

    const intRules = {
      int32: {
        gt: 5,
      },
    };
    testIntRule('TYPE_INT32', intRules, intExpectation);

    const uintRules = {
      uint32: {
        gt: 5,
      },
    };
    testIntRule('TYPE_UINT32', uintRules, intExpectation);
  });

  it('gives error if greater than or equal rule is violated', () => {
    const floatrules = {
      float: {
        gte: 5,
      },
    };
    const floatValidator = getTestValidator('TYPE_FLOAT', floatrules);
    expect(floatValidator.isValidSync('1')).toBe(false);
    expect(floatValidator.isValidSync('4.99999')).toBe(false);
    expect(floatValidator.isValidSync('5.0')).toBe(true);
    expect(floatValidator.isValidSync('5.5')).toBe(true);

    function intExpectation(intValidator) {
      expect(intValidator.isValidSync('1')).toBe(false);
      expect(intValidator.isValidSync('5')).toBe(true);
      expect(intValidator.isValidSync('6')).toBe(true);
    }

    const intRules = {
      int32: {
        gte: 5,
      },
    };
    testIntRule('TYPE_INT32', intRules, intExpectation);

    const uintRules = {
      uint32: {
        gte: 5,
      },
    };
    testIntRule('TYPE_UINT32', uintRules, intExpectation);
  });

  it('gives error if less than rule is violated', () => {
    const floatrules = {
      float: {
        lt: 5,
      },
    };
    const floatValidator = getTestValidator('TYPE_FLOAT', floatrules);
    expect(floatValidator.isValidSync('1')).toBe(true);
    expect(floatValidator.isValidSync('4.99999')).toBe(true);
    expect(floatValidator.isValidSync('5.0')).toBe(false);
    expect(floatValidator.isValidSync('5.5')).toBe(false);

    function intExpectation(intValidator) {
      expect(intValidator.isValidSync('1')).toBe(true);
      expect(intValidator.isValidSync('5')).toBe(false);
      expect(intValidator.isValidSync('6')).toBe(false);
    }

    const intRules = {
      int32: {
        lt: 5,
      },
    };
    testIntRule('TYPE_INT32', intRules, intExpectation);

    const uintRules = {
      uint32: {
        lt: 5,
      },
    };
    testIntRule('TYPE_UINT32', uintRules, intExpectation);
  });

  it('gives error if less than or equal is rule violated', () => {
    const floatrules = {
      float: {
        lte: 5,
      },
    };
    const floatValidator = getTestValidator('TYPE_FLOAT', floatrules);
    expect(floatValidator.isValidSync('1')).toBe(true);
    expect(floatValidator.isValidSync('4.99999')).toBe(true);
    expect(floatValidator.isValidSync('5.0')).toBe(true);
    expect(floatValidator.isValidSync('5.5')).toBe(false);

    function intExpectation(intValidator) {
      expect(intValidator.isValidSync('1')).toBe(true);
      expect(intValidator.isValidSync('5')).toBe(true);
      expect(intValidator.isValidSync('6')).toBe(false);
    }

    const intRules = {
      int32: {
        lte: 5,
      },
    };
    testIntRule('TYPE_INT32', intRules, intExpectation);

    const uintRules = {
      uint32: {
        lte: 5,
      },
    };
    testIntRule('TYPE_UINT32', uintRules, intExpectation);
  });

  it('gives error if combo of rules is violated', () => {
    const intRules = {
      int32: {
        lt: 2,
        gt: 0,
      },
    };
    const floatValidator = getTestValidator('TYPE_INT32', intRules);
    expect(floatValidator.isValidSync('2')).toBe(false);
    expect(floatValidator.isValidSync('1')).toBe(true);
    expect(floatValidator.isValidSync('-1')).toBe(false);
    expect(floatValidator.isValidSync('0')).toBe(false);
  });

  it('succeeds because field is optional', () => {
    const intRules = {
      int32: {
        lt: 2,
        gt: 0,
      },
    };
    const floatValidator = getTestValidator('TYPE_INT32', intRules, true);
    expect(floatValidator.isValidSync(undefined)).toBe(true);
    expect(floatValidator.isValidSync(null)).toBe(true);
    expect(floatValidator.isValidSync('1')).toBe(true);
    expect(floatValidator.isValidSync(1)).toBe(true);
  });

  it('fails because field is required', () => {
    const intRules = {
      int32: {
        lt: 2,
        gt: 0,
      },
    };
    const floatValidator = getTestValidator('TYPE_INT32', intRules, false);
    expect(floatValidator.isValidSync(undefined)).toBe(false);
    expect(floatValidator.isValidSync(null)).toBe(false);
  });
});
