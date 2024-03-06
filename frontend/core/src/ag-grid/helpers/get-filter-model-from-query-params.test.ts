import { ColDef } from '@ag-grid-community/all-modules';
import { CustomObjectParam } from '@plentyag/core/src/ag-grid/constants';
import { encodeJson, encodeObject } from 'serialize-query-params';

import { getFilterModelFromQueryParams } from '.';

const fields = {
  textFilterableColumn: 'textFilterableColumn',
  selectionFilterableColumn: 'selectionFilterableColumn',
  dateFilterableColumn: 'dateFilterableColumn',
};
const mockColumnDefs: ColDef[] = [
  {
    field: fields.textFilterableColumn,
    colId: fields.textFilterableColumn,
    filter: 'agTextColumnFilter',
    filterParams: {
      filterOptions: ['equals', 'notEqual', { displayKey: 'blank', displayName: 'Blank Values', test: () => true }],
    },
  },
  {
    field: fields.selectionFilterableColumn,
    colId: fields.selectionFilterableColumn,
    filter: 'selectionFilter',
  },
  {
    field: fields.dateFilterableColumn,
    colId: fields.dateFilterableColumn,
    filter: 'agDateColumnFilter',
    filterParams: {
      filterOptions: ['inRange'],
    },
  },
];
const mockTextFilter = { filterType: 'text', type: 'equals', filter: 'value' };
const mockSelectionFilter = {
  filterType: 'selection',
  selectedItems: [
    { name: 'value1', value: 'value1' },
    { name: 'value2', value: 'value2' },
  ],
};
const mockDateFilter = {
  filterType: 'date',
  type: 'inRange',
  dateFrom: '2021-05-01 00:00:00',
  dateTo: '2021-06-22 00:00:00',
};

describe('getFilterModelFromQueryParams', () => {
  it('returns an empty object when no filter has been applied', () => {
    const queryParams = new URLSearchParams();
    queryParams.set('ignore', 'ignore');
    expect(getFilterModelFromQueryParams(queryParams, mockColumnDefs)).toEqual({});
  });

  it('returns the FilterModel associated to the query params', () => {
    const queryParams = new URLSearchParams();
    queryParams.set(fields.textFilterableColumn, CustomObjectParam.encode(mockTextFilter));
    queryParams.set(fields.selectionFilterableColumn, encodeJson(mockSelectionFilter));
    expect(getFilterModelFromQueryParams(queryParams, mockColumnDefs)).toEqual({
      [fields.textFilterableColumn]: mockTextFilter,
      [fields.selectionFilterableColumn]: mockSelectionFilter,
    });
  });

  it('returns text filter model with type "contains" from the query params', () => {
    const mockTextFilter = { filterType: 'text', type: 'contains', filter: 'value' };
    const mockColumnDefs: ColDef[] = [
      {
        field: fields.textFilterableColumn,
        colId: fields.textFilterableColumn,
        filter: 'agTextColumnFilter',
        filterParams: { filterOptions: ['contains'] },
      },
    ];
    const queryParams = new URLSearchParams();
    queryParams.set(fields.textFilterableColumn, CustomObjectParam.encode(mockTextFilter));
    expect(getFilterModelFromQueryParams(queryParams, mockColumnDefs)).toEqual({
      [fields.textFilterableColumn]: mockTextFilter,
    });
  });

  it('returns text filter from query parameter containing a filter type', () => {
    const textFilter = { filterType: 'text', type: 'notEqual', filter: 'value' };
    const queryParams = new URLSearchParams();
    queryParams.set(fields.textFilterableColumn, CustomObjectParam.encode(textFilter));
    expect(getFilterModelFromQueryParams(queryParams, mockColumnDefs)).toEqual({
      [fields.textFilterableColumn]: textFilter,
    });
  });

  it('returns text filter from query parameter using a custom filter type', () => {
    const textFilter = { filterType: 'text', type: 'blank', filter: 'value' };
    const queryParams = new URLSearchParams();
    queryParams.set(fields.textFilterableColumn, CustomObjectParam.encode(textFilter));
    expect(getFilterModelFromQueryParams(queryParams, mockColumnDefs)).toEqual({
      [fields.textFilterableColumn]: textFilter,
    });
  });

  it('returns date filter from query parameter', () => {
    const queryParams = new URLSearchParams();
    queryParams.set(fields.dateFilterableColumn, encodeObject(mockDateFilter));
    expect(getFilterModelFromQueryParams(queryParams, mockColumnDefs)).toEqual({
      [fields.dateFilterableColumn]: mockDateFilter,
    });
  });
});
