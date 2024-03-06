import { FormHelperText } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const ReactComponent = memoWithFormikProps<FormGen.FieldReactComponent>(
  ({ formGenField, formikProps, ...props }) => {
    const { component: Component } = formGenField;
    const { className, style, ...otherProps } = props;
    const { error } = useFormikProps(formikProps, formGenField);

    return (
      <div className={className} style={style}>
        <Component formGenField={formGenField} formikProps={formikProps} {...otherProps} />
        {Boolean(error) && <FormHelperText error={true}>{error}</FormHelperText>}
      </div>
    );
  }
);
