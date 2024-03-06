import { CustomObjectParam } from '@plentyag/core/src/ag-grid/constants';

/**
 * Given the keyword this will form the ag grid filtering object parameter
 * @param {string} keyword
 * @returns {string}
 */
export const getFilteringObjectParam = (keyword: string) => {
  return CustomObjectParam.encode({
    filterType: 'text',
    type: 'contains',
    filter: keyword,
  });
};
