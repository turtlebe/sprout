import { render } from '@testing-library/react';
import React from 'react';

import { AssociatedCropsSkus, CropBasics } from '..';
import { mockCrops } from '../../../common/test-helpers';

import { CropInformationPanel, dataTestIdsCropInformationPanel as dataTestIds } from '.';

jest.mock('../crop-basics');
const mockCropBasics = CropBasics as jest.Mock;
mockCropBasics.mockReturnValue(<div data-testid="fake-crops-basics" />);

jest.mock('../associated-crops-skus');
const mockAssociatedCropsSkus = AssociatedCropsSkus as jest.Mock;
mockAssociatedCropsSkus.mockReturnValue(<div data-testid="fake-associated-crops-skus" />);

describe('CropInformationPanel', () => {
  it('renders nothing if crop not provided', () => {
    const { queryByTestId } = render(<CropInformationPanel crop={undefined} />);
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders panels when crop is provided', () => {
    const { queryByTestId } = render(<CropInformationPanel crop={mockCrops[0]} />);
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId('fake-crops-basics')).toBeInTheDocument();
    expect(queryByTestId('fake-associated-crops-skus')).toBeInTheDocument();
  });
});
