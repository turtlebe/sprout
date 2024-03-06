import { render } from '@testing-library/react';
import React from 'react';

import { CropLink, dataTestIdsCropSkuCardItem, SkuLink } from '../../../common/components';
import { mockCrops } from '../../../common/test-helpers';
import { AssociatedCropsSkus, dataTestIdsAssociatedCropsSkus as dataTestIds } from '../associated-crops-skus';

jest.mock('../../../common/components/crop-link');
const mockCropLink = CropLink as jest.Mock;
mockCropLink.mockReturnValue(<div />);

jest.mock('../../../common/components/sku-link');
const mockSkuLink = SkuLink as jest.Mock;
mockSkuLink.mockReturnValue(<div />);

describe('AssociatedCropsSkus', () => {
  it('shows "none" when childCrops and skus arrays are empty', () => {
    const { queryAllByTestId, queryByTestId } = render(<AssociatedCropsSkus crop={mockCrops[0]} />);

    expect(queryAllByTestId(dataTestIdsCropSkuCardItem.textField)[0]).toHaveTextContent('none');
    expect(queryAllByTestId(dataTestIdsCropSkuCardItem.textField)[1]).toHaveTextContent('none');
    expect(queryByTestId(dataTestIds.table)).not.toBeInTheDocument();
  });

  it('displays table of data from childCrops array', () => {
    const crop = mockCrops[1];

    const { queryByTestId } = render(<AssociatedCropsSkus crop={crop} />);

    expect(queryByTestId(dataTestIds.table)).toBeInTheDocument();

    const childCrop1 = crop.childCrops[0];
    const row1 = dataTestIds.tableRow(childCrop1);
    expect(queryByTestId(row1)).toBeInTheDocument();
    expect(queryByTestId(row1)).toHaveTextContent(`${childCrop1.minRatio}`);
    expect(queryByTestId(row1)).toHaveTextContent(`${childCrop1.maxRatio}`);
    expect(queryByTestId(row1)).toHaveTextContent(`${childCrop1.targetRatio}`);

    const childCrop2 = crop.childCrops[1];
    const row2 = dataTestIds.tableRow(childCrop2);
    expect(queryByTestId(row2)).toBeInTheDocument();
    expect(queryByTestId(row2)).toHaveTextContent(`${childCrop2.minRatio}`);
    expect(queryByTestId(row2)).toHaveTextContent(`${childCrop2.maxRatio}`);
    expect(queryByTestId(row2)).toHaveTextContent(`${childCrop2.targetRatio}`);
  });
});
