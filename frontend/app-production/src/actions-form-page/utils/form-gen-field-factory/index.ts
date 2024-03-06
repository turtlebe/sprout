import { cloneDeep, set } from 'lodash';

import {
  getYupBooleanValidator,
  getYupEnumValidator,
  getYupNumberValidator,
  getYupStringValidator,
} from '../yup-validators';

import { formGenFieldCustomTypeFactory } from './form-gen-field-custom-type-factory';

/**
 * This function creates a formgen field definition from given farmdef "field".
 */
export function formGenFieldFactory({
  field,
  operation,
  currentFarmPath,
}: {
  field: ProdActions.Field;
  operation: ProdActions.Operation;
  currentFarmPath: string;
}): FormGen.FieldAny {
  const name = field.name;
  const label = field.displayName;

  // when field has pre-filled value, disabled the field so user can not change.
  const nameExist = Object.keys(operation.prefilledArgs).includes(name);
  const isDisabled = nameExist && operation.prefilledArgs[name].isDisabled;
  const defaultValue = nameExist ? operation.prefilledArgs[name].value : undefined;

  const fieldType = field.type;

  const isOptional = field.options?.farmosRpc?.isOptional;

  switch (field.type) {
    case 'TYPE_MESSAGE':
      if (field.fields.length > 1) {
        // when there is more than one nested field then group together and recurse to generate fields.
        let formGenFields: FormGen.FieldAny[] = [];
        field.fields.forEach(nestedField => {
          // if parent has "isOptional" value then this overrides nested field value.
          const _nestedField =
            typeof isOptional === 'boolean'
              ? set(cloneDeep(nestedField), 'options.farmosRpc.isOptional', isOptional)
              : nestedField;

          const field = formGenFieldFactory({
            field: _nestedField,
            operation,
            currentFarmPath,
          });
          if (field) {
            formGenFields = formGenFields.concat(field);
          }
        });
        if (field.repeated) {
          const group: FormGen.FieldGroupFunction = {
            type: 'group',
            label: field.displayName,
            name: field.name,
            fields: () => formGenFields,
          };
          return group;
        }
        const group: FormGen.FieldGroupArray = {
          type: 'group',
          label: field.displayName,
          name: field.name,
          fields: formGenFields,
        };
        return group;
      }

      // support custom fields - wrapped in a group so we can get repeated behavior.
      const nestedField = formGenFieldCustomTypeFactory({ field, operation, currentFarmPath });
      if (!nestedField) {
        return null;
      }
      if (field.repeated) {
        const group: FormGen.FieldGroupFunction = {
          type: 'group',
          name: field.name,
          fields: () => [nestedField],
        };
        return group;
      }
      const group: FormGen.FieldGroupArray = {
        type: 'group',
        name: field.name,
        fields: [nestedField],
      };
      return group;

    case 'TYPE_BOOL':
      const booleanSelectField: FormGen.FieldSelect = {
        type: 'Select',
        name,
        label,
        default: defaultValue,
        options: ['true', 'false'],
        validate: getYupBooleanValidator(field, isOptional),
        selectProps: { disabled: isDisabled },
      };
      return booleanSelectField;

    case 'TYPE_INT32':
    case 'TYPE_UINT32':
    case 'TYPE_FLOAT':
      const textFieldNumber: FormGen.FieldTextField = {
        type: 'TextField',
        name,
        label,
        default: defaultValue,
        validate: getYupNumberValidator(field.options, field.type, isOptional),
        textFieldProps: { type: 'number', disabled: isDisabled },
      };
      return textFieldNumber;

    case 'TYPE_STRING':
      const textFieldStr: FormGen.FieldTextField = {
        type: 'TextField',
        name,
        label,
        default: defaultValue,
        validate: getYupStringValidator(field.options, isOptional, isDisabled),
        textFieldProps: { disabled: isDisabled },
      };
      return textFieldStr;

    case 'TYPE_ENUM':
      const radioGroupField: FormGen.FieldRadioGroup = {
        type: 'RadioGroup',
        name,
        label,
        default: defaultValue,
        options: field.enumOptions.value.map(option => ({
          value: option.name,
          label: option.name,
        })),
        validate: getYupEnumValidator(field, isOptional),
        radioProps: { disabled: isDisabled },
      };
      return radioGroupField;

    default:
      console.error(
        `Unsupported field type ${fieldType} was received for action: ${operation.path}. Field will be ignored.`
      );
      return null; // if field not found
  }
}
