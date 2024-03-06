/* eslint-disable @typescript-eslint/await-thenable */
import {
  CircularProgress,
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps,
} from '@plentyag/brand-ui/src/material-ui/core';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';
import { useDebounce } from 'react-use';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const dataTestIds = {
  loader: 'pti-label-decoder-loader',
};

function extractCaseIdFromJson(json: string) {
  try {
    const { caseId } = JSON.parse(json);

    return caseId;
  } catch {
    return null;
  }
}

export const getPtiRecordUrl = caseId => `/api/plentyservice/traceability/get-pti-record/${caseId}`;

export const PtiLabelDecoder = memoWithFormikProps<FormGen.FieldPtiLabelDecoder>(
  ({ formGenField, formikProps, ...props }) => {
    const { decorateLabel } = useIsRequired(formGenField);
    const { value, error, name, label } = useFormikProps(formikProps, formGenField);
    const [isLoading, setIsLoading] = React.useState(false);

    // handlers
    const handleChange: TextFieldProps['onChange'] = async event => {
      const newValue = extractCaseIdFromJson(event.target.value) || event.target.value;

      await formikProps.setFieldValue(name, newValue);
      formikProps.validateField(name);
    };
    const handleBlur: TextFieldProps['onBlur'] = () => formikProps.validateField(name);

    useDebounce(
      async () => {
        if (!value) {
          return;
        }
        // FGQA hack to prevent decoding historical data. May consider removing it.
        if (value.startsWith('historical-data-row-')) {
          return;
        }

        setIsLoading(true);
        try {
          const response = await axiosRequest<GetPtiRecord>({
            method: 'GET',
            url: getPtiRecordUrl(value),
          });
          const { unitType, product } = response.data;
          await formikProps.setFieldValue(formGenField.mapUnitTypeTo, unitType);
          formikProps.validateField(formGenField.mapUnitTypeTo);
          await formikProps.setFieldValue(formGenField.mapProductTo, product);
          formikProps.validateField(formGenField.mapProductTo);
        } catch (error) {
          if (error.isAxiosError && error.response.status === 404) {
            await formikProps.setFieldValue(name, '');
            formikProps.validateField(name);
            return;
          }
          throw error;
        } finally {
          setIsLoading(false);
        }
      },
      500,
      [value]
    );

    return (
      <MuiTextField
        value={value ?? ''}
        id={name}
        data-testid={name}
        name={name}
        error={Boolean(error)}
        helperText={error}
        label={decorateLabel(label)}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
        InputProps={{
          endAdornment: Boolean(isLoading) && (
            <InputAdornment position="end">
              <CircularProgress data-testid={dataTestIds.loader} style={{ width: '1rem', height: '1rem' }} />
            </InputAdornment>
          ),
        }}
      />
    );
  }
);
