import { render } from '@testing-library/react';
import React from 'react';

import { PartialColDef } from '../../types';

import { CropSkuCardItem, dataTestIdsCropSkuCardItem as dataTestIds } from '.';

const mockCol: PartialColDef = {
  headerName: 'Display Name',
  field: 'displayName',
  colId: 'displayName',
  headerTooltip: 'test tool tip',
};

describe('CropSkuCardItem', () => {
  it('renders string', () => {
    const { queryByTestId } = render(<CropSkuCardItem tableCol={mockCol} value="test-string" />);

    expect(queryByTestId(dataTestIds.textField)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.jsxField)).not.toBeInTheDocument();
  });

  it('renders "none" when value not provided', () => {
    const { queryByTestId } = render(<CropSkuCardItem tableCol={mockCol} value={undefined} />);

    expect(queryByTestId(dataTestIds.textField)).toHaveTextContent('none');
    expect(queryByTestId(dataTestIds.jsxField)).not.toBeInTheDocument();
  });

  it('renders jsx element', () => {
    const { queryByTestId } = render(<CropSkuCardItem tableCol={mockCol} value={<div>test</div>} />);

    expect(queryByTestId(dataTestIds.textField)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.jsxField)).toBeInTheDocument();
  });
});
