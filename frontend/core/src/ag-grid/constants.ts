import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { decodeObject, encodeObject } from 'serialize-query-params';

export const DEFAULT_CACHE_BLOCK_SIZE = 100;
export const LOCAL_STORAGE_QUERY_PARAMS_PREFIX = 'baseAgGridQueryParams';
export const defaultConfig = {
  defaultColDef: {
    floatingFilter: true,
    sortable: true,
    resizable: true,
    lockPosition: true,
  },
  modules: [...AllCommunityModules, ServerSideRowModelModule],
  rowHeight: 48,
  suppressColumnVirtualisation: true,
  suppressRowClickSelection: true,
  rowSelection: 'multiple',
  cacheBlockSize: DEFAULT_CACHE_BLOCK_SIZE,
};

const delimiter = '-*';
export const CustomObjectParam = {
  encode: object => encodeObject(object, undefined, delimiter),
  decode: queryParam => decodeObject(queryParam, undefined, delimiter),
};
