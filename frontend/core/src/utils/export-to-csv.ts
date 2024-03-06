/**
 * Converting data rows to CSV
 * Taken from https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
 * @param {string} filename
 * @param {[[...value: string]]} rows
 */
export function exportToCSV(filename, rows) {
  // process to handle conflicts with quotes and commas of CSV format
  const processRow = row => {
    let finalVal = '';

    for (var j = 0; j < row.length; j++) {
      const innerValue = row[j] === null ? '' : row[j].toString();
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) {
        result = `"${result}"`;
      }
      if (j > 0) {
        finalVal = `${finalVal},`;
      }
      finalVal = `${finalVal}${result}`;
    }

    return `${finalVal}\n`;
  };

  // compile separate lines
  const csvFile = rows.map(processRow).join('');

  // create blob
  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });

  // emulate click to download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    // feature detection
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
