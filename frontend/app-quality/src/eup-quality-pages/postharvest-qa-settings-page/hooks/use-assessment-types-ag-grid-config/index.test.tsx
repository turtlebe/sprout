import { buildMetric } from '@plentyag/app-environment/src/common/test-helpers';
import { mockAssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/test-helpers/mock-assessment-types';
import { renderHook } from '@testing-library/react-hooks';

import { useAssesesmentTypesAgGridConfig } from '.';

describe('useAssesesmentTypesAgGridConfig', () => {
  it('sets correct AG Grid config columns and data', () => {
    // ARRANGE
    const mockMetricsRecord = {
      tubWeight: buildMetric({
        observationName: 'tubWeight',
      }),
      largeLeaves: buildMetric({
        observationName: 'largeLeaves',
      }),
    };

    // ACT
    const { result } = renderHook(() =>
      useAssesesmentTypesAgGridConfig({
        assessmentTypes: mockAssessmentTypes,
        metricsRecord: mockMetricsRecord,
        onCreateMetric: jest.fn(),
        onUpdatedAsssessmentType: jest.fn(),
        onReorderAssessmentType: jest.fn(),
      })
    );

    // ASSERT
    // -- columns
    expect(result.current.columnDefs).toEqual([
      expect.objectContaining({
        headerName: 'Name',
        field: 'name',
        colId: 'name',
        filter: 'agTextColumnFilter',
      }),
      expect.objectContaining({
        headerName: 'Label',
        field: 'label',
        colId: 'label',
        filter: 'agTextColumnFilter',
      }),
      expect.objectContaining({
        headerName: 'Value Type',
        field: 'valueType',
        colId: 'valueType',
        filter: 'agTextColumnFilter',
      }),
      expect.objectContaining({
        headerName: 'Fail Metric',
        field: 'failMetic',
        colId: 'failMetic',
        filter: 'agTextColumnFilter',
      }),
      expect.objectContaining({
        headerName: '',
        field: 'actions',
        colId: 'actions',
      }),
    ]);

    // -- data
    expect(result.current.rowData).toEqual(mockAssessmentTypes);

    // -- row reorder extension
    expect(result.current).toEqual(
      expect.objectContaining({
        rowDragManaged: true,
        onRowDragEnd: expect.anything(),
      })
    );
  });
});
