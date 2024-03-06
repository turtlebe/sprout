import { render } from '@testing-library/react';
import React from 'react';

import { useFetchAssessmentTypes, useFetchPostharvestTallyBySku } from '../../hooks';
import { mockAssessmentTypes } from '../../test-helpers/mock-assessment-types';
import { mockPostharvestSkuTally } from '../../test-helpers/mock-postharvest-tally';
import { getPostharvestQaId } from '../../utils/get-postharvest-qa-id';

import { dataTestIdsPostharvestQaExpandedRow as dataTestIds, PostharvestQaExpandedRow } from '.';

jest.mock('../../hooks/use-fetch-postharvest-tally-by-sku');
const mockUseFetchPostharvestTallyBySku = useFetchPostharvestTallyBySku as jest.Mock;

jest.mock('../../hooks/use-fetch-assessment-types');
const mockUseFetchAssessmentTypes = useFetchAssessmentTypes as jest.Mock;

describe('PostharvestQaExpandedRow', () => {
  function getDataColumns(node) {
    return [...node.querySelectorAll('td')];
  }

  function renderPostharvestQaExpandedRow(lotName = '5-LAX1-123-123', skuName = 'CRSCase6Clamshell4o5ozPlenty') {
    return render(<PostharvestQaExpandedRow siteName="LAX1" farmName="LAX1" lotName={lotName} skuName={skuName} />);
  }

  beforeEach(() => {
    // ARRANGE
    mockUseFetchAssessmentTypes.mockReturnValue({
      assessmentTypes: mockAssessmentTypes,
      isLoading: false,
    });

    mockUseFetchPostharvestTallyBySku.mockReturnValue({
      postharvestSkuTally: null,
      isLoading: true,
    });
  });

  it('shows progress when loading initially', () => {
    // ACT
    const { queryByTestId } = renderPostharvestQaExpandedRow();

    // ASSERT
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders correct different assessment types', () => {
    // ARRANGE
    mockUseFetchPostharvestTallyBySku.mockReturnValue({
      postharvestSkuTally: mockPostharvestSkuTally,
      isLoading: false,
    });

    const key = getPostharvestQaId(mockPostharvestSkuTally);

    // ACT
    const { queryByTestId } = renderPostharvestQaExpandedRow(mockPostharvestSkuTally.lot, mockPostharvestSkuTally.sku);

    // ASSERT
    // -- make sure the layout is rendered
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.assessments)).toBeInTheDocument();

    // -- make sure the columns and values are rendered
    const [label1, value1] = getDataColumns(queryByTestId(dataTestIds.assessmentRow(`${key}_tubWeight`)));
    const [label2, value2] = getDataColumns(queryByTestId(dataTestIds.assessmentRow(`${key}_largeLeaves`)));

    expect(label1.textContent).toEqual('Tub Weight (oz)');
    expect(value1.textContent).toEqual('PASS: 1(33.3%), FAIL: 2(66.7%)');
    expect(label2.textContent).toEqual('Large Leaves');
    expect(value2.textContent).toEqual('PASS: 3(100.0%)');
  });
});
