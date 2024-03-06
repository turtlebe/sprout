import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import React from 'react';

import { memoWithFormikProps } from '../memo-with-formik-props';
import { RadioGroup } from '../radio-group';

export const RadioGroupRemote = memoWithFormikProps<FormGen.FieldRadioGroupRemote<unknown>>(
  ({ formGenField, formikProps, ...props }) => {
    const { url, transformResponse, ...otherFormGenFieldProps } = formGenField;
    const snackbar = useGlobalSnackbar();
    const { data } = useSwrAxios(
      { url },
      {
        onError: error => {
          snackbar.errorSnackbar();
          console.error(error);
        },
      }
    );

    const options = React.useMemo(() => (data ? transformResponse(data) : []), [data]);

    const radioGroupFormGenField: FormGen.FieldRadioGroup = {
      ...otherFormGenFieldProps,
      type: 'RadioGroup',
      options,
    };

    return <RadioGroup formGenField={radioGroupFormGenField} formikProps={formikProps} {...props} />;
  }
);
