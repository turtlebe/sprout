import { render } from '@testing-library/react';
import React from 'react';

import { AgGridListRenderer, dataTestIdsAgGridListRenderer as dataTestIds } from '.';

const list = ['str1', 'str2'];

describe('AgGridListRenderer', () => {
  it('renders no items when list is empty', () => {
    const { queryByTestId } = render(<AgGridListRenderer list={[]} />);
    expect(queryByTestId(dataTestIds.cell)).toBe(null);
    expect(queryByTestId(dataTestIds.popOver)).toBe(null);
  });

  it('renders list of items', () => {
    const { queryByTestId } = render(<AgGridListRenderer list={list} />);
    expect(queryByTestId(dataTestIds.cell)).toHaveTextContent(list.join(', '));
    expect(queryByTestId(dataTestIds.popOver)).toBe(null);
  });

  it('shows list in popover on click', () => {
    const { queryByTestId } = render(<AgGridListRenderer list={list} />);
    expect(queryByTestId(dataTestIds.popOver)).toBe(null);
    const cell = queryByTestId(dataTestIds.cell);
    cell.click();
    expect(queryByTestId(dataTestIds.popOver)).toHaveTextContent('str1str2');
  });
});
