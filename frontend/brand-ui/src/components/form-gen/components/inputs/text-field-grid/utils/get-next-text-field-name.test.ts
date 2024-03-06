import { getNextTextFieldName } from './get-next-text-field-name';

const name = 'mockName';
const formGenField: FormGen.FieldTextFieldGrid = {
  type: 'TextFieldGrid',
  name,
  rows: [
    { label: 'Row1', value: 'row1' },
    { label: 'Row2', value: 'row2' },
  ],
  columns: ['col1', 'col2'],
  tabbing: 'vertical',
};

describe('getNextTextFieldName', () => {
  it('returns the next textField corresponding to the row below', () => {
    expect(getNextTextFieldName(formGenField, `${name}.row1[0]`)).toBe(`${name}.row2[0]`);
    expect(getNextTextFieldName(formGenField, `${name}.row1[1]`)).toBe(`${name}.row2[1]`);
  });

  it('returns the next textField corresponding to the first row and the next column when there are no more rows below', () => {
    expect(getNextTextFieldName(formGenField, `${name}.row2[0]`)).toBe(`${name}.row1[1]`);
  });

  it('returns null when there are no more rows or columns', () => {
    expect(getNextTextFieldName(formGenField, `${name}.row2[1]`)).toBeNull();
  });

  it('returns null when tabbing is not vertical', () => {
    expect(getNextTextFieldName({ ...formGenField, tabbing: 'horizontal' }, `${name}.row1[0]`)).toBeNull();
  });
});
