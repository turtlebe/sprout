import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { toQueryParams } from '@plentyag/core/src/utils';
import { get, sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { getOptions } from '../autocomplete/utils';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const SEARCH_SKU_BY_FARM_PATH_URL = '/api/plentyservice/farm-def-service/search-skus-by-farm-path';
export const SEARCH_SKUS_URL = '/api/plentyservice/farm-def-service/search-skus';

type TransformFarmDefSkus = FormGen.FieldSelectRemote<FarmDefSku[]>['transformResponse'];

interface TransformFarmDefSkusOptions {
  allowList?: string[];
  allowedSkuTypeNames?: string[];
  extra?: (string | FormGen.ValueLabel)[];
  valueSelector?: string;
}

export const transformFarmDefSkuData =
  (options?: TransformFarmDefSkusOptions): TransformFarmDefSkus =>
  response => {
    const { allowList = [], allowedSkuTypeNames = [], extra = [], valueSelector = 'name' } = options ?? {};
    const filteredSkus =
      allowList.length > 0
        ? response.filter(responseSku => allowList.includes(responseSku.name))
        : allowedSkuTypeNames.length > 0
        ? response.filter(responseSku => allowedSkuTypeNames.includes(responseSku.skuTypeName))
        : response;
    const autocompleteOptions = filteredSkus.map(sku => ({
      label: `${sku.packagingLotCropCode} ${sku.displayName}`,
      value: get(sku, valueSelector, sku),
    }));
    return [...sortBy(autocompleteOptions, ['label']), ...getOptions(extra)];
  };

export const AutocompleteFarmDefSku = memoWithFormikProps<FormGen.FieldAutocompleteFarmDefSku>(
  ({ formGenField, formikProps, ...props }) => {
    const { allowList, allowedSkuTypeNames, extra, farmPath, skuTypeClass, valueSelector, ...otherFormGenFieldProps } =
      formGenField;
    const transformResponse = transformFarmDefSkuData({ allowList, allowedSkuTypeNames, extra, valueSelector });
    const queryParams = {};
    if (farmPath) {
      queryParams['farmPath'] = farmPath;
    }
    if (skuTypeClass) {
      queryParams['skuTypeClass'] = skuTypeClass;
    }
    const queryParamsStr = toQueryParams(queryParams, { encodeKeyUsingSnakeCase: true });
    const url = farmPath ? `${SEARCH_SKU_BY_FARM_PATH_URL}${queryParamsStr}` : `${SEARCH_SKUS_URL}${queryParamsStr}`;
    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<FarmDefSku[]> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url,
      transformResponse,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
