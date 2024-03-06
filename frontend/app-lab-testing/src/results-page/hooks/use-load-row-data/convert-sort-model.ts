import { cols } from '../../table-cols';

import { colsToQueryParam } from './cols-to-query-params';

interface SortModel {
  colId: cols;
  sort: 'asc' | 'desc';
}

export function convertSortModelIntoQueryParameters(sortModels: SortModel[]) {
  let orderBy = '';
  sortModels.forEach(sortModel => {
    const mapper = colsToQueryParam.get(sortModel.colId);
    if (mapper) {
      const dir = sortModel.sort === 'asc' ? '' : '-';
      const comma = orderBy ? ',' : '';
      orderBy += `${comma}${dir}${mapper.start}`;
    }
  });
  return orderBy;
}
