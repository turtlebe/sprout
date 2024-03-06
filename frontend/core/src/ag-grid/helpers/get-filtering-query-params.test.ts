import { DateFilterModel } from '@ag-grid-community/all-modules';
import { CustomObjectParam } from '@plentyag/core/src/ag-grid/constants';
import { encodeJson, encodeObject } from 'serialize-query-params';

import { SelectionFilterModel } from '../custom-filters/selection-filter';
import { TextFilterModel } from '../types';

import { getFilteringQueryParams } from '.';

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

interface IndexType {
  [key: string]: string;
}
const mockTextFilter: TextFilterModel = { filterType: 'text', type: 'equals', filter: 'value' };
const mockSelectionFilter: SelectionFilterModel = {
  filterType: 'selection',
  selectedItems: [
    { name: 'value1', value: 'value1' },
    { name: 'value2', value: 'value2' },
  ],
};
const mockDateFilter: DateFilterModel = {
  filterType: 'date',
  type: 'inRange',
  dateFrom: '2021-05-01 00:00:00',
  dateTo: '2021-06-22 00:00:00',
};

describe('getFilteringQueryParams', () => {
  it('returns no query parameters when empty filter model is provided', () => {
    expect(getFilteringQueryParams({}, mockColumnDefs)).toEqual({});
  });

  it('returns query parameters for text filter model', () => {
    const queryParameters = getFilteringQueryParams({ [fields.textFilterableColumn]: mockTextFilter }, mockColumnDefs);
    expect(queryParameters).toEqual({
      [fields.textFilterableColumn]: CustomObjectParam.encode(mockTextFilter as unknown as IndexType),
    });
  });

  it('returns query parameters for selection filter model', () => {
    const queryParameters = getFilteringQueryParams(
      { [fields.selectionFilterableColumn]: mockSelectionFilter },
      mockColumnDefs
    );
    expect(queryParameters).toEqual({ [fields.selectionFilterableColumn]: encodeJson(mockSelectionFilter) });
  });

  it('returns query parameters for date filter model', () => {
    const queryParameters = getFilteringQueryParams({ [fields.dateFilterableColumn]: mockDateFilter }, mockColumnDefs);
    expect(queryParameters).toEqual({
      [fields.dateFilterableColumn]: encodeObject(mockDateFilter as unknown as IndexType),
    });
  });

  it('returns query parameters for text, selection and date filter models', () => {
    const queryParameters = getFilteringQueryParams(
      {
        [fields.textFilterableColumn]: mockTextFilter,
        [fields.selectionFilterableColumn]: mockSelectionFilter,
        [fields.dateFilterableColumn]: mockDateFilter,
      },
      mockColumnDefs
    );
    expect(queryParameters).toEqual({
      [fields.textFilterableColumn]: CustomObjectParam.encode(mockTextFilter as unknown as IndexType),
      [fields.selectionFilterableColumn]: encodeJson(mockSelectionFilter),
      [fields.dateFilterableColumn]: encodeObject(mockDateFilter as unknown as IndexType),
    });
  });
});
