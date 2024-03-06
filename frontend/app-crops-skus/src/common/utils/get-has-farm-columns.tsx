import { AgGridCheckRenderer } from '@plentyag/brand-ui/src/components/ag-grid-check-renderer';
import { ISelectionFilter, SelectableItem } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import React from 'react';

import { getFarmName } from './get-farm-name';

function getHasFarmSelectionFilter(selectableItems: SelectableItem[]): ISelectionFilter {
  return {
    filter: 'selectionFilter',
    filterParams: {
      multiple: false,
      selectableItems,
    },
  };
}

export function getHasFarmColumns(type: 'crop' | 'sku', farmPaths: string[]) {
  const sortFarmPaths = [...farmPaths].sort((a, b) => getFarmName(a).localeCompare(getFarmName(b)));
  const hasType = `Has ${type}`;
  const doesNotHaveType = `Does not have ${type}`;
  return sortFarmPaths.map(farmPath => {
    const farmName = getFarmName(farmPath);
    const selectableItems: SelectableItem[] = [
      { name: hasType, value: hasType },
      { name: doesNotHaveType, value: doesNotHaveType },
    ];
    return {
      headerName: farmName,
      field: `farm-${farmName}`,
      colId: `farm-${farmName}`,
      headerTooltip: `A checked/true entry indicates this ${type} is active in this farm.`,
      filterValueGetter: params => (params?.data?.hasFarm[farmPath] ? selectableItems[0] : selectableItems[1]),
      valueGetter: params => (params?.data?.hasFarm[farmPath] ? selectableItems[0].value : selectableItems[1].value),
      cellRendererFramework: params => <AgGridCheckRenderer isChecked={params?.data?.hasFarm[farmPath]} />,
      ...getHasFarmSelectionFilter(selectableItems),
    };
  });
}
