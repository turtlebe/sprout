import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useFormikProps } from '@plentyag/brand-ui/src/components/form-gen/components/inputs/hooks/use-formik-props';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Input,
  MenuItem,
  Select,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { cloneDeep, debounce } from 'lodash';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DraggableFieldCard } from './components/draggable-field-card';
import { useStyles } from './styles';

export const dataTestIds = {
  inputFieldNameDataTestId: (name: string) => `${name}-new-field-name`,
  inputFieldTypeDataTestId: (name: string) => `${name}-new-field-type`,
  isFieldRequiredDataTestId: (name: string) => `${name}-new-field-required`,
  addNewFieldDataTestId: (name: string) => `${name}-add-new-field`,
  addNewFieldErrorDataTestId: (name: string) => `${name}-add-new-field-error`,
  draggableFieldsContainerId: (name: string) => `${name}-draggable-fields-container`,
};

export interface FieldDynamicOption {
  fieldName: string;
  fieldType: ProdActions.FundamentalFieldTypes;
  isRequired: boolean;
}

export interface FieldMultipleDynamicFields {
  disabled: boolean;
  initialFields: FieldDynamicOption[];
  availableTypes: ProdActions.FundamentalFieldTypes[];
}

/*
A custom component that is used in the workbin task definition edit form to allow
users to customize the list of fields that the task definition has.
*/
export const TaskDefinitionFields: React.FC<
  FieldMultipleDynamicFields & FormGen.FieldProps<FormGen.FieldReactComponent>
> = ({ formGenField, formikProps, initialFields, availableTypes, disabled }) => {
  const styles = useStyles();
  const { name } = useFormikProps(formikProps, formGenField);

  const [fields, setFields] = React.useState(initialFields);

  const [newFieldName, setNewFieldName] = React.useState('');
  const [newFieldError, setNewFieldError] = React.useState('');
  const [newFieldType, setNewFieldType] = React.useState<ProdActions.FundamentalFieldTypes>(
    availableTypes ? availableTypes[0] : 'TYPE_STRING'
  );
  const [newFieldRequired, setNewFieldRequired] = React.useState(true);
  React.useEffect(() => {
    formikProps.setFieldValue(name, initialFields);
  }, [initialFields]);

  React.useEffect(() => {
    formikProps.setFieldValue(name, fields);
  }, [fields]);

  const handleChangeNewFieldName = (event: any) => {
    setNewFieldName(event.target.value);
    setNewFieldError('');
  };

  const handleChangeNewFieldType = (event: any) => {
    setNewFieldType(event.target.value);
  };

  const handleChangeNewFieldRequired = (event: any) => {
    setNewFieldRequired(event.target.checked);
  };

  const updateDynamicFields = newFields => {
    formikProps.setFieldValue(name, newFields);
    setFields(newFields);
  };

  const moveFieldCardToDebounce = (dragIndex, hoverIndex) => {
    const dragOption = fields[dragIndex];
    const newFields = cloneDeep(fields);
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, dragOption);
    newFields[hoverIndex] = fields[dragIndex];
    updateDynamicFields(newFields);
  };
  // This is an issue with react-dnd for now where it re-renders too fast
  // https://github.com/react-dnd/react-dnd/issues/361
  const moveFieldCard = React.useCallback(debounce(moveFieldCardToDebounce, 100), [fields]);

  const removeFieldCard = (text: string) => {
    updateDynamicFields(fields.filter(item => item.fieldName != text));
  };

  const handleAddNewField = () => {
    if (!newFieldName) {
      setNewFieldError('Name was not set!');
      return;
    }
    if (fields.filter(value => value.fieldName == newFieldName).length > 0) {
      setNewFieldError('Duplicate name!');
      return;
    }
    setNewFieldError('');

    fields.push({ fieldName: newFieldName, fieldType: newFieldType, isRequired: newFieldRequired });
    updateDynamicFields(fields);
    setNewFieldName('');
  };

  const renderFieldCard = (field: { fieldName: string; fieldType: string; isRequired: boolean }, index: number) => {
    return (
      <DraggableFieldCard
        key={field.fieldName}
        fieldName={field.fieldName}
        index={index}
        fieldType={field.fieldType}
        isRequired={field.isRequired}
        moveFieldCard={moveFieldCard}
        removeFieldCard={removeFieldCard}
        disabled={disabled}
      />
    );
  };

  return (
    <Box data-testid={name}>
      <Typography className={styles.subtitleText}>Additional fields</Typography>
      <Divider className={styles.divider} />
      <Box data-testid={dataTestIds.draggableFieldsContainerId(name)}>
        <DndProvider backend={HTML5Backend}>
          <Box>{fields.map((field, i) => renderFieldCard(field, i))}</Box>
        </DndProvider>
      </Box>
      <Divider className={styles.divider} />

      <Box className={styles.topLevelContainerBox}>
        <Box className={styles.newFieldBox}>
          <Typography data-testid={dataTestIds.addNewFieldErrorDataTestId(name)} className={styles.newFieldError}>
            {newFieldError}
          </Typography>
          <Button
            data-testid={dataTestIds.addNewFieldDataTestId(name)}
            className={styles.addNewButton}
            startIcon={<AddCircleOutlineIcon style={{ color: '#fff' }} />}
            variant="contained"
            color="default"
            onClick={handleAddNewField}
            size="small"
            disabled={disabled}
          >
            Add new field
          </Button>
        </Box>
        <Divider className={styles.divider} />
        <Box className={styles.newFieldBox}>
          <Typography className={styles.newFieldLabel}>Field Name</Typography>
          <Input
            data-testid={dataTestIds.inputFieldNameDataTestId(name)}
            disabled={disabled}
            value={newFieldName}
            onChange={handleChangeNewFieldName}
            error={newFieldError !== ''}
            className={styles.newFieldInput}
          ></Input>
        </Box>
        <Divider className={styles.divider} />
        <Box className={styles.newFieldBox}>
          <Typography className={styles.newFieldLabel}>Type</Typography>
          <Select
            data-testid={dataTestIds.inputFieldTypeDataTestId(name)}
            disabled={disabled}
            value={newFieldType}
            onChange={handleChangeNewFieldType}
            input={<Input />}
            className={styles.newFieldInput}
          >
            {availableTypes.map(value => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Divider className={styles.divider} />
        <Box className={styles.newFieldBox}>
          <Typography className={styles.newFieldLabel}>Required?</Typography>
          <Checkbox
            data-testid={dataTestIds.isFieldRequiredDataTestId(name)}
            disabled={disabled}
            checked={newFieldRequired}
            onChange={handleChangeNewFieldRequired}
            size="small"
            className={styles.newFieldInput}
          />
        </Box>
      </Box>
    </Box>
  );
};
