import { getTaskParamValue } from '.';

describe('getTaskParamValue', () => {
  it('gets value type for given field', () => {
    expect(getTaskParamValue('x', { x: 1 })).toEqual(1);
    expect(getTaskParamValue('x', { x: '1' })).toEqual('1');
    expect(getTaskParamValue('x', { x: true })).toEqual(true);

    expect(getTaskParamValue('x', { x: { value: 1 } })).toEqual(1);
    expect(getTaskParamValue('x', { x: { value: '1' } })).toEqual('1');
    expect(getTaskParamValue('x', { x: { value: true } })).toEqual(true);
  });

  it('returns ??? when field with given name not found', () => {
    expect(getTaskParamValue('y', { x: 1 })).toEqual('???');
    expect(getTaskParamValue('y', { x: { value: 1 } })).toEqual('???');
    expect(getTaskParamValue(null, { x: 1 })).toEqual('???');
  });
});
