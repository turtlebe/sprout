/**
 * This util parses a tally object into a concatenated string
 * @param {Record<string, any>} totalValue
 * @returns {string}
 */
export const getTallyValue = (totalValue: Record<string, any>): string => {
  if (!totalValue) {
    return 'N/A';
  }

  var totalTallyCount = Object.values(totalValue).reduce(function (acc, obj) {
    return acc + obj;
  }, 0);

  return Object.keys(totalValue)
    .map(valueKey => {
      return `${valueKey}: ${totalValue[valueKey]}(${
        totalValue[valueKey] == 0 ? 0 : ((totalValue[valueKey] / totalTallyCount) * 100).toFixed(1)
      }%)`;
    })
    .join(', ');
};
