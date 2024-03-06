import { getNonNumericalRuleValue } from '@plentyag/app-environment/src/common/utils';
import { TextField } from '@plentyag/brand-ui/src/material-ui/core';
import { Rule } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface TextFieldRuleValue {
  rule: Rule;
  onChange: (newValue: string) => void;
  'data-testid': string;
}

export const TextFieldRuleValue: React.FC<TextFieldRuleValue> = ({ rule, onChange, 'data-testid': dataTestId }) => {
  const [value, setValue] = React.useState<string>(getNonNumericalRuleValue(rule, { default: '' }));

  React.useEffect(() => {
    const valueFromRule = getNonNumericalRuleValue(rule, { default: '' });
    setValue(valueFromRule);
  }, [rule]);

  return (
    <TextField
      data-testid={dataTestId}
      variant="outlined"
      size="small"
      value={value}
      onChange={event => setValue(event.target.value)}
      onBlur={() => onChange(value)}
    />
  );
};
