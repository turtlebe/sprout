import React from 'react';

export const useIsRequired = (formGenField: FormGen.Field) => {
  const decorateLabel = React.useCallback(
    (label: string) => {
      if (!formGenField.validate) {
        return label;
      }

      const hasRequiredValidation = Boolean(
        formGenField.validate.describe().tests.find(test => test.name === 'required')
      );

      return hasRequiredValidation ? `${label} *` : label;
    },
    [formGenField]
  );

  return {
    decorateLabel,
  };
};
