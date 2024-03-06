import { TooltipRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/tooltip-renderer';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export interface InputRendererProps {
  inputContainer?: string;
  inputContainerStyle?: CSSProperties;
  InputComponent: React.FC<FormGen.FieldProps<FormGen.Field>>;
}

export const InputRenderer: React.FC<FormGen.FieldProps<FormGen.Field> & InputRendererProps> = React.memo(props => {
  const { InputComponent, inputContainer, inputContainerStyle, formGenField, formikProps, ...allowedProps } = props;

  if (!InputComponent) {
    throw new Error(`Invalid formGenField type: ${formGenField.type}`);
  }

  return (
    <Box
      className={inputContainer}
      position="relative"
      style={inputContainerStyle}
      data-testid={`input-container-${formGenField.name}`}
      data-inputcontainer
    >
      <TooltipRenderer formGenField={formGenField} formikProps={formikProps} {...allowedProps} />
      <InputComponent formGenField={formGenField} formikProps={formikProps} {...allowedProps} />
    </Box>
  );
});
