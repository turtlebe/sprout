import { buildMetric } from '@plentyag/app-environment/src/common/test-helpers';
import { mockAssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/test-helpers/mock-assessment-types';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useAssesesmentTypesAgGridConfig } from '../../hooks/use-assessment-types-ag-grid-config';

import { dataTestIdsSettingsTable as dataTestIds, SettingsTable } from '.';

jest.mock('../../hooks/use-assessment-types-ag-grid-config');
const mockUseAssesesmentTypesAgGridConfig = useAssesesmentTypesAgGridConfig as jest.Mock;

describe('SettingsTable', () => {
  const mockMetricsRecord = {
    tubWeight: buildMetric({
      observationName: 'tubWeight',
    }),
    largeLeaves: buildMetric({
      observationName: 'largeLeaves',
    }),
  };

  function getJSX(props?: Partial<SettingsTable>) {
    return (
      <MemoryRouter>
        <SettingsTable
          isLoading={false}
          assessmentTypes={mockAssessmentTypes}
          metricsRecord={mockMetricsRecord}
          onCreateMetric={jest.fn()}
          onUpdatedAsssessmentType={jest.fn()}
          onReorderAssessmentType={jest.fn()}
          {...props}
        />
      </MemoryRouter>
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle full component lifecycle: with data, loading, then with updated data', () => {
    // ACT 1 - render with data
    const { queryByTestId, rerender } = render(
      getJSX({
        isLoading: false,
      })
    );

    // ASSERT 1 - should render current state
    expect(mockUseAssesesmentTypesAgGridConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        assessmentTypes: mockAssessmentTypes,
      })
    );
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();

    // ARRANGE 2
    mockUseAssesesmentTypesAgGridConfig.mockClear();

    // ACT 2 - render loading
    rerender(
      getJSX({
        isLoading: true,
      })
    );

    // ASSERT 2 - should still passthrough prev state
    expect(mockUseAssesesmentTypesAgGridConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        assessmentTypes: mockAssessmentTypes,
      })
    );
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();

    // ARRANGE 3
    mockUseAssesesmentTypesAgGridConfig.mockClear();
    const modifiedAssessmentTypes = [...mockAssessmentTypes].reverse();

    // ACT 3 - pass through new modified data
    rerender(
      getJSX({
        isLoading: false,
        assessmentTypes: modifiedAssessmentTypes,
      })
    );

    // ASSERT 2 - should pass through new data
    expect(mockUseAssesesmentTypesAgGridConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        assessmentTypes: modifiedAssessmentTypes,
      })
    );
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
  });
});
