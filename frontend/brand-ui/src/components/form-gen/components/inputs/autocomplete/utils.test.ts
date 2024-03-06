import { getOptions, getSelectedOption, getSelectedOptions } from './utils';

const valueLabel1: FormGen.ValueLabel = { label: 'A', value: 'a' };
const valueLabel2: FormGen.ValueLabel = { label: 'B', value: 'b' };
const options = [valueLabel1, valueLabel2];

describe('getOptions', () => {
  it('returns an array of FormGen.ValueLabel', () => {
    expect(getOptions(['a', 'b'])).toEqual([
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b' },
    ]);
  });

  it('returns the FormGen.ValueLabel variable', () => {
    expect(options).toStrictEqual(options);
  });

  it('returns an empty array', () => {
    expect(getOptions(undefined)).toEqual([]);
  });

  it('returns an empty array', () => {
    expect(getOptions(null)).toEqual([]);
  });
});

describe('getSelectedOption', () => {
  it('returns undefined', () => {
    expect(getSelectedOption(options, 'unknown')).toBeUndefined();
  });

  it('returns the selected object', () => {
    expect(getSelectedOption(options, valueLabel1.value)).toEqual(valueLabel1);
  });
});

describe('getSelectedOptions', () => {
  it('returns undefined', () => {
    expect(getSelectedOptions(options, [])).toEqual([]);
  });

  it('returns undefined', () => {
    expect(getSelectedOptions(options, ['unknown'])).toEqual([]);
  });

  it('returns the selected objects', () => {
    expect(getSelectedOptions(options, [valueLabel1.value])).toEqual([valueLabel1]);
  });
});
