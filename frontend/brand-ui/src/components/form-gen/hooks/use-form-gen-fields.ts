import {
  executeFieldIfStatement,
  isComputedField,
  isConcreteField,
  isConditionalField,
  isGroupField,
  isGroupFieldFunction,
  findFieldBy as utilFindFieldBy,
} from '@plentyag/brand-ui/src/components/form-gen/utils';
import useCoreStore from '@plentyag/core/src/core-store';
import { cloneDeep, get, times } from 'lodash';
import React from 'react';

interface useFormGenFieldsOptions {
  isUpdating?: boolean;
}

export interface UseFormGenFieldsReturn {
  fields: FormGen.FieldAny[];
  getInitialValuesWithDefaults: (fields: FormGen.FieldAny[], values: any) => any;
  serializer: {
    deserialize: (json: any) => {};
    serialize: (json: any) => {};
  };
  findFieldBy: <T extends FormGen.Field>(findByCriteria: Parameters<typeof utilFindFieldBy>[1]) => T;
  getConcreteFields: (
    fields: FormGen.FieldAny[],
    values: any
  ) => (FormGen.Field | FormGen.FieldGroupArray | FormGen.FieldGroupFunction)[];
  getConcreteFieldsInGroup: (
    field: FormGen.FieldGroupArray | FormGen.FieldGroupFunction,
    values: any,
    groupIndex: number
  ) => (FormGen.Field | FormGen.FieldGroupArray | FormGen.FieldGroupFunction)[];
}

