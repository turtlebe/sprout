import { when } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { renderHook } from '@testing-library/react-hooks';
import * as yup from 'yup';

import { useValidationSchema } from './use-validation-schema';

import '@plentyag/core/src/yup/extension';

const options = { abortEarly: false };
const formGenFields: FormGen.FieldAny[] = [
  {
    type: 'TextField',
    name: 'textFieldWithLabel',
    label: 'Label for TextField',
    validate: yup.string().required(),
  },
  {
    type: 'TextField',
    name: 'textFieldWithoutLabel',
    validate: yup.string().required(),
  },
  {
    if: values => values.textFieldWithLabel === 'toggleFieldIfs',
    fields: [
      {
        type: 'group',
        name: 'testRepeat',
        fields: () => [
          { type: 'TextField', name: 'repeat-text-field', validate: yup.string().matches(/hello/).required() },
        ],
      },
      {
        type: 'TextField',
        name: 'nestedTextField',
        validate: yup.string().required(),
      },
    ],
  },
  {
    if: when('textFieldWithLabel', textFieldWithLabel => textFieldWithLabel === 'toggleFieldIfs'),
    fields: [
      {
        type: 'TextField',
        name: 'nestedTextFieldWithWhenFormat',
        validate: yup.string().required(),
      },
    ],
  },
  {
    type: 'TextField',
    name: 'optionalTextField',
  },
  {
    computed: () => [
      {
        type: 'TextField',
        name: 'computedTextFieldWithLabel',
        label: 'Label for Computed TextField',
        validate: yup.string().required(),
      },
      {
        if: values => values.textFieldWithLabel === 'toggleFieldIfs',
        fields: [
          {
            type: 'TextField',
            name: 'computedNestedTextField',
            validate: yup.string().required(),
          },
        ],
      },
    ],
  },
];

