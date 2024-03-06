import { MarkdownExtended } from '@plentyag/brand-ui/src/components/markdown-extended';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio as MuiRadio,
  RadioGroup as MuiRadioGroup,
  Paper,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const dataTestIds = {
  radioGroup: 'radio-group',
  category: 'category',
  helperText: 'helper-text',
  radioButton: 'radio-button',
  noOptions: 'no-options',
};

export const NO_OPTIONS_MESSAGE = 'No Options available.';

export const RadioGroup = memoWithFormikProps<FormGen.FieldRadioGroup>(({ formGenField, formikProps, ...props }) => {
  const { decorateLabel } = useIsRequired(formGenField);
  const { value, error, name, label } = useFormikProps(formikProps, formGenField);

  const radioProps = formGenField.radioProps;
  const sortOptionsByLabel = formGenField.sortOptionsByLabel ?? true;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    formikProps.setFieldValue(name, newValue);
  }

  // get all categories, adding empty string if category doesn't exist.
  let categories: string[] = formGenField.options.map<string>(option => option.category || '');
  // dedup and sort categories, with empty category at top.
  categories = [...new Set(categories)].sort((a, b) => -b.localeCompare(a));

  const radioItems = [];
  categories.forEach(category => {
    const itemsInCategory = formGenField.options.filter(
      item => item.category === category || (category === '' && !item.category)
    );
    if (sortOptionsByLabel) {
      itemsInCategory.sort((a, b) => -b.label.localeCompare(a.label));
    }
    itemsInCategory.forEach((categoryItem, index) => {
      const labelElement = (
        <>
          <Typography style={{ wordBreak: 'break-word' }}>{categoryItem.label}</Typography>
          {categoryItem.helperText && (
            <Typography data-testid={dataTestIds.helperText} variant="caption">
              <MarkdownExtended>{categoryItem.helperText}</MarkdownExtended>
            </Typography>
          )}
        </>
      );
      radioItems.push(
        <Box key={categoryItem.value} m={1}>
          {index === 0 && category && (
            <Typography data-testid={dataTestIds.category} gutterBottom={true}>
              {category}
            </Typography>
          )}
          <Paper style={{ padding: '1rem' }} variant="outlined">
            <FormControlLabel
              value={categoryItem.value}
              control={<MuiRadio data-testid={dataTestIds.radioButton} {...radioProps} />}
              label={labelElement}
            />
          </Paper>
        </Box>
      );
    });
  });

  return (
    <FormControl {...props} error={Boolean(error)} data-testid={name}>
      <FormLabel>{decorateLabel(label)}</FormLabel>
      {radioItems.length === 0 && (
        <Box m={1}>
          <Typography data-testid={dataTestIds.noOptions}>{NO_OPTIONS_MESSAGE}</Typography>
        </Box>
      )}
      <MuiRadioGroup
        data-testid={dataTestIds.radioGroup}
        value={value ?? ''}
        name={name}
        id={name}
        onChange={handleChange}
      >
        {radioItems}
      </MuiRadioGroup>
      {error && (
        <FormHelperText id={`${name}-helper-text`} error={Boolean(error)}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
});
