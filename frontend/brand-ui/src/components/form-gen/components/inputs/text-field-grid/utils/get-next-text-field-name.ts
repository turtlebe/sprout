/**
 * Given a FormGen.FieldTextFieldGrid with vertical tabbing. Returns the next textField name to focus on.
 *
 * @param formGenField a FormGen.FieldTextFieldGrid
 * @param textFieldName the name of the current textField
 */
export function getNextTextFieldName(formGenField: FormGen.FieldTextFieldGrid, textFieldName: string): string {
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
  const nextRow = formGenField.rows[currentRowIndex + 1];

  if (nextRow) {
    return `${formGenField.name}.${nextRow.value}[${currentColIndex}]`;
  }

  if (!nextRow && currentColIndex + 1 < formGenField.columns.length) {
    const firstRow = formGenField.rows[0];

    return `${formGenField.name}.${firstRow.value}[${currentColIndex + 1}]`;
  }

  return null;
}
