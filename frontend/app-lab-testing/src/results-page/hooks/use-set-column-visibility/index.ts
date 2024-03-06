import useCoreStore from '@plentyag/core/src/core-store';
import React from 'react';

import { generateTestHeaderKey } from '../../../common/utils/generate-test-header-key';
import { shouldShowColumn } from '../../../common/utils/should-show-column';
import { cols } from '../../table-cols';
import { isSelectionFilterModel } from '../../utils/type-guards';
import { getSavedFilterState } from '../use-save-restore-grid-state';

function setColumnsVisibility(tableApi: LT.TableApi, filterModel: LT.FilterModel, labTestTypes: LT.LabTestType[]) {
  function getFilter(field: cols) {
    const filter = filterModel[field];
    if (filter && isSelectionFilterModel(filter)) {
      return filter.selectedItems.map(item => item.name);
    } else {
      return [];
    }
  }
  const sampleTypes = getFilter(cols.SAMPLE_TYPE);
  const testTypes = getFilter(cols.TEST_TYPE);
  const labProviders = getFilter(cols.LAB);

  const filter = { sampleTypes, testTypes, labProviders };

  const visibleCols: string[] = [];
  const hiddenCols: string[] = [];
  // go through all possible test columns and set visiblity according to filter
  labTestTypes.forEach(labTestType => {
    labTestType.schemaResultsAndThreholdsBySampleType.forEach((schema, sampleType) => {
      const showCol =
        (filter.sampleTypes.length === 0 || filter.sampleTypes.includes(sampleType)) &&
        (filter.testTypes.length === 0 || filter.testTypes.includes(labTestType.labTestKind)) &&
        (filter.labProviders.length === 0 || filter.labProviders.includes(labTestType.labTestProvider));
      schema.forEach((labTestData, testName) => {
        const colId = generateTestHeaderKey({
          provider: labTestType.labTestProvider,
          kind: labTestType.labTestKind,
          sampleType,
          testName,
        });
        if (showCol) {
          visibleCols.push(colId);
        } else {
          hiddenCols.push(colId);
        }
      });
    });
  });

  sampleTypes.length === 0 || shouldShowColumn(cols.MATERIAL_LOT, sampleTypes, cols.PROVIDER_SAMPLE_ID)
    ? visibleCols.push(cols.MATERIAL_LOT)
    : hiddenCols.push(cols.MATERIAL_LOT);

  sampleTypes.length === 0 || shouldShowColumn(cols.CONTAINER_ID, sampleTypes, cols.PROVIDER_SAMPLE_ID)
    ? visibleCols.push(cols.CONTAINER_ID)
    : hiddenCols.push(cols.CONTAINER_ID);

  if (visibleCols.length > 0) {
    tableApi.columnApi.setColumnsVisible(visibleCols, true);
  }
  if (hiddenCols.length > 0) {
    tableApi.columnApi.setColumnsVisible(hiddenCols, false);
  }
}

/**
 * Hook to listen for filter changes and extract filters for 'Sample Type', 'Test Type' and 'Lab'.
 * Initial filter comes from saved filter state (which is any filters the user has previously applied).
 * These filters are then used to determine the subset columns displayed.
 */
export function useSetColumnsVisibility(tableApi: LT.TableApi | undefined, labTestTypes: LT.LabTestType[] | undefined) {
  const state = useCoreStore()[0];

  React.useEffect(() => {
    if (tableApi && labTestTypes && labTestTypes.length > 0 && state.currentUser) {
      setColumnsVisibility(tableApi, getSavedFilterState(state.currentUser), labTestTypes);
      function onFilterChanged() {
        if (tableApi && labTestTypes) {
          setColumnsVisibility(tableApi, tableApi.gridApi.getFilterModel(), labTestTypes);
        }
      }
      tableApi.gridApi.addEventListener('filterChanged', onFilterChanged);
      return () => {
        tableApi.gridApi.removeEventListener('filterChanged', onFilterChanged);
      };
    }
  }, [tableApi, labTestTypes, state.currentUser]);
}
