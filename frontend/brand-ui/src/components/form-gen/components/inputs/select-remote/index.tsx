import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { memoWithFormikProps } from '../memo-with-formik-props';
import { Select } from '../select';

export const SelectRemote = memoWithFormikProps<FormGen.FieldSelectRemote<unknown>>(
  ({ formGenField, formikProps, ...props }) => {
    const { url, transformResponse, ...otherFormGenFieldProps } = formGenField;
    const { data, error } = useSwrAxios({ url });
    useLogAxiosErrorInSnackbar(error);

    const options = React.useMemo(() => (data ? transformResponse(data) : []), [data]);

    const selectFormGenField: FormGen.FieldSelect = {
      ...otherFormGenFieldProps,
      type: 'Select',
      options,
    };

    return <Select formGenField={selectFormGenField} formikProps={formikProps} {...props} />;
  }
);
