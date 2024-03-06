import {
  executeFieldIfStatement,
  isComputedField,
  isConcreteField,
  isConditionalField,
  isGroupField,
  isGroupFieldArray,
  isGroupFieldFunction,
  isValueLabel,
  isWhenObject,
  when,
} from '.';

const field1: FormGen.FieldIf = {
  if: values => values.fieldValue === 'on',
  fields: [],
};
const field2: FormGen.FieldIf = {
  type: 'if',
  if: values => values.fieldValue === 'on',
  fields: [],
};
const field3: FormGen.FieldIf = {
  if: when('fieldValue', fieldValue => fieldValue === 'on'),
  fields: [],
};
const field4: FormGen.FieldIf = {
  if: when(['fieldValue1', 'fieldValue2'], (fieldValue1, fieldValue2) => fieldValue1 === 'on' && fieldValue2 === 'on'),
  fields: [],
};
const fieldComputed: FormGen.FieldComputed = {
  computed: () => [],
};
const fieldGroupArray: FormGen.FieldGroupArray = {
  type: 'group',
  name: 'groupArray',
  fields: [],
};
const fieldGroupFunction: FormGen.FieldGroupFunction = {
  type: 'group',
  name: 'groupFunction',
  fields: () => [],
};

describe('isConditionalField', () => {
  it('returns true', () => {
    expect(isConditionalField(field1)).toBe(true);
    expect(isConditionalField(field2)).toBe(true);
    expect(isConditionalField(field3)).toBe(true);
    expect(isConditionalField(field4)).toBe(true);
  });

  it('returns false', () => {
    const field: FormGen.FieldAutocomplete = { type: 'Autocomplete', name: 'Autocomplete', options: [] };

    expect(isConditionalField(field)).toBe(false);
  });
});

describe('isComputedField', () => {
  it('returns true', () => {
    expect(isComputedField(fieldComputed)).toBe(true);
  });

  it('returns false', () => {
    expect(isComputedField(field4)).toBe(false);
  });
});

describe('isConcreteField', () => {
  it.each([field1, field2, field3, field4, fieldComputed, fieldGroupArray, fieldGroupFunction])(
    'returns false for %s',
    field => {
      expect(isConcreteField(field)).toBe(false);
    }
  );
});

describe('isGroupField', () => {
  it.each([field1, field2, field3, field4, fieldComputed])('returns false for %s', field => {
    expect(isGroupField(field)).toBe(false);
  });

  it('returns true', () => {
    expect(isGroupField(fieldGroupArray)).toBe(true);
    expect(isGroupField(fieldGroupFunction)).toBe(true);
  });
});

describe('isGroupFieldArray', () => {
  it.each([field1, field2, field3, field4, fieldComputed, fieldGroupFunction])('returns false for %s', field => {
    expect(isGroupFieldArray(field)).toBe(false);
  });

  it('returns true', () => {
    expect(isGroupFieldArray(fieldGroupArray)).toBe(true);
  });
});

describe('isGroupFieldFunction', () => {
  it.each([field1, field2, field3, field4, fieldComputed, fieldGroupArray])('returns false for %s', field => {
    expect(isGroupFieldFunction(field)).toBe(false);
  });

  it('returns true', () => {
    expect(isGroupFieldFunction(fieldGroupFunction)).toBe(true);
  });
});

describe('executeFieldIfStatement', () => {
  it('returns true', () => {
    expect(executeFieldIfStatement(field1, { fieldValue: 'on' })).toBe(true);
    expect(executeFieldIfStatement(field2, { fieldValue: 'on' })).toBe(true);
    expect(executeFieldIfStatement(field3, { fieldValue: 'on' })).toBe(true);
    expect(executeFieldIfStatement(field4, { fieldValue1: 'on', fieldValue2: 'on' })).toBe(true);
  });

  it('returns false', () => {
    expect(executeFieldIfStatement(field1, {})).toBe(false);
    expect(executeFieldIfStatement(field2, {})).toBe(false);
    expect(executeFieldIfStatement(field3, {})).toBe(false);
    expect(executeFieldIfStatement(field4, {})).toBe(false);
  });
});

describe('isWhenObject', () => {
  it('returns true', () => {
    expect(isWhenObject(field3.if)).toBe(true);
    expect(isWhenObject(field4.if)).toBe(true);
  });

  it('returns false', () => {
    expect(isWhenObject(field1.if)).toBe(false);
    expect(isWhenObject(field2.if)).toBe(false);
  });
});

describe('isValueLabel', () => {
  it('returns true', () => {
    expect(isValueLabel({ value: undefined, label: 'label1' })).toBe(true);
    expect(isValueLabel({ value: null, label: 'label2' })).toBe(true);
    expect(isValueLabel({ value: 0, label: 'label3' })).toBe(true);
    expect(isValueLabel({ value: '', label: 'label4' })).toBe(true);
    expect(isValueLabel({ value: 'value', label: 'label4' })).toBe(true);
  });

  it('returns false', () => {
    expect(isValueLabel('test')).toBe(false);
  });
});