export const useFormGenFields = (
  config: FormGen.Config,
  options: useFormGenFieldsOptions = {}
): UseFormGenFieldsReturn => {
  const [coreState] = useCoreStore();
  const { fields: anyFields } = config;

  /**
   * @returns whether a FormGen.Field is allowed.
   */
  const isFieldAllowed = React.useCallback(
    (field: FormGen.Field): boolean => {
      if (!field.permissions) {
        return true;
      }

      const permissionGroup = options.isUpdating ? 'update' : 'create';
      const permission = field.permissions[permissionGroup];

      return coreState.currentUser.hasPermission(permission.resource, permission.level);
    },
    [options.isUpdating, coreState.currentUser]
  );

  /**
   * Returns all concrete FormGen.Fields that are not a conditional or computed field and allowed.
   *
   * Iterates over an array of any FormGen fields.
   *
   * When a field is a conditional field, its conditional is executed  with the formik values.
   * When the conditional returns true, the nested field are added as part  of the concrete fields.
   * When the conditional returns false, it skips all the nested fields.
   *
   * When a field is a computed field, its computed function is executed with the formik values. The computed
   * function returns a collection of any FormGen fields and the process is repeated again.
   *
   * When a field is neither a conditional field or computed fields, it is directly added to the concrete fields.
   *
   * For any field added as a concrete field, ensure that the field is allowed, using the @see isFieldAllowed function.
   *
   * @see FormGen.Field
   * @see FormGen.FieldIf
   * @param values Formik Values
   * @return all the concrete fields corresponding to the current formik values
   */
  const getConcreteFields: UseFormGenFieldsReturn['getConcreteFields'] = React.useCallback((anyFields, values) => {
    const getConcreteFieldReducer = (accumulator, field: FormGen.FieldAny) => {
      if (isConditionalField(field)) {
        if (values && executeFieldIfStatement(field, values)) {
          accumulator.push(...field.fields.filter(isFieldAllowed));
        }
      } else if (isComputedField(field)) {
        field.computed(values).forEach(computedField => getConcreteFieldReducer(accumulator, computedField));
      } else if (isGroupField(field) || isFieldAllowed(field)) {
        accumulator.push(field);
      }

      return accumulator;
    };

    return anyFields.reduce(getConcreteFieldReducer, []);
  }, []);

  // @todo: this does not handle computed or conditional fields.
  const findFieldBy = React.useCallback(
    <T extends FormGen.Field>(findByCriteria: Parameters<typeof utilFindFieldBy>[1]): T => {
      return utilFindFieldBy(anyFields, findByCriteria);
    },
    [anyFields]
  );

  /**
   * Augment an initialValues object with defaults defined on FormGen.Fields.
   *
   * Iterates over FormGen fields, for each concrete fields, when a default is defined and the value is not already
   * present in initialValues, sets the default in the initialValues object.
   *
   * @param initialValues some initial values
   * @return initialValues with defaults defined on FormGen.Fields
   */
  const getInitialValuesWithDefaults: UseFormGenFieldsReturn['getInitialValuesWithDefaults'] = React.useCallback(
    (anyFields, initialValues = {}) => {
      const setFieldInitialValue = (accumulator: any, field: FormGen.Field): void => {
        if (accumulator[field.name] === undefined) {
          accumulator[field.name] = field.default;
        }
      };
      const getInitialValueReducer = (accumulator: any, anyField: FormGen.FieldAny): any => {
        if (isConditionalField(anyField)) {
          anyField.fields.forEach(nestedField => getInitialValueReducer(accumulator, nestedField));
        } else if (isComputedField(anyField)) {
          anyField.computed(initialValues).forEach(computedField => getInitialValueReducer(accumulator, computedField));
        } else if (isGroupField(anyField)) {
          const groupFieldAccumulator = get(accumulator, anyField.name);
          if (!groupFieldAccumulator || groupFieldAccumulator.length === 0) {
            // handle case where no initial values are provided for a group field
            const groupFieldAccumulator = {};
            const fieldsInGroups = isGroupFieldFunction(anyField) ? anyField.fields(0) : anyField.fields;

            fieldsInGroups.forEach(field => getInitialValueReducer(groupFieldAccumulator, field));

            if (isGroupFieldFunction(anyField)) {
              const min = Number.isInteger(anyField.min) && anyField.min >= 0 ? anyField.min : 1;
              accumulator[anyField.name] = times(min, () => cloneDeep(groupFieldAccumulator));
            } else {
              accumulator[anyField.name] = groupFieldAccumulator;
            }
          } else {
            // handle case where initial values are provided for a group field
            if (isGroupFieldFunction(anyField)) {
              groupFieldAccumulator.forEach((obj, index) => {
                anyField.fields(index).forEach(field => getInitialValueReducer(obj, field));
              });
            } else {
              anyField.fields.forEach(field => getInitialValueReducer(groupFieldAccumulator, field));
            }
            accumulator[anyField.name] = groupFieldAccumulator;
          }
        } else {
          setFieldInitialValue(accumulator, anyField);
        }

        return accumulator;
      };

      return anyFields.reduce<any>(getInitialValueReducer, initialValues);
    },
    []
  );

  /**
   * Similar to {@link getConcreteFields} but instead returns concrete fields for a group at a given index.
   */
  const getConcreteFieldsInGroup: UseFormGenFieldsReturn['getConcreteFieldsInGroup'] = React.useCallback(
    (parentField, values, groupIndex) => {
      const concreteFields = isGroupFieldFunction(parentField)
        ? getConcreteFields(parentField.fields(groupIndex), values)
        : getConcreteFields(parentField.fields, values);

      return concreteFields.map(field => ({
        ...field,
        name: `${parentField.name}${isGroupFieldFunction(parentField) ? `[${groupIndex}]` : ''}.${field.name}`,
      }));
    },
    [isConcreteField, getConcreteFields]
  );

  /**
   * Return a serialize/deserialize callbacks based on the FormGen.config.
   */
  const serializer = {
    serialize: React.useCallback(
      (values: any = {}) => {
        return config.serialize ? config.serialize(cloneDeep(values)) : values;
      },
      [config.serialize]
    ),
    deserialize: React.useCallback(
      (values: any = {}) => {
        return config.deserialize ? config.deserialize(cloneDeep(values)) : values;
      },
      [config.deserialize]
    ),
  };

  return {
    fields: anyFields,
    getInitialValuesWithDefaults,
    getConcreteFields,
    getConcreteFieldsInGroup,
    findFieldBy,
    serializer,
  };
};
