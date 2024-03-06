import Autocomplete from '@material-ui/lab/Autocomplete';
import { Box, Divider, TextField, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { cloneDeep, debounce } from 'lodash';
import { DateTime } from 'luxon';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useFormikProps } from '../hooks/use-formik-props';
import { memoWithFormikProps } from '../memo-with-formik-props';

import { DraggableOption } from './draggable-option';
import { useStyles } from './styles';

export const dataTestIds = {
  autoCompleteDataTestId: (name: string) => `${name}-autocomplete`,
};

export const AutocompleteMultipleDndOrdering = memoWithFormikProps<FormGen.FieldAutocompleteMultipleDndOrdering>(
  ({ formGenField, formikProps }) => {
    const styles = useStyles();
    const { name } = useFormikProps(formikProps, formGenField);
    const allOptions = formGenField.options || [];
    const selectedOptions = formGenField.selected || [];
    const newOptionLabel = formGenField.addNewOptionText || `Add new ${name}`;
    const allOptionLabels = allOptions.map(value => value.label);

    const labelToValueMap = allOptions.reduce(function (map, obj) {
      map[obj.label] = obj.value;
      return map;
    }, {});

    const [options, setOptions] = React.useState(
      allOptions
        .filter(value => selectedOptions.includes(value.label))
        .sort((a, b) => selectedOptions.indexOf(a.label) - selectedOptions.indexOf(b.label))
        .map(value => ({ id: value.value, text: value.label }))
    );

    const updateOptions = newOptions => {
      setOptions(newOptions);
    };

    React.useEffect(() => {
      formikProps.setFieldValue(
        name,
        options.map(option => ({ value: option.id, label: option.text }))
      );
    }, [options]);

    const [optionsThatCanBeAdded, setOptionsThatCanBeAdded] = React.useState(
      allOptionLabels.filter(value => !selectedOptions.includes(value))
    );
    // This is an issue with react-dnd for now where it re-renders too fast
    // https://github.com/react-dnd/react-dnd/issues/361
    const moveOptionToDebounce = (dragIndex, hoverIndex) => {
      const dragOption = options[dragIndex];
      const newOptions = cloneDeep(options);
      newOptions.splice(dragIndex, 1);
      newOptions.splice(hoverIndex, 0, dragOption);
      newOptions[hoverIndex] = options[dragIndex];
      updateOptions(newOptions);
    };

    const moveOption = React.useCallback(debounce(moveOptionToDebounce, 100), [options]);

    const removeOption = (text: string) => {
      updateOptions(options.filter(item => item.text != text));
      optionsThatCanBeAdded.push(text);
      setOptionsThatCanBeAdded(optionsThatCanBeAdded);
    };

    const renderOption = (option: { id: string; text: string }, index: number) => {
      return (
        <DraggableOption
          key={option.id}
          index={index}
          id={option.id}
          text={option.text}
          moveOption={moveOption}
          removeOption={removeOption}
        />
      );
    };
    const [autoSelectValue, setAutoSelectValue] = React.useState(null);

    const handleChange = (event: any, newValue: string, reason: string) => {
      if (reason == 'select-option') {
        if (newValue in labelToValueMap) {
          setOptionsThatCanBeAdded(optionsThatCanBeAdded.filter(item => item !== newValue));
          // Make sure to prevent duplicates even if somehow we did not clear the input
          if (options.filter(value => value.id == labelToValueMap[newValue]).length == 0) {
            options.push({ id: labelToValueMap[newValue], text: newValue });
          }

          updateOptions(options);
          setAutoSelectValue('');
        }
      } else {
        setAutoSelectValue(newValue);
      }
    };

    return (
      <Box data-testid={name}>
        <Typography className={styles.subtitleText}>Workbin tasks (set order here)</Typography>
        <Divider className={styles.divider} />
        <DndProvider backend={HTML5Backend}>
          <Box>{options.map((option, i) => renderOption(option, i))}</Box>
        </DndProvider>
        <Box>
          <Autocomplete
            value={autoSelectValue}
            // Force refresh of component since just setting the value doesn't work when done more than once
            // https://stackoverflow.com/questions/59790956/material-ui-autocomplete-clear-value
            key={DateTime.now().toISO()}
            onChange={handleChange}
            data-testid={dataTestIds.autoCompleteDataTestId(name)}
            selectOnFocus
            clearOnBlur
            freeSolo
            handleHomeEndKeys
            options={optionsThatCanBeAdded}
            className={styles.dndInput}
            renderInput={params => (
              <TextField
                {...params}
                label={optionsThatCanBeAdded.length > 0 ? newOptionLabel : 'No more options'}
                variant="outlined"
              />
            )}
          />
        </Box>
      </Box>
    );
  }
);