describe('useValidationSchema', () => {
  it('returns a validation schema for the top-level FormGen.Fields and the nested ones under a FieldIf', () => {
    const { result } = renderHook(() => useValidationSchema(formGenFields));

    expect(Object.keys(result.current.fields)).toEqual([
      'textFieldWithLabel',
      'textFieldWithoutLabel',
      'testRepeat',
      'nestedTextField',
      'nestedTextFieldWithWhenFormat',
      'optionalTextField',
      'computedTextFieldWithLabel',
      'computedNestedTextField',
    ]);
    expect(result.current.fields['textFieldWithLabel'].tests).toHaveLength(1);
    expect(result.current.fields['textFieldWithoutLabel'].tests).toHaveLength(1);

    // if-field supports nested "repeat"
    var arSchema = result.current.fields['testRepeat'];
    expect(() =>
      arSchema.validateSync([{ 'repeat-text-field': 'hello' }, { 'repeat-text-field': 'hello' }])
    ).not.toThrow();
    expect(() => arSchema.validateSync([{ 'repeat-text-field': 'bye' }, { 'repeat-text-field': 'hello' }])).toThrow();

    expect(result.current.fields['nestedTextField'].tests).toHaveLength(1);
    expect(result.current.fields['nestedTextFieldWithWhenFormat'].tests).toHaveLength(0);
    expect(result.current.fields['optionalTextField'].tests).toHaveLength(0);
    expect(result.current.fields['computedTextFieldWithLabel'].tests).toHaveLength(1);
    expect(result.current.fields['computedNestedTextField'].tests).toHaveLength(1);
  });

  it('uses the label in the error', () => {
    const textField = formGenFields[0] as FormGen.FieldTextField;
    const { result } = renderHook(() => useValidationSchema([textField]));

    try {
      result.current.validateSync({});
      fail();
    } catch (errors) {
      expect(errors.message).toBe(`${textField.label} is a required field`);
    }
  });

  it('uses the name in the error when label is not specified', () => {
    const textField = formGenFields[1] as FormGen.FieldTextField;

    const { result } = renderHook(() => useValidationSchema([textField]));

    try {
      result.current.validateSync({});
      fail();
    } catch (errors) {
      // we only get one error because one FieldIf is using the if: () => {} syntax as opposed to a `when` callback
      expect(errors.message).toBe(`${textField.name} is a required field`);
    }
  });

  it('does not take in account the if statement of the parent to validate a nested field', () => {
    const { result } = renderHook(() => useValidationSchema(formGenFields));

    try {
      result.current.validateSync({}, options);
      fail();
    } catch (errors) {
      const fieldsWithErrors = errors.inner.map(validationError => validationError.path);
      expect(fieldsWithErrors).toContain('nestedTextField');
      // this validation was gated by the `when` callback in the FieldIf parent
      expect(fieldsWithErrors).not.toContain('nestedTextFieldWithWhenFormat');
    }
  });

  it('takes in account the if statement of the parent to validate a nested field', () => {
    const { result } = renderHook(() => useValidationSchema(formGenFields));

    try {
      result.current.validateSync({ textFieldWithLabel: 'toggleFieldIfs' }, options);
      fail();
    } catch (errors) {
      const fieldsWithErrors = errors.inner.map(validationError => validationError.path);
      expect(fieldsWithErrors).toContain('nestedTextField');
      expect(fieldsWithErrors).toContain('nestedTextFieldWithWhenFormat');
    }
  });

  it('dynamically re-calculate the schema when formik value changes', () => {
    const formGenFields: FormGen.FieldAny[] = [
      {
        computed: values => {
          if (!values.withComputedField) {
            return [];
          }
          return [{ type: 'TextField', name: 'textField', validate: yup.string().required() }];
        },
      },
    ];
    const { result, rerender } = renderHook(
      ({ formGenFields, formikValues }) => useValidationSchema(formGenFields, formikValues),
      { initialProps: { formGenFields, formikValues: {} } }
    );

    expect(result.current.fields).not.toHaveProperty('textField');

    rerender({ formGenFields, formikValues: { withComputedField: true } });

    expect(result.current.fields).toHaveProperty('textField');
    expect(result.current.fields['textField'].tests).toHaveLength(1);
  });

  it('dynamically re-calcualtes the schema when the formik fields change', () => {
    const formGenFields: FormGen.FieldAny[] = [
      {
        type: 'TextField',
        name: 'textFieldWithLabel',
        label: 'Label for TextField',
        validate: yup.string().required(),
      },
    ];

    const { result, rerender } = renderHook(
      ({ formGenFields, formikValues }) => useValidationSchema(formGenFields, formikValues),
      { initialProps: { formGenFields, formikValues: {} } }
    );

    expect(result.current.fields).toHaveProperty('textFieldWithLabel');
    expect(result.current.fields['textFieldWithLabel'].tests).toHaveLength(1);

    const newFormGenFields: FormGen.FieldAny[] = [
      ...formGenFields,
      {
        type: 'TextField',
        name: 'textFieldWithoutLabel',
        validate: yup.string().required(),
      },
    ];

    rerender({ formGenFields: newFormGenFields, formikValues: {} });

    expect(result.current.fields).toHaveProperty('textFieldWithLabel');
    expect(result.current.fields['textFieldWithLabel'].tests).toHaveLength(1);
    expect(result.current.fields).toHaveProperty('textFieldWithoutLabel');
    expect(result.current.fields['textFieldWithoutLabel'].tests).toHaveLength(1);
  });

  it('supports computed field for nested yup validation', () => {
    const textFieldMeasurementTypes: FormGen.ValueLabel[] = [
      { label: 'filmSealAlignmentMarginRight', value: 'Right' },
      { label: 'filmSealAlignmentMarginLeft', value: 'Left' },
    ];
    const formGenFields: FormGen.FieldAny[] = [
      {
        computed: values => [
          {
            type: 'AutocompleteFarmDefSku',
            label: 'Sku',
            name: 'sku',
            validate: yup.mixed().required(),
            farmPath: values?.site,
            isPackableAnywhere: false,
            valueSelector: null,
            autocompleteProps: { disableClearable: true },
          },
        ],
      },
      {
        if: when(['sku'], sku => sku?.skuTypeName === 'CASE_6_CLAMSHELL_4o5OZ'),
        fields: [
          {
            type: 'TextFieldGrid',
            name: 'filmSealAlignment',
            label: 'Film Seal Alignment (mm)',
            columns: ['#1', '#2', '#3'],
            rows: textFieldMeasurementTypes,
            textFieldProps: { type: 'number', placeholder: '00.0' },
            tabbing: 'vertical',
            validate: yup
              .mixed()
              .required()
              .validateTextFieldGridValues({
                keys: textFieldMeasurementTypes.map(type => type.value),
                length: 3,
              }),
          },
        ],
      },
    ];

    const { result } = renderHook(() => useValidationSchema(formGenFields));

    expect(() => result.current.validateSync({ sku: {} }, options)).not.toThrowError();
    expect(() =>
      result.current.validateSync({ sku: { skuTypeName: 'CASE_6_CLAMSHELL_4o5OZ' } }, options)
    ).toThrowError();
  });

  it('supports two nested fields with the same name when nested under two conditions', () => {
    const formGenFields: FormGen.FieldAny[] = [
      { type: 'TextField', name: 'site', validate: yup.string().required() },
      {
        if: when('site', site => site === 'TAURUS'),
        fields: [
          {
            type: 'TextField',
            name: 'seedlingCount',
            validate: yup.number().required().integer().min(1),
            textFieldProps: { type: 'number' },
          },
        ],
      },
      {
        if: when('site', site => site === 'TIGRIS'),
        fields: [
          {
            type: 'TextField',
            name: 'seedlingCount',
            validate: yup.number().required().integer().min(5),
            textFieldProps: { type: 'number' },
          },
        ],
      },
    ];

    const { result } = renderHook(() => useValidationSchema(formGenFields));

    expect(() => result.current.validateSync({ site: 'TAURUS' }, options)).toThrowError();
    expect(() => result.current.validateSync({ site: 'TAURUS', seedlingCount: 1 }, options)).not.toThrowError();
    expect(() => result.current.validateSync({ site: 'TAURUS', seedlingCount: 0 }, options)).toThrowError();

    expect(() => result.current.validateSync({ site: 'TIGRIS' }, options)).toThrowError();
    expect(() => result.current.validateSync({ site: 'TIGRIS', seedlingCount: 1 }, options)).toThrowError();
    expect(() => result.current.validateSync({ site: 'TIGRIS', seedlingCount: 5 }, options)).not.toThrowError();
  });

  it('supports validation for FieldGroupArray field', () => {
    const { result } = renderHook(() =>
      useValidationSchema([
        {
          type: 'group',
          name: 'a',
          fields: [{ type: 'TextField', name: 'b', validate: yup.string().required() }],
        },
      ])
    );

    expect(() => result.current.validateSync({})).toThrowError();
    expect(() => result.current.validateSync({ a: { b: '1' } })).not.toThrowError();
  });

  it('supports validation for FieldGroupFunction field', () => {
    const { result } = renderHook(() =>
      useValidationSchema([
        {
          type: 'group',
          name: 'a',
          fields: () => [{ type: 'TextField', name: 'b', validate: yup.string().required() }],
        },
      ])
    );

    expect(() => result.current.validateSync({ a: [{ b: undefined }] })).toThrowError();
    expect(() => result.current.validateSync({ a: [{ b: '1' }] })).not.toThrowError();
    expect(() => result.current.validateSync({ a: [{ b: undefined }, { b: undefined }] })).toThrowError();
    expect(() => result.current.validateSync({ a: [{ b: '1' }, { b: '2' }] })).not.toThrowError();
  });
});
