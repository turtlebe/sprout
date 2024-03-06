import { MarkdownExtended } from '@plentyag/brand-ui/src/components/markdown-extended';
import { Typography as MuiTypography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const Typography = memoWithFormikProps<FormGen.FieldTypography>(
  ({ formikProps, formGenField, style, className }) => {
    const { name, label } = useFormikProps(formikProps, formGenField);

    return (
      <MuiTypography {...formGenField.typographyProps} data-testid={name} id={name} style={style} className={className}>
        <MarkdownExtended>{label}</MarkdownExtended>
      </MuiTypography>
    );
  }
);
