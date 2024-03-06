import * as yup from 'yup';

import { ERROR_MESSAGES } from './extension';

describe('requireSeedlingTableColumn', () => {
  it('throws an error', () => {
    const validation = yup.mixed().requireSeedlingTableColumn('column-a');

    expect(() =>
      validation.validateSync([
        { location: 'C1', properties: [{ name: 'column-a', value: undefined }] },
        { location: 'C2', properties: [{ name: 'column-a', value: null }] },
        { location: 'C3', properties: [{ name: 'column-a' }] },
        {}, // last INDEX represents the Other column is always ignored
      ])
    ).toThrow();
  });

  it('does not throw an error', () => {
    const validation = yup.mixed().requireSeedlingTableColumn('column-a');

    expect(() =>
      validation.validateSync([
        { location: 'C1', properties: [{ name: 'column-a', value: 1 }] },
        { location: 'C2', properties: [{ name: 'column-a', value: 2 }] },
        { location: 'C3', properties: [{ name: 'column-a', value: 0 }] },
        {}, // last INDEX represents the Other column is always ignored
      ])
    ).not.toThrow();
  });
});

describe('validateRadioGridValues', () => {
  it('throws an error', () => {
    const validation = yup.mixed().validateRadioGridValues({ allowedValues: ['on', 'off'], length: 2 });

    expect(() => validation.validateSync('')).toThrow(ERROR_MESSAGES.validateRadioGridValues);
    expect(() => validation.validateSync(null)).toThrow(ERROR_MESSAGES.validateRadioGridValues);
    expect(() => validation.validateSync(undefined)).toThrow(ERROR_MESSAGES.validateRadioGridValues);
    expect(() => validation.validateSync(['on'])).toThrow(ERROR_MESSAGES.validateRadioGridValues);
    expect(() => validation.validateSync(['on', undefined])).toThrow(ERROR_MESSAGES.validateRadioGridValues);
  });

  it('does not throw an error', () => {
    const validation = yup.mixed().validateRadioGridValues({ allowedValues: ['on', 'off'], length: 2 });

    expect(() => validation.validateSync(['on', 'on'])).not.toThrow();
    expect(() => validation.validateSync(['on', 'off'])).not.toThrow();
    expect(() => validation.validateSync(['off', 'on'])).not.toThrow();
    expect(() => validation.validateSync(['off', 'off'])).not.toThrow();
  });
});

describe('validateTextFieldGridValues', () => {
  it('throws an error', () => {
    const validation = yup.mixed().validateTextFieldGridValues({ keys: ['a', 'b'], length: 2 });

    expect(() => validation.validateSync('')).toThrow(ERROR_MESSAGES.validateTextFieldGridValues);
    expect(() => validation.validateSync(null)).toThrow(ERROR_MESSAGES.validateTextFieldGridValues);
    expect(() => validation.validateSync(undefined)).toThrow(ERROR_MESSAGES.validateTextFieldGridValues);
    expect(() => validation.validateSync({})).toThrow(ERROR_MESSAGES.validateTextFieldGridValues);
    expect(() => validation.validateSync({ a: ['1', '2'] })).toThrow(ERROR_MESSAGES.validateTextFieldGridValues);
  });

  it('does not throw an error', () => {
    const validation = yup.mixed().validateTextFieldGridValues({ keys: ['a', 'b'], length: 2 });

    expect(() => validation.validateSync({ a: ['1', '2'], b: ['1', '2'] })).not.toThrow();
  });
});

describe('validateTextFieldGridValuesUsingFunction', () => {
  it('throws an error', () => {
    const errorMessage = 'not positive integer';
    const validation = yup.mixed().validateTextFieldGridValuesUsingFunction({
      errorMessage,
      gridValueTestFunction: (value: any) => Number.isInteger(value) && value > 0,
    });

    expect(() => validation.validateSync({ a: [1, '1'], b: [1, 1] })).toThrowError(errorMessage);
    expect(() => validation.validateSync({ a: [1, 0], b: [1, 1] })).toThrowError(errorMessage);
    expect(() => validation.validateSync({ a: 1, b: [2, 1] })).toThrowError(errorMessage);
  });

  it('does not throw an error', () => {
    const errorMessage = 'not positive integer';
    const validation = yup.mixed().validateTextFieldGridValuesUsingFunction({
      errorMessage,
      gridValueTestFunction: (value: any) => Number.isInteger(value) && value > 0,
    });

    expect(() => validation.validateSync({ a: [1, 1], b: [2, 1] })).not.toThrow();
    expect(() => validation.validateSync({ a: [1], b: [2, 1] })).not.toThrow();
  });
});

