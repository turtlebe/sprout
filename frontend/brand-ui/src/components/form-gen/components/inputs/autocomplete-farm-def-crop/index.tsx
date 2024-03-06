import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';
import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import { get, sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { getOptions } from '../autocomplete/utils';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const SEARCH_CROP_BY_FARM_PATH_URL = '/api/plentyservice/farm-def-service/search-crops-by-farm-path';
export const SEARCH_CROPS_URL = '/api/plentyservice/farm-def-service/search-crops';

type TransformFarmDefCrops = FormGen.FieldSelectRemote<FarmDefCrop[]>['transformResponse'];

interface TransformFarmDefCropsOptions {
  allowList?: FormGen.FieldAutocompleteFarmDefCrop['allowList'];
  extra?: (string | FormGen.ValueLabel)[];
  labelSelector?: string;
  valueSelector?: string;
}

export const transformFarmDefCropData =
  (options?: TransformFarmDefCropsOptions): TransformFarmDefCrops =>
  response => {
    const { allowList = [], extra = [], labelSelector = 'displayName', valueSelector = 'name' } = options ?? {};
    const filteredCrops =
      typeof allowList === 'function'
        ? allowList(response)
        : allowList.length > 0
        ? response.filter(responseCrop => allowList.includes(responseCrop.name))
        : response;
    const autocompleteOptions = filteredCrops.map(crop => ({
      label: get(crop, labelSelector, crop.displayName),
      value: get(crop, valueSelector, crop),
    }));
    return [...sortBy(autocompleteOptions, ['label']), ...getOptions(extra)];
  };

export const AutocompleteFarmDefCrop = memoWithFormikProps<FormGen.FieldAutocompleteFarmDefCrop>(
  ({ formGenField, formikProps, ...props }) => {
    const {
      allowList,
      extra,
      farmPath,
      isPackable,
      isPackableAnywhere,
      isPackableInFarm,
      labelSelector,
      valueSelector,
      ...otherFormGenFieldProps
    } = formGenField;
    const transformResponse = transformFarmDefCropData({
      allowList,
      extra,
      labelSelector,
      valueSelector,
    });

    const url = farmPath
      ? `${SEARCH_CROP_BY_FARM_PATH_URL}${toQueryParams(
          { farmPath, isPackableAnywhere, isPackableInFarm },
          { encodeKeyUsingSnakeCase: true }
        )}`
      : `${SEARCH_CROPS_URL}${toQueryParams({ isPackable })}`;

    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<FarmDefCrop[]> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url,
      transformResponse,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
