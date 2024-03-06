import { AllCommunityModules } from '@ag-grid-community/all-modules';
import {
  canShowBrand,
  canShowCaseQuantityPerPallet,
  canShowProductWeight,
  getSkuTypeFromSkuTypeName,
} from '@plentyag/app-crops-skus/src/common/utils';
import {
  AgGridDialogRenderer,
  AgGridEmptyRenderer,
  AgGridLinkRenderer,
  BaseAgGridClientSideTable,
} from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { SelectableItem, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { ISelectionFilterBase } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter/interfaces';
import { FarmDefSkuType } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { useGetBrands, useSearchSkuTypes } from '../../common/hooks';
import { Brands, SkuWithFarmInfo } from '../../common/types';
import { getHasFarmColumns } from '../../common/utils';
import { ROUTES } from '../../constants';
import { formatProductWeight, skusTableCols } from '../utils';

function getBrandColumn(skuTypes: FarmDefSkuType[], brands: Brands) {
  const selectableItems: SelectableItem[] = brands.map(brand => ({
    name: brand.name,
    value: brand.name,
  }));

  const filterParams: ISelectionFilterBase = {
    multiple: false,
    selectableItems,
  };

  return {
    ...skusTableCols.brand,
    filterValueGetter: params =>
      params?.data &&
      selectableItems.find(
        item => item.name === params.data.brandTypeName && canShowBrand(params?.data?.skuTypeName, skuTypes)
      ),
    valueGetter: params => {
      if (canShowBrand(params?.data?.skuTypeName, skuTypes)) {
        return params?.data?.brandTypeName;
      }
    },
    filter: 'selectionFilter',
    filterParams,
  };
}

function getColumnDefs(skus: SkuWithFarmInfo[], skuTypes: FarmDefSkuType[], brands: Brands): ColDef[] {
  if (!skus || !brands || !skuTypes) {
    return [];
  }

  let farmPathsWithSku = [];
  // only show farm columns that have a sku
  skus.forEach(sku => {
    Object.keys(sku.hasFarm).forEach(key => {
      if (sku.hasFarm[key]) {
        farmPathsWithSku.push(key);
      }
    });
  });

  farmPathsWithSku = [...new Set(farmPathsWithSku)];

  return [
    {
      ...skusTableCols.displayName,
      valueGetter: params => params?.data?.displayName,
      cellRendererFramework: params => (
        <AgGridLinkRenderer to={params?.data?.name && ROUTES.sku(params.data.name)}>
          {params.getValue()}
        </AgGridLinkRenderer>
      ),
      checkboxSelection: true,
      minWidth: 300,
      cellStyle: { overflow: 'hidden' },
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.productName,
      valueGetter: params => params?.data?.productName,
      ...defaultAgTextContainsColumnFilter,
    },
    getBrandColumn(skuTypes, brands),
    {
      ...skusTableCols.productWeightOz,
      filterValueGetter: item => formatProductWeight(item?.data?.productWeightOz),
      valueFormatter: params => formatProductWeight(params.value),
      valueGetter: params => {
        if (canShowProductWeight(params?.data?.skuTypeName, skuTypes)) {
          return params?.data?.productWeightOz;
        }
      },
      ...defaultAgTextContainsColumnFilter,
    },
    ...getHasFarmColumns('sku', farmPathsWithSku),
    {
      ...skusTableCols.skuTypeName,
      valueGetter: params => {
        const skuType = getSkuTypeFromSkuTypeName(skuTypes, params?.data?.skuTypeName);
        return skuType ? skuType.description : params?.data?.skuTypeName;
      },
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.packagingLotCropCode,
      valueGetter: params => params?.data?.packagingLotCropCode,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.allowedCropNames,
      valueGetter: params => params?.data?.allowedCropNames,
      cellRendererFramework: params =>
        params?.data?.allowedCropNames.length > 0 ? (
          params.data.allowedCropNames.map(cropName => {
            return (
              <Box key={cropName} m={0.5}>
                <AgGridLinkRenderer to={cropName && ROUTES.crop(cropName)}>{cropName}</AgGridLinkRenderer>
              </Box>
            );
          })
        ) : (
          <AgGridEmptyRenderer />
        ),
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.caseQuantityPerPallet,
      valueGetter: params => {
        if (canShowCaseQuantityPerPallet(params?.data?.skuTypeName, skuTypes)) {
          return params?.data?.caseQuantityPerPallet;
        }
      },
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.childSkuName,
      valueGetter: params => params?.data?.childSkuName,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.labelPrimaryColor,
      valueGetter: params => params?.data?.labelPrimaryColor,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.labelSecondaryColor,
      valueGetter: params => params?.data?.labelSecondaryColor,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.internalExpirationDays,
      valueGetter: params => params?.data?.internalExpirationDays,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.externalExpirationDays,
      valueGetter: params => params?.data?.externalExpirationDays,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.netsuiteItem,
      valueGetter: params => params?.data?.netsuiteItem,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.gtin,
      valueGetter: params => params?.data?.gtin,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      ...skusTableCols.packageImagery,
      valueGetter: params => params?.data?.packageImagery,
      cellRendererFramework: params => (
        <AgGridDialogRenderer
          cellText="Click to View Image"
          title="Package Image"
          content={
            params.value && (
              <img alt={`Package image not found: ${params.value}`} style={{ width: '100%' }} src={params.value} />
            )
          }
        />
      ),
    },
  ];
}

export function useAgGridConfig(skus: SkuWithFarmInfo[]): BaseAgGridClientSideTable['agGridConfig'] {
  const { skuTypes } = useSearchSkuTypes();
  const { data: brands } = useGetBrands();
  const columnDefs = React.useMemo(() => getColumnDefs(skus, skuTypes, brands), [skus, skuTypes]);

  if (!skus || !brands || !skuTypes) {
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
    rowData: skus,
    tooltipShowDelay: 500,
    getRowNodeId: data => data?.name, // unique id for each row.
    immutableData: true,
  };
}
