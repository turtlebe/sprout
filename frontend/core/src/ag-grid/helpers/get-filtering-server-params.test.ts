import { ColDef } from '@ag-grid-community/all-modules';

import { SelectionFilterModel } from '../custom-filters/selection-filter';
import { buildGetRowsParams } from '../test-helpers/build-get-rows-params';

import { getFilteringServerParams } from '.';

describe('getFilteringServerParams', () => {
  it('returns an empty object when no filters are applied', () => {
    const params = buildGetRowsParams({});

    expect(getFilteringServerParams({ filterModel: params.filterModel, transformColId: jest.fn() })).toEqual({});
  });

  it('handles agTextColumnFilter', () => {
    const params = buildGetRowsParams({
      filters: {
        col1: {
          filterType: 'text',
          type: 'equals',
          filter: 'colValue',
        },
      },
    });

    expect(getFilteringServerParams({ filterModel: params.filterModel, transformColId: jest.fn() })).toEqual({
      col1: 'colValue',
    });
  });

  it('defaults the key to the colId despite the type of agTextColumnFilter', () => {
    const params = buildGetRowsParams({
      filters: {
        col1: {
          filterType: 'text',
          type: 'contains',
          filter: 'colValue',
        },
      },
    });

    expect(getFilteringServerParams({ filterModel: params.filterModel, transformColId: jest.fn() })).toEqual({
      col1: 'colValue',
    });

    const params2 = buildGetRowsParams({
      filters: {
        col1: {
          filterType: 'text',
          type: 'blank',
        },
      },
    });

    expect(getFilteringServerParams({ filterModel: params2.filterModel, transformColId: jest.fn() })).toEqual({
      col1: '',
    });
  });

  it('handles custom filter selectionFilter', () => {
    const filter: SelectionFilterModel = {
      filterType: 'selection',
      selectedItems: [
        { name: 'name-a', value: 'value-a' },
        { name: 'name-b', value: 'value-b' },
      ],
    };
    const params = buildGetRowsParams({ filters: { col1: filter } });

    expect(getFilteringServerParams({ filterModel: params.filterModel, transformColId: jest.fn() })).toEqual({
      col1: ['value-a', 'value-b'],
    });
  });

  it('supports non-array values when using multiple: false and passing columnDefs', () => {
    const colDef: ColDef = {
      colId: 'col1',
      filter: 'selectionFilter',
      filterParams: {
        multiple: false,
        selectableItems: [
          { name: 'name-a', value: 'value-a' },
          { name: 'name-b', value: 'value-b' },
        ],
      },
    };
    const filter: SelectionFilterModel = {
      filterType: 'selection',
      selectedItems: [{ name: 'name-b', value: 'value-b' }],
    };
    const params = buildGetRowsParams({ filters: { col1: filter } });

    expect(getFilteringServerParams({ filterModel: params.filterModel, columnDefs: [colDef] })).toEqual({
      col1: 'value-b',
    });
  });

  it('takes in account query parameters mapping', () => {
    const params = buildGetRowsParams({
      filters: {
        col1: {
          filterType: 'text',
          type: 'equals',
          filter: 'colValue',
        },
      },
    });

    expect(getFilteringServerParams({ filterModel: params.filterModel, transformColId: () => 'colOne' })).toEqual({
      colOne: 'colValue',
    });
  });

  it('ignores the mapping when the column is not mapped', () => {
    const params = buildGetRowsParams({
      filters: {
        col1: {
          filterType: 'text',
          type: 'equals',
          filter: 'colValue',
        },
      },
    });

    expect(getFilteringServerParams({ filterModel: params.filterModel, transformColId: () => undefined })).toEqual({
      col1: 'colValue',
    });
  });
});
