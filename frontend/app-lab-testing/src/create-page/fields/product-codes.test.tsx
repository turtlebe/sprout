import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { useProductCodes } from '../hooks';

import { ProductCodes } from './product-codes';

jest.mock('../hooks');

const mockProductCodes: LT.ProductCode[] = [
  {
    name: 'FEN',
    displayName: 'fennel',
  },
  {
    name: 'B10',
    displayName: 'baby kale',
  },
];

const MockUseProductCodes = () => {
  return {
    productCodes: mockProductCodes,
    errorMsg: '',
    isLoading: false,
  };
};

(useProductCodes as jest.Mock).mockImplementation(MockUseProductCodes);

function renderProductCode(selectedProductCodes: LT.ProductCode[], location: LT.Location) {
  const renderer = createRenderer();
  renderer.render(
    <ProductCodes
      disabled={false}
      selectedProductCodes={selectedProductCodes}
      setFieldValue={undefined}
      className=""
      location={location}
      fieldName={'product-codes'}
    />
  );
  return renderer.getRenderOutput();
}

describe('ProductCodes', () => {
  it('shows an error if selected product code is not in options list.', () => {
    const location = {
      path: 'LAR1/BMP/',
      id: 'farm-def-id',
      farmCode: 'lar1',
    };
    const selectedProductCodes = [
      {
        name: 'FEN',
        displayName: 'fennel',
      },
      {
        name: 'GRF', // not in list.
        displayName: 'green forest',
      },
    ];
    const result = renderProductCode(selectedProductCodes, location);
    expect(result.props.error).toContain('GRF');
  });

  it('shows no error when selected product code is not in options list. ', () => {
    const location = {
      path: 'LAR1/BMP/',
      id: 'farm-def-id',
      farmCode: 'lar1',
    };
    const selectedProductCodes = [
      {
        name: 'B10',
        displayName: 'baby kale',
      },
    ];
    const result = renderProductCode(selectedProductCodes, location);
    expect(result.props.error).toBeFalsy();
  });

  it('has options with crop name and displayName', () => {
    const location = {
      path: 'SSF2/BMP/',
      id: 'farm-def-id',
      farmCode: 'tigris',
    };
    const result = renderProductCode([], location);

    const expectedResult = 'fennel';

    // given both code and crop name
    const label1 = result.props.getOptionLabel({
      name: 'FEN',
      displayName: 'fennel',
    });
    expect(label1).toEqual(expectedResult);

    // only given code
    const label2 = result.props.getOptionLabel({
      name: 'FEN',
    });
    expect(label2).toEqual(expectedResult);

    // check case where we have code that doesn't exist
    const label3 = result.props.getOptionLabel({
      name: 'XYZ',
    });
    expect(label3).toBe('XYZ');
  });

  it('has options that are sorted alphabetically by displayName', () => {
    const location = {
      path: 'LAR1/BMP/',
      id: 'farm-def-id',
      farmCode: 'lar1',
    };
    const result = renderProductCode([], location);

    expect(result.props.options).toHaveLength(2);

    // sorted order.
    expect(result.props.options[0].displayName).toBe('baby kale');
    expect(result.props.options[1].displayName).toBe('fennel');
  });
});
