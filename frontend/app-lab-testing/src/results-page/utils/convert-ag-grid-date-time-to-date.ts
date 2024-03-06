/**
 * Date from ag-grid arrives in format: YYYY-MM-DD HH:MM:SS.
 * Previously ag-grid returned format: YYYY-MM-DD.
 * Drop the time part and only return the year, month and day.
 * @param dateTime Ag-grid date and time string.
 * @returns Date in format: YYYY-MM-DD
 */
export function convertAgGridDateTimeToDate(dateTime: string) {
  const dateTimeParts = dateTime.split(' ');
  return dateTimeParts[0];
}
