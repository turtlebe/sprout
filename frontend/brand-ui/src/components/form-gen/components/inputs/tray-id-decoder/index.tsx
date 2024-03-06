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

import { GetTrayIDRecord } from './tray-id-decoder';

export const dataTestIds = {
  loader: 'tray-id-decoder-loader',
};

export const TRAY_ID_ERROR =
  'The Tray ID does not exist. Examples: P900-0008529A:ABCD-EFGH-X4 or Tray:0_0_1:A1B2-C3D4-E5-d';
export const TRAY_ID_PERMISSION_ERROR =
  'You do not have enough permissions to decode the tray ID. Please contact #farmos-support';

function extractTrayIdFromJson(json: string) {
  try {
    const { trayId } = JSON.parse(json);

    return trayId;
  } catch {
    return null;
  }
}

export const getTrayIdRecordURL = trayId => `/api/plentyservice/traceability3/get-state-by-id/${trayId}`;

export const TrayIdDecoder = memoWithFormikProps<FormGen.FieldTrayIdDecoder>(
  ({ formGenField, formikProps, ...props }) => {
    const { decorateLabel } = useIsRequired(formGenField);
    const { value, error, name, label } = useFormikProps(formikProps, formGenField);
    const [isLoading, setIsLoading] = React.useState(false);

    // handlers
    const handleChange: TextFieldProps['onChange'] = async event => {
      const newValue = extractTrayIdFromJson(event.target.value) || event.target.value;
      await formikProps.setFieldValue(name, newValue);
      formikProps.validateField(name);
    };
    const handleBlur: TextFieldProps['onBlur'] = () => formikProps.validateField(name);

    useDebounce(
      async () => {
        if (!value) {
          await formikProps.setFieldValue(formGenField.mapProductTo, '');
          return;
        }

        setIsLoading(true);
        try {
          const response = await axiosRequest<GetTrayIDRecord>({
            method: 'GET',
            url: getTrayIdRecordURL(value),
          });
          const { materialObj } = response.data;
          await formikProps.setFieldValue(formGenField.mapProductTo, materialObj.product);
          formikProps.validateField(formGenField.mapProductTo);
        } catch (error) {
          if (error.isAxiosError && error.response.status === 404) {
            await formikProps.setFieldValue(formGenField.mapProductTo, '');
            formikProps.setFieldError(name, formGenField.errorMessage || TRAY_ID_ERROR);
            return;
          }
          if (error.isAxiosError && error.response.status === 403) {
            await formikProps.setFieldValue(formGenField.mapProductTo, '');
            formikProps.setFieldError(name, TRAY_ID_PERMISSION_ERROR);
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
