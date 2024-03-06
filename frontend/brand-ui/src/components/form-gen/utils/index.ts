import { at } from 'lodash';

export const isConditionalField = (field: FormGen.FieldAny): field is FormGen.FieldIf => {
  const castField = field as FormGen.FieldIf;
  return castField && Boolean(castField.if) && Array.isArray(castField.fields);
};

export const isGroupField = (
  field: FormGen.FieldAny
): field is FormGen.FieldGroupArray | FormGen.FieldGroupFunction => {
  return (
    field &&
    field.type === 'group' &&
    field.hasOwnProperty('fields') &&
    ['function', 'object'].includes(typeof field['fields'])
  );
};

export const isGroupFieldArray = (field: FormGen.FieldAny): field is FormGen.FieldGroupArray => {
  return field && field.type === 'group' && field.hasOwnProperty('fields') && typeof field['fields'] === 'object';
};

export const isGroupFieldFunction = (field: FormGen.FieldAny): field is FormGen.FieldGroupFunction => {
  return field && field.type === 'group' && field.hasOwnProperty('fields') && typeof field['fields'] === 'function';
};

export const isComputedField = (field: FormGen.FieldAny): field is FormGen.FieldComputed => {
  const castField = field as FormGen.FieldComputed;
  return castField && Boolean(castField.computed) && typeof castField.computed === 'function';
};

export const isConcreteField = (field: FormGen.FieldAny): field is FormGen.Field => {
  return (
    field &&
    field.hasOwnProperty('name') &&
    !isConditionalField(field) &&
    !isComputedField(field) &&
    !isGroupField(field)
  );
};

export const isIfFunction = (ifAttribute: FormGen.FieldIf['if']): ifAttribute is FormGen.IfFunction => {
  return typeof ifAttribute === 'function';
};

export const isWhenObject = (ifAttribute: FormGen.FieldIf['if']): ifAttribute is FormGen.WhenObject => {
  return typeof ifAttribute === 'object';
};

export const isValueLabel = (field: string | FormGen.ValueLabel): field is FormGen.ValueLabel => {
  return field.hasOwnProperty('value') && field.hasOwnProperty('label');
};

export const when = (keys: string[] | string, callback: FormGen.WhenObject['callback']): FormGen.WhenObject => {
  return {
    keys: Array.isArray(keys) ? keys : [keys],
    callback,
  };
};

export const isFieldGridDefinition = (field): field is FormGen.FieldGridDefinition => {
  return ['TextFieldGrid', 'CheckboxGrid'].includes(field.type);
};

export const executeFieldIfStatement = (fieldIf: FormGen.FieldIf, values: any): boolean => {
  if (isWhenObject(fieldIf.if)) {
    const { keys, callback } = fieldIf.if;
    return callback(...at(values, keys));
  } else {
    return fieldIf.if(values);
  }
};

/**
 * Fetch a a concrete FormGen.Field in FormGen.FieldAny[] for the given criterias.
 *
 * This cannot return a computed or conditional FormGen field. (e.g FormGen.FieldIf, FormGen.FieldComputed).
 *
 * @param formGenFields Array of FormGen.FieldAny -> FormGen.Field | FormGen.FieldIf | FormGen.FieldComputed.
 * @param findByCriteria Critiera that the FormGen.Field should match.
 */
export const findFieldBy = <T extends FormGen.Field>(
  formGenFields: FormGen.FieldAny[],
  findByCriteria: { [key in keyof FormGen.FieldDefinition]: any } | { type: string }
): T => {
  const isFieldMatching = (field: FormGen.Field): field is T =>
    Object.keys(findByCriteria).every(key => field && field[key] === findByCriteria[key]);

  const matchingField = formGenFields.find(field => {
    if (isConditionalField(field)) {
      return field.fields.find(isFieldMatching);
    } else if (!isComputedField(field) && !isGroupField(field)) {
      return isFieldMatching(field);
    }
  });

  if (!matchingField) {
    return undefined;
  }

  if (isConditionalField(matchingField)) {
    return matchingField.fields.find(isFieldMatching);
  } else if (!isComputedField(matchingField) && !isGroupField(matchingField) && isFieldMatching(matchingField)) {
    return matchingField;
  }
};

export const replaceWithContextAttribute = (string: string, context): string => {
  if (!context) {
    return string;
  }

  let computedString = string;
  Object.keys(context).forEach(key => {
    computedString = computedString.replace(new RegExp(`:context:${key}`, 'g'), context[key]);
  });

  return computedString;
};
