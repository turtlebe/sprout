import { MetricsSelector as BrandUiMetricsSelector } from '@plentyag/brand-ui/src/components/metrics-selector';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

// todo: this is a placeholder for now. Will continue in a sub-sequent PR with tests.
export const MetricsSelector = memoWithFormikProps<FormGen.FieldMetricsSelector>(
  ({ formGenField, formikProps, ...props }) => {
    const { decorateLabel } = useIsRequired(formGenField);
    const { value, error, name, label } = useFormikProps(formikProps, formGenField);
    const handleChange: BrandUiMetricsSelector['onChange'] = metricIds => formikProps.setFieldValue(name, metricIds);
    const handleCloseDialog: BrandUiMetricsSelector['onCloseDialog'] = () => formikProps.validateField(name);

    return (
      <BrandUiMetricsSelector
        id={name}
        label={decorateLabel(label)}
        error={error}
        metricIds={value}
        onChange={handleChange}
        onCloseDialog={handleCloseDialog}
        {...props}
      />
    );
  }
);
