import { ColDef, ValueGetterFunc } from '@ag-grid-community/all-modules';
import { mockWorkbinTaskDefinitionData } from '@plentyag/app-production/src/common/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';

import { FARM_OPS, FARM_OS, fields, useAgGridWorkbinDefinitionTableConfig } from '.';

describe('useAgGridWorkbinDefinitionTableConfig', () => {
  it('has "Source" column that filters by field: WorkbinTaskDefinition.definitionCreatedByInternalService', () => {
    const workbinTaskDefinitionData = cloneDeep(mockWorkbinTaskDefinitionData);

    // modify mock data so first defn comes from internal (farmos)
    workbinTaskDefinitionData[0].definitionCreatedByInternalService = true;
    // modify mock data so 2nd defn comes from external (farmops)
    workbinTaskDefinitionData[1].definitionCreatedByInternalService = false;

    const { result } = renderHook(() => useAgGridWorkbinDefinitionTableConfig(workbinTaskDefinitionData));

    const sourceField: ColDef = result.current.columnDefs.find(column => (column as ColDef).colId === fields.source);

    // mock placeholder data for portions of ValueGetterFunc that are not needed in tests here.
    const mockValueGetter = {
      node: null,
      column: null,
      colDef: null,
      api: null,
      columnApi: null,
      context: null,
      getValue: null,
    };

    const filterValueGetter = sourceField.filterValueGetter as ValueGetterFunc;
    expect(
      filterValueGetter({
        data: workbinTaskDefinitionData[0],
        ...mockValueGetter,
      })
    ).toEqual({ name: FARM_OS, value: FARM_OS });
    expect(
      filterValueGetter({
        data: workbinTaskDefinitionData[1],
        ...mockValueGetter,
      })
    ).toEqual({ name: FARM_OPS, value: FARM_OPS });

    const valueGetter = sourceField.valueGetter as ValueGetterFunc;
    expect(
      valueGetter({
        data: workbinTaskDefinitionData[0],
        ...mockValueGetter,
      })
    ).toEqual(FARM_OS);
    expect(
      valueGetter({
        data: workbinTaskDefinitionData[1],
        ...mockValueGetter,
      })
    ).toEqual(FARM_OPS);
  });
});
