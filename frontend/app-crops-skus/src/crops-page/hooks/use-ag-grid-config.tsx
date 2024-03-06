import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { AgGridLinkRenderer, AgGridListRenderer, BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { SelectableItem, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { ISelectionFilterBase } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter/interfaces';
import React from 'react';

import { CropWithFarmInfo, GrowConfigurationType } from '../../common/types';
import { getGrowConfiguration, getHasFarmColumns } from '../../common/utils';
import { ROUTES } from '../../constants';
import { cropsTableCols } from '../utils';

function getGrowConfigurationColumn() {
  const selectableItems: SelectableItem[] = Object.keys(GrowConfigurationType).map(key => ({
    name: GrowConfigurationType[key],
    value: GrowConfigurationType[key],
  }));

  const filterParams: ISelectionFilterBase = {
    multiple: false,
    disableOrderBy: true,
    selectableItems,
  };

  return {
    ...cropsTableCols.growConfiguration,
    filterValueGetter: params =>
      params?.data && selectableItems.find(item => item.name === getGrowConfiguration(params.data)),
    valueGetter: params => params?.data && getGrowConfiguration(params.data),
    filter: 'selectionFilter',
    filterParams,
  };
}

function getColumnDefs(crops: CropWithFarmInfo[]): ColDef[] {
  if (!crops) {
    return [];
  }

  let farmPathsWithCrop = [];
  // only show farm columns that have a crop
  crops.forEach(crop => {
    Object.keys(crop.hasFarm).forEach(key => {
      if (crop.hasFarm[key]) {
        farmPathsWithCrop.push(key);
      }
    });
  });

  farmPathsWithCrop = [...new Set(farmPathsWithCrop)];

  return [
    {
      ...cropsTableCols.displayName,
      valueGetter: params => params?.data?.displayName,
      cellRendererFramework: params => (
        <AgGridLinkRenderer to={params?.data?.name && ROUTES.crop(params.data.name)}>
          {params.getValue()}
        </AgGridLinkRenderer>
      ),
      checkboxSelection: true,
      minWidth: 300,
      cellStyle: { overflow: 'hidden' },
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.name,
      valueGetter: params => params?.data?.name,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.commonName,
      valueGetter: params => params?.data?.commonName,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.displayAbbreviation,
      valueGetter: params => params?.data?.displayAbbreviation,
      ...defaultAgTextContainsColumnFilter,
    },
    getGrowConfigurationColumn(),
    ...getHasFarmColumns('crop', farmPathsWithCrop),
    {
      ...cropsTableCols.media,
      valueGetter: params => params?.data?.media,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.childCrops,
      valueGetter: params => params?.data?.childCrops.map(childCrop => childCrop.defaultCropName),
      cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.skus,
      minWidth: 250,
      valueGetter: params => params?.data?.skus,
      cellRendererFramework: params => <AgGridListRenderer list={params.getValue()} />,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.cropTypeName,
      valueGetter: params => params?.data?.cropTypeName,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.trialDescription,
      valueGetter: params => params?.data?.properties?.trialDescription,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.cultivar,
      valueGetter: params => params?.data?.cultivar,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...cropsTableCols.scientificName,
      valueGetter: params => params?.data?.properties?.scientificName,
      ...defaultAgTextContainsColumnFilter,
    },
  ];
}

export function useAgGridConfig(crops: CropWithFarmInfo[]): BaseAgGridClientSideTable['agGridConfig'] {
  const columnDefs = React.useMemo(() => getColumnDefs(crops), [crops]);

  // some columns are dynamically generated, so don't return config until crops data is available.
  if (!crops) {
    return;
  }

  return {
    components: {},
    frameworkComponents: { selectionFilter: SelectionFilter },
    defaultColDef: {
      floatingFilter: true,
      sortable: true,
      resizable: true,
      lockPosition: true,
    },
    columnDefs,
    modules: AllCommunityModules,
    rowHeight: 48,
    suppressColumnVirtualisation: true,
    suppressRowClickSelection: true,
    rowSelection: 'single',
    rowData: crops,
    tooltipShowDelay: 500,
    getRowNodeId: data => data?.name, // unique id for each row.
    immutableData: true,
  };
}
