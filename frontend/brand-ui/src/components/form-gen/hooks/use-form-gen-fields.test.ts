import {
  isComputedField,
  isConditionalField,
  isGroupField,
  when,
} from '@plentyag/brand-ui/src/components/form-gen/utils';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { renderHook } from '@testing-library/react-hooks';
import { flatMap } from 'lodash';

import { useFormGenFields } from './use-form-gen-fields';

mockCurrentUser();

const getAllFormGenFieldNames = (fields: FormGen.FieldAny[]): string[] => {
  const mapFieldAnyToConcreteField = (field: FormGen.FieldAny): (FormGen.Field | FormGen.FieldGroup)[] => {
    if (isConditionalField(field)) {
      return field.fields;
    } else if (isComputedField(field)) {
      const fields = field.computed({});
      return flatMap(fields, mapFieldAnyToConcreteField);
    } else if (isGroupField(field)) {
      // do nothing
    } else {
      return [field];
    }
  };
  return flatMap(fields, mapFieldAnyToConcreteField).map(field => field.name);
};

const formGenConfig = (fields: FormGen.FieldAny[]): FormGen.Config => {
  return { fields };
};

describe('useFormGenField', () => {
  describe('isFieldAllowed', () => {
    const formGenFields: FormGen.FieldAny[] = [
      {
        type: 'TextField',
        name: 'allowedTextField',
        label: 'Allowed Field',
      },
      {
        type: 'TextField',
        name: 'restrictedTextField',
        label: 'Restricted Field',
        permissions: {
          create: {
            resource: Resources.HYP_SENSORY,
            level: PermissionLevels.FULL,
          },
          update: {
            resource: Resources.HYP_PERCEPTION,
            level: PermissionLevels.FULL,
          },
        },
      },
      {
        if: ({ restrictedTextField }) => restrictedTextField === 'on',
        fields: [
          {
            type: 'TextField',
            name: 'nestedAllowedField',
            label: 'Nested Allowed Field',
          },
          {
            type: 'TextField',
            name: 'nestedRestrictedTextField',
            label: 'Nested Restricted Field',
            permissions: {
              create: {
                resource: Resources.HYP_SENSORY,
                level: PermissionLevels.FULL,
              },
              update: {
                resource: Resources.HYP_PERCEPTION,
                level: PermissionLevels.FULL,
              },
            },
          },
        ],
      },
      {
        computed: () => [
          {
            type: 'TextField',
            name: 'computedAllowedTextField',
            label: 'Computed Allowed Field',
          },
          {
            type: 'TextField',
            name: 'computedRestrictedTextField',
            label: 'Computed Restricted Field',
            permissions: {
              create: {
                resource: Resources.HYP_SENSORY,
                level: PermissionLevels.FULL,
              },
              update: {
                resource: Resources.HYP_PERCEPTION,
                level: PermissionLevels.FULL,
              },
            },
          },
          {
            if: ({ restrictedTextField }) => restrictedTextField === 'on',
            fields: [
              {
                type: 'TextField',
                name: 'computedNestedAllowedField',
                label: 'Computed Nested Allowed Field',
              },
              {
                type: 'TextField',
                name: 'computedNestedRestrictedTextField',
                label: 'Computed Nested Restricted Field',
                permissions: {
                  create: {
                    resource: Resources.HYP_SENSORY,
                    level: PermissionLevels.FULL,
                  },
                  update: {
                    resource: Resources.HYP_PERCEPTION,
                    level: PermissionLevels.FULL,
                  },
                },
              },
            ],
          },
        ],
      },
    ];

    it('returns fields matching the current users permissions', () => {
      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields)));
      const allowedFieldNames = getAllFormGenFieldNames(
        result.current.getConcreteFields(formGenFields, { restrictedTextField: 'on' })
      );

      expect(allowedFieldNames).toContain('allowedTextField');
      expect(allowedFieldNames).toContain('nestedAllowedField');
      expect(allowedFieldNames).toContain('computedAllowedTextField');
      expect(allowedFieldNames).toContain('computedNestedAllowedField');
      expect(allowedFieldNames).not.toContain('restrictedTextField');
      expect(allowedFieldNames).not.toContain('nestedRestrictedTextField');
      expect(allowedFieldNames).not.toContain('computedRestrictedTextField');
      expect(allowedFieldNames).not.toContain('computedNestedRestrictedTextField');
    });

    it('returns fields matching the current users permissions in create mode', () => {
      mockCurrentUser({ permissions: { HYP_SENSORY: 'FULL' } });

      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields)));
      const allowedFieldNames = getAllFormGenFieldNames(
        result.current.getConcreteFields(formGenFields, { restrictedTextField: 'on' })
      );

      expect(allowedFieldNames).toContain('allowedTextField');
      expect(allowedFieldNames).toContain('nestedAllowedField');
      expect(allowedFieldNames).toContain('computedAllowedTextField');
      expect(allowedFieldNames).toContain('computedNestedAllowedField');
      expect(allowedFieldNames).toContain('restrictedTextField');
      expect(allowedFieldNames).toContain('nestedRestrictedTextField');
      expect(allowedFieldNames).toContain('computedRestrictedTextField');
      expect(allowedFieldNames).toContain('computedNestedRestrictedTextField');
    });

    it('returns fields matching the current users permissions in update mode', () => {
      mockCurrentUser({ permissions: { HYP_PERCEPTION: 'FULL' } });

      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields), { isUpdating: true }));
      const allowedFieldNames = getAllFormGenFieldNames(
        result.current.getConcreteFields(formGenFields, { restrictedTextField: 'on' })
      );

      expect(allowedFieldNames).toContain('allowedTextField');
      expect(allowedFieldNames).toContain('nestedAllowedField');
      expect(allowedFieldNames).toContain('computedAllowedTextField');
      expect(allowedFieldNames).toContain('computedNestedAllowedField');
      expect(allowedFieldNames).toContain('restrictedTextField');
      expect(allowedFieldNames).toContain('nestedRestrictedTextField');
      expect(allowedFieldNames).toContain('computedRestrictedTextField');
      expect(allowedFieldNames).toContain('computedNestedRestrictedTextField');
    });
  });

  describe('getConcreteFields', () => {
    const formGenFields: FormGen.FieldAny[] = [
      {
        type: 'TextField',
        name: 'textField1',
        label: 'textField1',
      },
      {
        if: values => values.textField1 === 'enabled',
        fields: [
          {
            type: 'TextField',
            name: 'textField2',
            label: 'textField2',
          },
        ],
      },
      {
        if: when('textField1', textField1 => textField1 === 'enabled'),
        fields: [
          {
            type: 'TextField',
            name: 'textField3',
            label: 'textField3',
          },
        ],
      },
      { type: 'DatePicker', name: 'datePicker', label: 'datePicker' },
      {
        computed: () => [
          {
            if: when('textField1', textField1 => textField1 === 'enabled'),
            fields: [{ type: 'DatePicker', name: 'datePicker2', label: 'datePicker2' }],
          },
          { type: 'DatePicker', name: 'datePicker3', label: 'datePicker3' },
        ],
      },
      {
        type: 'group',
        name: 'group1',
        fields: [{ type: 'TextField', name: 'textFieldInGroup1', label: 'textFieldInGroup1' }],
      },
      {
        type: 'group',
        name: 'group1',
        fields: () => [{ type: 'TextField', name: 'textFieldInGroup1', label: 'textFieldInGroup1' }],
      },
    ];

    it('returns the FormGen fields without FormGen.FieldIf or FormGen.FieldComputed', () => {
      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields)));

      expect(result.current.fields).toEqual(formGenFields);
      expect(result.current.getConcreteFields).toBeDefined();

      const fields1 = result.current.getConcreteFields(formGenFields, {});
      expect(fields1).toHaveLength(5);
      expect(fields1[0]).toEqual(formGenFields[0]);
      expect(fields1[1]).toEqual(formGenFields[3]);
      expect(fields1[2]).toEqual((formGenFields[4] as FormGen.FieldComputed).computed({})[1]);
      expect(fields1[3]).toEqual(formGenFields[5]);
      expect(fields1[4]).toEqual(formGenFields[6]);

      const fields2 = result.current.getConcreteFields(formGenFields, { textField1: 'something' });
      expect(fields2).toEqual(fields1);

      const fields3 = result.current.getConcreteFields(formGenFields, { textField1: 'enabled' });
      expect(fields3).not.toEqual(fields1);
      expect(fields3).toHaveLength(8);
      expect(fields3[0]).toEqual(formGenFields[0]);
      expect(fields3[1]).toEqual((formGenFields[1] as FormGen.FieldIf).fields[0]);
      expect(fields3[2]).toEqual((formGenFields[2] as FormGen.FieldIf).fields[0]);
      expect(fields3[3]).toEqual(formGenFields[3]);
      expect(fields3[4]).toEqual(
        ((formGenFields[4] as FormGen.FieldComputed).computed({})[0] as FormGen.FieldIf).fields[0]
      );
      expect(fields3[5]).toEqual((formGenFields[4] as FormGen.FieldComputed).computed({})[1]);
      expect(fields3[6]).toEqual(formGenFields[5]);
      expect(fields3[7]).toEqual(formGenFields[6]);
    });
  });

  describe('findFielddBy', () => {
    it('finds a formGenField by its type', () => {
      const formGenFields: FormGen.FieldAny[] = [
        {
          type: 'TextField',
          name: 'textField1',
          label: 'textField1',
        },
        {
          if: values => values.textField1 === 'enabled',
          fields: [
            {
              type: 'TextField',
              name: 'textField2',
              label: 'textField2',
            },
          ],
        },
        {
          if: when('textField1', textField1 => textField1 === 'enabled'),
          fields: [
            {
              type: 'TextField',
              name: 'textField3',
              label: 'textField3',
            },
          ],
        },
        { type: 'DatePicker', name: 'datePicker', label: 'datePicker' },
      ];

      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields)));

      expect(result.current.findFieldBy<FormGen.FieldTextField>({ name: 'textField1' })).toEqual(formGenFields[0]);
      expect(result.current.findFieldBy<FormGen.FieldTextField>({ type: 'TextField' })).toEqual(formGenFields[0]);
      expect(result.current.findFieldBy<FormGen.FieldTextField>({ type: 'TextField', name: 'textField3' })).toEqual(
        (formGenFields[2] as FormGen.FieldIf).fields[0]
      );
      expect(result.current.findFieldBy<FormGen.FieldDatePicker>({ type: 'DatePicker' })).toEqual(formGenFields[3]);
      expect(result.current.findFieldBy<undefined>({ name: 'unknown' })).toBeUndefined();
    });
  });

  describe('getInitialValuesWithDefaults', () => {
    const formGenFields: FormGen.FieldAny[] = [
      {
        type: 'TextField',
        name: 'withDefaultValue',
        default: 'default-value',
      },
      {
        type: 'TextField',
        name: 'withoutDefaultValue',
      },
      {
        if: values => values.withDefaultValue === true,
        fields: [
          {
            type: 'group',
            name: 'repeat-test',
            fields: [{ type: 'TextField', name: 'repeat-text-field', default: 'repeat-default' }],
          },
          {
            type: 'TextField',
            name: 'nestedWithDefaultValue',
            default: 'nested-default-value',
          },
          {
            type: 'TextField',
            name: 'nestedWithoutDefaultValue',
          },
        ],
      },
      {
        computed: () => [
          {
            if: when('withDefaultValue', withDefaultValue => withDefaultValue === true),
            fields: [
              { type: 'TextField', name: 'computedNestedWithDefaultValue', default: 'computed-nested-default-value' },
              { type: 'TextField', name: 'computedNestedWithoutDefaultValue' },
            ],
          },
          { type: 'TextField', name: 'computedWithDefaultValue', default: 'computed-default-value' },
          { type: 'TextField', name: 'computedWithoutDefaultValue' },
        ],
      },
      {
        type: 'group',
        name: 'groupArray',
        fields: [
          {
            type: 'TextField',
            name: 'withDefaultValue',
            default: 'default-value',
          },
          {
            type: 'TextField',
            name: 'withoutDefaultValue',
          },
        ],
      },
      {
        type: 'group',
        name: 'groupFunction',
        fields: () => [
          {
            type: 'TextField',
            name: 'withDefaultValue',
            default: 'default-value',
          },
          {
            type: 'TextField',
            name: 'withoutDefaultValue',
          },
        ],
      },
    ];

    it('returns default values', () => {
      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields)));
      const fields = result.current.getConcreteFields(formGenFields, { withDefaultValue: true });
      const initialValues = result.current.getInitialValuesWithDefaults(formGenFields, {});

      expect(initialValues[fields[0].name]).toBe('default-value');
      expect(initialValues[fields[1].name]).toBeUndefined();
      expect(initialValues[fields[2].name]).toEqual({ 'repeat-text-field': 'repeat-default' });
      expect(initialValues[fields[3].name]).toBe('nested-default-value');
      expect(initialValues[fields[4].name]).toBeUndefined();
      expect(initialValues[fields[5].name]).toBe('computed-nested-default-value');
      expect(initialValues[fields[6].name]).toBeUndefined();
      expect(initialValues[fields[7].name]).toBe('computed-default-value');
      expect(initialValues[fields[8].name]).toBeUndefined();
      expect(initialValues.groupArray.withDefaultValue).toBe('default-value');
      expect(initialValues.groupArray.withoutDefaultValue).toBeUndefined();
      expect(initialValues.groupFunction[0].withDefaultValue).toBe('default-value');
      expect(initialValues.groupFunction[0].withoutDefaultValue).toBeUndefined();
    });

    it('overrides default values with initial values ', () => {
      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields)));
      const fields = result.current.getConcreteFields(formGenFields, { withDefaultValue: true });
      const initialValues = result.current.getInitialValuesWithDefaults(formGenFields, {
        [fields[0].name]: 'mock-value-0',
        [fields[1].name]: 'mock-value-1',
        [fields[2].name]: { 'repeat-text-field': 'repeat-default2' },
        [fields[3].name]: 'mock-value-2',
        [fields[4].name]: 'mock-value-3',
        [fields[5].name]: 'mock-value-4',
        [fields[6].name]: 'mock-value-5',
        [fields[7].name]: 'mock-value-6',
        [fields[8].name]: 'mock-value-7',
        groupArray: { withDefaultValue: 'mock-value-8', withoutDefaultValue: 'mock-value-9' },
        groupFunction: [
          { withDefaultValue: 'mock-value-10', withoutDefaultValue: 'mock-value-11' },
          { withDefaultValue: 'mock-value-12', withoutDefaultValue: 'mock-value-13' },
        ],
      });

      expect(initialValues[fields[0].name]).toBe('mock-value-0');
      expect(initialValues[fields[1].name]).toBe('mock-value-1');
      expect(initialValues[fields[2].name]).toEqual({ 'repeat-text-field': 'repeat-default2' });
      expect(initialValues[fields[3].name]).toBe('mock-value-2');
      expect(initialValues[fields[4].name]).toBe('mock-value-3');
      expect(initialValues[fields[5].name]).toBe('mock-value-4');
      expect(initialValues[fields[6].name]).toBe('mock-value-5');
      expect(initialValues[fields[7].name]).toBe('mock-value-6');
      expect(initialValues[fields[8].name]).toBe('mock-value-7');
      expect(initialValues.groupArray.withDefaultValue).toBe('mock-value-8');
      expect(initialValues.groupArray.withoutDefaultValue).toBe('mock-value-9');
      expect(initialValues.groupFunction[0].withDefaultValue).toBe('mock-value-10');
      expect(initialValues.groupFunction[0].withoutDefaultValue).toBe('mock-value-11');
      expect(initialValues.groupFunction[1].withDefaultValue).toBe('mock-value-12');
      expect(initialValues.groupFunction[1].withoutDefaultValue).toBe('mock-value-13');
    });

    it('creates minimum number of fields for "repeat" field', () => {
      const formGenFields: FormGen.FieldAny[] = [
        {
          type: 'group',
          name: 'repeat-test',
          min: 3,
          fields: () => [{ type: 'TextField', name: 'repeat-text-field', default: 'repeat-default' }],
        },
      ];
      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields)));
      const initialValues = result.current.getInitialValuesWithDefaults(formGenFields, {});

      const repeatArInitialValues = initialValues['repeat-test'];
      expect(repeatArInitialValues).toHaveLength(3);
      repeatArInitialValues.forEach(value => expect(value).toEqual({ 'repeat-text-field': 'repeat-default' }));
    });

    it('handles initialization for computed fields', () => {
      // this test ensures computed fields are initially called with the "values", previously
      // computed fields was just called with empty object, so it was not possible to set
      // default values for a field from the initial values.

      const formGenFields: FormGen.FieldAny[] = [
        {
          computed: values => [{ type: 'TextField', name: 'field1', default: values['field1'] }],
        },
      ];

      const { result } = renderHook(() => useFormGenFields(formGenConfig(formGenFields)));

      // the computed field, should be initialized with these "values"
      const initialValues = {
        field1: 'xyz',
      };
      const initialValuesWithDefaults = result.current.getInitialValuesWithDefaults(formGenFields, initialValues);

      expect(initialValuesWithDefaults).toEqual(initialValues);
    });
  });
});
