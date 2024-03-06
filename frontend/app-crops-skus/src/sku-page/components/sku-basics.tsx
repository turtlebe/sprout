import { canShowBrand, canShowProductWeight } from '@plentyag/app-crops-skus/src/common/utils';
import { Card, Show } from '@plentyag/brand-ui/src/components';
import { Grid } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefSku, FarmDefSkuType } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { CropLink, CropSkuCardItem } from '../../common/components';
import { skusTableCols } from '../../skus-page/utils';

interface SkuBasics {
  sku: FarmDefSku;
  skuTypes: FarmDefSkuType[];
}

export const SkuBasics: React.FC<SkuBasics> = ({ sku, skuTypes }) => {
  return (
    <Grid item xs={6}>
      <Card title="SKU Basics" isLoading={false}>
        <CropSkuCardItem tableCol={skusTableCols.productName} value={sku?.productName} />
        <Show when={canShowBrand(sku.skuTypeName, skuTypes)}>
          <CropSkuCardItem tableCol={skusTableCols.brand} value={sku?.brandTypeName} />
        </Show>
        <Show when={canShowProductWeight(sku.skuTypeName, skuTypes)}>
          <CropSkuCardItem tableCol={skusTableCols.productWeightOz} value={sku?.productWeightOz?.toString()} />
        </Show>
        <CropSkuCardItem tableCol={skusTableCols.displayAbbreviation} value={sku?.displayAbbreviation} />
        <CropSkuCardItem
          tableCol={skusTableCols.packagingLotCropCode}
          value={<CropLink cropName={sku.packagingLotCropCode} />}
        />
        <CropSkuCardItem tableCol={skusTableCols.labelPrimaryColor} value={sku?.labelPrimaryColor} />
        <CropSkuCardItem tableCol={skusTableCols.labelSecondaryColor} value={sku?.labelSecondaryColor} />
        <CropSkuCardItem
          tableCol={skusTableCols.internalExpirationDays}
          value={sku?.internalExpirationDays.toString()}
        />
        <CropSkuCardItem
          tableCol={skusTableCols.externalExpirationDays}
          value={sku?.externalExpirationDays.toString()}
        />
        <CropSkuCardItem
          tableCol={skusTableCols.bestByDate}
          value={(sku?.internalExpirationDays + sku?.externalExpirationDays).toString()}
        />
        <CropSkuCardItem tableCol={skusTableCols.netsuiteItem} value={sku?.netsuiteItem} />
        <CropSkuCardItem tableCol={skusTableCols.gtin} value={sku?.gtin} />
      </Card>
    </Grid>
  );
};
