import { getPreviousTextFieldName } from './get-previous-text-field-name';

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

describe('getPreviousTextFieldName', () => {
  it('returns the previous textField corresponding to the row above', () => {
    expect(getPreviousTextFieldName(formGenField, `${name}.row2[1]`)).toBe(`${name}.row1[1]`);
    expect(getPreviousTextFieldName(formGenField, `${name}.row2[0]`)).toBe(`${name}.row1[0]`);
  });

  it('returns the previous textField corresponding to the last row and the previous column when there are no more rows above', () => {
    expect(getPreviousTextFieldName(formGenField, `${name}.row1[1]`)).toBe(`${name}.row2[0]`);
  });

  it('returns null when there are no more rows or columns', () => {
    expect(getPreviousTextFieldName(formGenField, `${name}.row1[0]`)).toBeNull();
  });

  it('returns null when tabbing is not vertical', () => {
    expect(getPreviousTextFieldName({ ...formGenField, tabbing: 'horizontal' }, `${name}.row1[0]`)).toBeNull();
  });
});
