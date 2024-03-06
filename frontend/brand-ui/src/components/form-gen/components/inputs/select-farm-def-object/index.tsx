import { FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import { sortBy } from 'lodash';
import React from 'react';

import { memoWithFormikProps } from '../memo-with-formik-props';
import { SelectRemote } from '../select-remote';

export const SEARCH_OBJECT_URL = '/api/plentyservice/farm-def-service/search-object';

export const getSearchObjectUrl = ({ site, kind, class: klass }) => {
  return `${SEARCH_OBJECT_URL}${toQueryParams({ site, kind, class: klass })}`;
};

type TransformFarmDefObjects = FormGen.FieldSelectRemote<FarmDefObject[]>['transformResponse'];

interface TransformFarmDefObjectsOption {
  allowedPaths: string[];
}

export const transformFarmDefObjects =
  (options?: TransformFarmDefObjectsOption): TransformFarmDefObjects =>
  response => {
    const { allowedPaths = [] } = options ?? {};

    const autocompleteOptions = response
      .filter(farmDefObject => allowedPaths.length === 0 || allowedPaths.includes(farmDefObject.path))
      .map(farmDefObject => ({
        label: farmDefObject.displayName,
        value: farmDefObject.path,
      }));
    return sortBy(autocompleteOptions, ['label']);
  };

export const SelectFarmDefObject = memoWithFormikProps<FormGen.FieldSelectFarmDefObject>(
  ({ formGenField, formikProps, ...props }) => {
    const { allowedPaths, site, kind, class: klass, ...otherFormGenFieldProps } = formGenField;
    const transformResponse = transformFarmDefObjects({ allowedPaths });

    const formGenFieldAutocomplete: FormGen.FieldSelectRemote<FarmDefObject[]> = {
      ...otherFormGenFieldProps,
      type: 'SelectRemote',
      url: getSearchObjectUrl({ site, kind, class: klass }),
      transformResponse,
    };

    return <SelectRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
