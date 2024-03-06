import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIds, FilteredColumns } from '.';

const noop = () => {};
describe('FilteredColumns', () => {
  function renderFilteredColumns(mockGetFilterModel: any, mockGetColumn: any) {
    function mockAddEventListener(eventName: string, callback: any) {
      if (eventName === 'filterChanged') {
        callback();
      }
    }

    const mockTableApi: LT.TableApi = {
      resetGrid: noop,
      clearSelection: noop,
      refreshCache: noop,
      // @ts-ignore
      columnApi: {
        getColumn: mockGetColumn,
      },
      // @ts-ignore
      gridApi: {
        addEventListener: mockAddEventListener,
        removeEventListener: noop,
        getFilterModel: mockGetFilterModel,
      },
    };
    return render(<FilteredColumns tableApi={mockTableApi} />);
  }

  it('renders nothing when no columns have filters applied', () => {
    function mockGetFilterModel() {
      // return empty object --> no filters applied.
      return {};
    }

    const { queryByTestId } = renderFilteredColumns(mockGetFilterModel, noop);
    expect(queryByTestId(dataTestIds.filteredColumns)).toBeNull();
  });

  it('renders column names that have filters applied', () => {
    function mockGetFilterModel() {
      // mock filters applied
      return {
        status: {},
        sample_type: {},
      };
    }

    function mockGetColumn(columnName: string) {
      const mockCols = {
        status: { getColDef: () => ({ headerName: 'Status' }) },
        sample_type: { getColDef: () => ({ headerName: 'Sample Type' }) },
      };
      return mockCols[columnName];
    }

    const { queryByTestId } = renderFilteredColumns(mockGetFilterModel, mockGetColumn);
    expect(queryByTestId(dataTestIds.filteredColumns)).toHaveTextContent('Status, Sample Type');
  });
});
