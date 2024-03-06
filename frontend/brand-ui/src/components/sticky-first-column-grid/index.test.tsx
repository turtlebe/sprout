import { render } from '@testing-library/react';
import React from 'react';

import { StickyFirstColumnGrid } from '.';

interface KeyValuePair {
  key: string;
  value: string;
}

const MockComponent: React.FC = () => <span>mock-component</span>;

describe('StickyFirstColumnGrid', () => {
  it('displays a table and gives callbacks to render columns and rows headers and cells', () => {
    const columns: KeyValuePair[] = [
      { key: 'Column 1', value: 'column-1' },
      { key: 'Column 2', value: 'column-2' },
    ];
    const rows: KeyValuePair[] = [
      { key: 'Row 1', value: 'row-1' },
      { key: 'Row 2', value: 'row-2' },
    ];
    const renderCell = ({ column, row, colIndex, rowIndex }) => {
      expect(column).toEqual(columns[colIndex]);
      expect(row).toEqual(rows[rowIndex]);

      return <MockComponent />;
    };
    const renderHeader = ({ column, colIndex }) => {
      expect(column).toEqual(columns[colIndex]);

      return <MockComponent />;
    };
    const renderRowHeader = ({ row, rowIndex }) => {
      expect(row).toEqual(rows[rowIndex]);

      return '[test-markdown](https://google.com)';
    };

    const { container } = render(
      <StickyFirstColumnGrid<KeyValuePair, KeyValuePair>
        columns={columns}
        rows={rows}
        renderCell={renderCell}
        renderHeader={renderHeader}
        renderRowHeader={renderRowHeader}
      />
    );

    expect(container.querySelector('tbody > tr > td')).toHaveTextContent('test-markdown');
    expect(container.querySelector('tbody > tr > td > a')).toHaveAttribute('href', 'https://google.com');
    expect.assertions(14); // 8 cells, 2 column headers, 2 row headers + 2 assertions above
  });
});
