/**
 * Given a FormGen.FieldTextFieldGrid with vertical tabbing,
 * returns the previous textField name to focus on when shift tabbing.
 *
 * @param formGenField a FormGen.FieldTextFieldGrid
 * @param textFieldName the name of the current textField
 */
export function getPreviousTextFieldName(formGenField: FormGen.FieldTextFieldGrid, textFieldName: string): string {
  if (formGenField.tabbing !== 'vertical') {
    return null;
  }

  const match = new RegExp(/\w*\.(\w*)\[(\d*)\]/).exec(textFieldName);

  if (!match) {
    return null;
  }

  const currentRowValue = match[1];
  const currentColIndex = parseInt(match[2]);
  const currentRowIndex = formGenField.rows.findIndex(row => row.value === currentRowValue);
  const previousRow = formGenField.rows[currentRowIndex - 1];

  if (previousRow) {
    return `${formGenField.name}.${previousRow.value}[${currentColIndex}]`;
  }

  if (!previousRow && currentColIndex - 1 >= 0) {
    const lastRow = formGenField.rows[formGenField.rows.length - 1];

    return `${formGenField.name}.${lastRow.value}[${currentColIndex - 1}]`;
  }

  return null;
}