describe('noDateTimeError', () => {
  it('throws an error', () => {
    const validation = yup.string().noDateTimeError();
    expect(() => validation.validateSync('Invalid DateTime')).toThrow('this is invalid');
  });

  it('throws an error for Moment error (backwards compatibility)', () => {
    const validation = yup.string().noDateTimeError();
    expect(() => validation.validateSync('Invalid date')).toThrow('this is invalid');
  });

  it('does not throw an error', () => {
    const validation = yup.string().noDateTimeError();
    expect(() => validation.validateSync('')).not.toThrow();
    expect(() => validation.validateSync('2002-01-01')).not.toThrow();
    expect(() => validation.validateSync('2020-10-07T12:09:41-07:00')).not.toThrow();
  });
});

describe('noFutureDateTime', () => {
  it('throws an error', () => {
    const validation = yup.string().noFutureDateTime();
    const futureDateTime = new Date(new Date().setHours(new Date().getHours() + 4)).toISOString();
    expect(() => validation.validateSync(futureDateTime)).toThrow('Setting time in the future is invalid');
  });

  it('does not throws an error', () => {
    const validation = yup.string().noFutureDateTime();
    const pastDateTime = new Date(new Date().setHours(new Date().getHours() - 2)).toISOString();
    expect(() => validation.validateSync(pastDateTime)).not.toThrow();
  });
});

describe('cropTargetRatio', () => {
  it('throws an error', () => {
    const validationLessThanOne = yup.number().cropTargetRatio([0.4, 0.5]);
    expect(() => validationLessThanOne.validateSync(0.4)).toThrow();

    const validationOverOne = yup.number().cropTargetRatio([0.6, 0.5]);
    expect(() => validationOverOne.validateSync(0.6)).toThrow();

    const validationMissingValue = yup.number().cropTargetRatio([0.6, null]);
    expect(() => validationMissingValue.validateSync(0.6)).toThrow();

    // value provided "0.6" is used to override "ratios" index zero value of 0.2.
    const validationUsingContext = yup.number().cropTargetRatio([0.2, 0.8]);
    // @ts-ignore - since path isn't in ts defns.
    expect(() => validationUsingContext.validateSync(0.6, { path: 'componentCrop[0]' })).toThrow();
  });

  it('does not throw an error', () => {
    const validation = yup.number().cropTargetRatio([0.5, 0.5]);
    expect(() => validation.validateSync(0.5)).not.toThrow();

    // note: sum here comes out to be 0.9999999999999999, so this test EPSILON edge case.
    const validationForTenTimes = yup.number().cropTargetRatio(Array(10).fill(0.1));
    expect(() => validationForTenTimes.validateSync(0.1)).not.toThrow();

    // value provided "0.2" is used to override "ratios" index zero value of 0.6.
    const validationUsingContext = yup.number().cropTargetRatio([0.6, 0.8]);
    // @ts-ignore - since path isn't in ts defns.
    expect(() => validationUsingContext.validateSync(0.4, { path: 'componentCrop[1]' })).not.toThrow();
  });
});

describe('tupleOf', () => {
  it('throws an error', () => {
    const validationNumberOfSchemas = yup.array().tupleOf([yup.number(), yup.number(), yup.number()]); // 3 schemas
    expect(() => validationNumberOfSchemas.validateSync([1, 2, 3, 4, 5])).toThrow(); // 5 items

    const validationWrongSchema = yup.array().tupleOf([yup.number(), yup.string()]); // number and string
    expect(() => validationWrongSchema.validateSync([1, true])).toThrow(); // number and bool
  });

  it('does not throw an error', () => {
    const validationNumberOfSchemas = yup
      .array()
      .tupleOf([yup.number(), yup.number(), yup.number(), yup.number(), yup.number()]); // 5 schemas
    expect(() => validationNumberOfSchemas.validateSync([1, 2, 3, 4, 5])).not.toThrow(); // 5 items

    const validationWrongSchema = yup.array().tupleOf([yup.number(), yup.string()]); // number and string
    expect(() => validationWrongSchema.validateSync([1, 'this is a string'])).not.toThrow(); // number and string
  });
});
