import useCoreStore from '@plentyag/core/src/core-store';
import { renderHook } from '@testing-library/react-hooks';

import { labTestDataProcessor } from '../../../common/hooks/use-lab-test-types';
import { cols } from '../../table-cols';
import { getSavedFilterState } from '../use-save-restore-grid-state';

import { useSetColumnsVisibility } from '.';

import { mockLabTestTypes } from './mock-lab-test-type-data';

jest.mock('../use-save-restore-grid-state');
jest.mock('@plentyag/core/src/core-store');

(useCoreStore as jest.Mock).mockReturnValue([
  {
    currentUser: 'test-user',
  },
  {},
]);

const mockGetSavedFilterState = getSavedFilterState as jest.Mock;

const labTestTypes: LT.LabTestType[] = labTestDataProcessor(mockLabTestTypes);

const tableApi: any = {
  gridApi: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getFilterModel: jest.fn(),
  },
  columnApi: {
    setColumnsVisible: jest.fn(),
  },
};

// helper function to get hidden and visible test colummns.
function getCols() {
  const numCalls = tableApi.columnApi.setColumnsVisible.mock.calls.length;
  if (numCalls > 2) {
    throw new Error('unexpected number of call, only expected two at most: ' + numCalls);
  }

  let visible: string[] = [];
  let hidden: string[] = [];
  tableApi.columnApi.setColumnsVisible.mock.calls.forEach(call => {
    if (call[1]) {
      // visible flag set
      visible = call[0];
    } else {
      // hidden flag set
      hidden = call[0];
    }
  });

  return {
    visible,
    hidden,
  };
}

describe('useSetColumnsVisibility', () => {
  afterEach(() => {
    if (tableApi.gridApi.addEventListener.mockReset) {
      tableApi.gridApi.addEventListener.mockReset();
    }
    tableApi.gridApi.removeEventListener.mockReset();
    if (tableApi.gridApi.getFilterModel) {
      tableApi.gridApi.getFilterModel.mockReset();
    }
    tableApi.columnApi.setColumnsVisible.mockReset();
  });
  it('all columns should be visible', () => {
    // no filters, so all columns should be shown.
    mockGetSavedFilterState.mockImplementation(() => {
      return {};
    });
    renderHook(() => useSetColumnsVisibility(tableApi, labTestTypes));
    const colsResult = getCols();
    expect(colsResult.visible).toHaveLength(8);
    expect(colsResult.hidden).toHaveLength(0);
  });

  it('only columns with given sampleType should be visible', () => {
    mockGetSavedFilterState.mockImplementation(() => {
      const filter = {};
      const sampleType = cols.SAMPLE_TYPE;
      const sampleTypeFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Product', value: 'Product' }],
      };
      filter[sampleType] = sampleTypeFilter;
      return filter;
    });
    renderHook(() => useSetColumnsVisibility(tableApi, labTestTypes));

    const colsResult = getCols();
    expect(colsResult.visible).toHaveLength(3);
    expect(colsResult.hidden).toHaveLength(5);
  });

  it('only test columns with given labTestKind should be visible', () => {
    mockGetSavedFilterState.mockImplementation(() => {
      const filter = {};
      const labKindType = cols.TEST_TYPE;
      const labKindFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Seed Pathogen', value: 'Seed Pathogen' }],
      };
      filter[labKindType] = labKindFilter;
      return filter;
    });
    renderHook(() => useSetColumnsVisibility(tableApi, labTestTypes));

    const colsResult = getCols();
    expect(colsResult.visible).toHaveLength(4);

    expect(colsResult.hidden).toHaveLength(4);
  });

  it('only test columns with given labProvider should be visible', () => {
    mockGetSavedFilterState.mockImplementation(() => {
      const filter = {};
      const labType = cols.LAB;
      const labTypeFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Waypoint', value: 'Waypoint' }],
      };
      filter[labType] = labTypeFilter;
      return filter;
    });
    renderHook(() => useSetColumnsVisibility(tableApi, labTestTypes));

    const colsResult = getCols();
    expect(colsResult.visible).toHaveLength(6);

    expect(colsResult.hidden).toHaveLength(2);
  });

  it('only columns with given sampleType, labTestKind and LabProvider should be visible', () => {
    mockGetSavedFilterState.mockImplementation(() => {
      const filter = {};

      const sampleType = cols.SAMPLE_TYPE;
      const sampleTypeFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Seed', value: 'Seed' }],
      };
      filter[sampleType] = sampleTypeFilter;

      const labKindType = cols.TEST_TYPE;
      const labKindFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Seed Pathogen', value: 'Seed Pathogen' }],
      };
      filter[labKindType] = labKindFilter;

      const labType = cols.LAB;
      const labTypeFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'IEH', value: 'IEH' }],
      };
      filter[labType] = labTypeFilter;
      return filter;
    });
    renderHook(() => useSetColumnsVisibility(tableApi, labTestTypes));

    const colsResult = getCols();
    expect(colsResult.visible).toHaveLength(3);
    expect(colsResult.hidden).toHaveLength(5);
  });

  it('all cols hidden', () => {
    mockGetSavedFilterState.mockImplementation(() => {
      const filter = {};
      const sampleType = cols.SAMPLE_TYPE;
      const sampleTypeFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Bogus-Sample-Type', value: 'Bogus-Sample-Type' }],
      };
      filter[sampleType] = sampleTypeFilter;
      return filter;
    });
    renderHook(() => useSetColumnsVisibility(tableApi, labTestTypes));

    const colsResult = getCols();
    expect(colsResult.visible).toHaveLength(0);
    expect(colsResult.hidden).toHaveLength(8);
  });

  it('on filterChange visible columns should update', () => {
    // no filters, so all columns should be shown.
    mockGetSavedFilterState.mockImplementation(() => {
      return {};
    });

    tableApi.gridApi.getFilterModel = jest.fn(() => {
      const filter = {};
      const labType = cols.LAB;
      const labTypeFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Waypoint', value: 'Waypoint' }],
      };
      filter[labType] = labTypeFilter;
      return filter;
    });

    let mockFilterChangedCallback;
    tableApi.gridApi.addEventListener = (eventname, callback) => {
      mockFilterChangedCallback = callback;
    };

    renderHook(() => useSetColumnsVisibility(tableApi, labTestTypes));

    const colsResult = getCols();
    expect(colsResult.visible).toHaveLength(8);
    expect(colsResult.hidden).toHaveLength(0);

    tableApi.columnApi.setColumnsVisible.mockClear();

    // fake filter changed event
    mockFilterChangedCallback();

    const colsResultNew = getCols();
    expect(colsResultNew.visible).toHaveLength(6);
    expect(colsResultNew.hidden).toHaveLength(2);
  });
});
