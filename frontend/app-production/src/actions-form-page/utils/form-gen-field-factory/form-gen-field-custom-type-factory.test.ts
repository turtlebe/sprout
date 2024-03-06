import '@plentyag/core/src/yup/extension';

import { mockFarmStateContainer } from '@plentyag/app-production/src/common/test-helpers';
import { FarmStateContainer } from '@plentyag/app-production/src/common/types/farm-state';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { Settings } from 'luxon';

import { formGenFieldCustomTypeFactory } from './form-gen-field-custom-type-factory';

const currentFarmPath = 'sites/SSF2/farms/Tigris';

describe('formGenFieldCustomTypeFactory', () => {
  describe('error cases', () => {
    function checkErrorCase(field: ProdActions.NestedField) {
      const mockOperation = {
        path: 'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing/machines/ToteFiller/interfaces/ToteFiller/methods/ToteFilled',
        prefilledArgs: {},
      };
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const formGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(formGenField).toBeNull();
      expect(consoleError).toHaveBeenCalled();
    }

    it('returns null when typeName not present', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Crop',
        name: 'crop',
        type: 'TYPE_MESSAGE',
        typeName: '',
        fields: [],
      };
      checkErrorCase(field);
    });

    it('returns null when fields array is empty', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Crop',
        name: 'crop',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.Cultivar',
        fields: [],
      };
      checkErrorCase(field);
    });

    it('returns null when field array has more than one value', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Crop',
        name: 'crop',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.Cultivar',
        fields: [
          { name: 'value1', displayName: 'value2', type: 'TYPE_STRING' },
          { name: 'value2', displayName: 'value2', type: 'TYPE_STRING' },
        ],
      };
      checkErrorCase(field);
    });

    it('returns null when typeName not provided', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Crop',
        name: 'crop',
        type: 'TYPE_MESSAGE',
        typeName: '',
        fields: [],
      };
      checkErrorCase(field);
    });

    it('returns null for unsupported custom type', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Crop',
        name: 'crop',
        type: 'TYPE_MESSAGE',
        typeName: 'some-unknown-typeName',
        fields: [],
      };
      checkErrorCase(field);
    });

    it('returns null when nested field type is not a fundamental type', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Crop',
        name: 'crop',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.Cultivar',
        fields: [
          {
            type: 'TYPE_MESSAGE', // not a fundamental type
            typeName: '',
            displayName: 'test',
            name: 'test',
            fields: [],
          },
        ],
      };
      checkErrorCase(field);
    });
  });

  describe('custom types using formgen: RadioGroupResourceLabel', () => {
    const mockOperation = {
      path: 'sites/SSF2/interfaces/TigrisSite/methods/AddLabel',
      prefilledArgs: {},
      context: {
        containerType: 'TOWER',
        materialType: undefined,
        existingLabels: ['label1'],
      },
    };

    function getField(isOptional = false): ProdActions.NestedField {
      return {
        displayName: 'Label',
        name: 'label',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.Label',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description: 'label field',
                isOptional,
              },
            },
          },
        ],
      };
    }

    it('handles custom type: Label', () => {
      const field = getField();
      const labelField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });

      expect(labelField.type).toBe('RadioGroupResourceLabel');
      expect(labelField.name).toBe('value');
      expect(labelField.label).toBe(field.displayName);
      expect((labelField as FormGen.FieldRadioGroupResourceLabel).radioProps.disabled).toBe(false);
      expect((labelField as FormGen.FieldRadioGroupResourceLabel).containerType).toBe(
        mockOperation.context.containerType
      );
      expect((labelField as FormGen.FieldRadioGroupResourceLabel).materialType).toBe(
        mockOperation.context.materialType
      );
      expect((labelField as FormGen.FieldRadioGroupResourceLabel).existingLabels).toBe(
        mockOperation.context.existingLabels
      );
    });

    it('succeeds when Label field is optional and value is not provided', () => {
      const field = getField(true);
      const labelField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });
      expect(labelField.validate.isValidSync(undefined)).toBe(true);
    });
  });

  describe('custom types using formgen: AutocompleteFarmDefObject', () => {
    it('handles custom type: LarFarmDefMachinePath', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Location',
        name: 'location',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.laramie.LarFarmDefMachinePath',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern: '^sites/LAR1/areas/[a-zA-Z0-9]+/lines/[a-zA-Z0-9]+/machines/[a-zA-Z0-9]+$',
                },
              },
              farmosRpc: {
                description: 'Laramie FarmDef machine path location.',
                example: ['LAR1/NorthBuilding/GP18/Lane1/'],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/LAR1/areas/NorthBuilding/lines/GP18/machines/Lane1',
        prefilledArgs: {},
      };

      const farmDefField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });

      expect(farmDefField.type).toBe('AutocompleteFarmDefObject');
      expect(farmDefField.name).toBe('value');
      expect(farmDefField.label).toBe(field.displayName);
      expect(farmDefField.validate.isValidSync('sites/LAR1')).toBe(true);
      expect(farmDefField.validate.isValidSync('')).toBe(false);
      expect(farmDefField.validate.isValidSync(undefined)).toBe(false);
    });

    const mockFarmDefPathOperation = {
      path: 'sites/SSF2/interfaces/TigrisSite/methods/MoveContainer',
      prefilledArgs: {},
    };

    function getFarmDefPathField(isOptional = false): ProdActions.NestedField {
      return {
        displayName: 'Location',
        name: 'location',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.FarmDefPath',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern: '^sites/[A-Z0-9]{3}.*$',
                },
              },
              farmosRpc: {
                description: 'A FarmDef path location.',
                isOptional,
                example: [
                  'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing',
                  'sites/LAR1/areas/GrowOut/lines/GP1/machines/GrowLaneA',
                ],
              },
            },
          },
        ],
      };
    }

    it('handles custom type: FarmDefPath', () => {
      const field = getFarmDefPathField();
      const farmDefField = formGenFieldCustomTypeFactory({
        field,
        operation: mockFarmDefPathOperation,
        currentFarmPath,
      });

      expect(farmDefField.type).toBe('AutocompleteFarmDefObject');
      expect(farmDefField.name).toBe('value');
      expect(farmDefField.label).toBe(field.displayName);
      expect(farmDefField.validate.isValidSync('sites/SSF2')).toBe(true);
      expect(farmDefField.validate.isValidSync('')).toBe(false);
      expect(farmDefField.validate.isValidSync(undefined)).toBe(false);
    });

    it('succeeds when FarmDefPath field is optional and value is not provided', () => {
      const field = getFarmDefPathField(true);
      const farmDefField = formGenFieldCustomTypeFactory({
        field,
        operation: mockFarmDefPathOperation,
        currentFarmPath,
      });
      expect(farmDefField.validate.isValidSync(undefined)).toBe(true);
    });
  });

  describe('custom types using formgen: AutocompleteFarmDefCrop', () => {
    function getField(isOptional = false): ProdActions.NestedField {
      return {
        displayName: 'Crop',
        name: 'crop',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.Cultivar',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description: 'cultivar field',
                isOptional,
              },
            },
          },
        ],
      };
    }

    const mockOperation = {
      path: 'sites/SSF2/interfaces/TigrisSite/methods/UpdateTrayInfo',
      prefilledArgs: {},
    };

    it('handles custom type: Cultivar', () => {
      const field = getField();
      const cultivarFormGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });

      expect(cultivarFormGenField.type).toBe('AutocompleteFarmDefCrop');
      expect(cultivarFormGenField.name).toBe('value');
      expect(cultivarFormGenField.label).toContain(field.displayName);
      expect(cultivarFormGenField.label).toContain('SSF2/Tigris');
      expect((cultivarFormGenField as FormGen.FieldAutocompleteFarmDefCrop).farmPath).toBe(currentFarmPath);
      expect((cultivarFormGenField as FormGen.FieldAutocompleteFarmDefCrop).autocompleteProps.disabled).toBe(false);
      expect(cultivarFormGenField.validate.isValidSync('WHC')).toBe(true);
      expect(cultivarFormGenField.validate.isValidSync('')).toBe(false);
      expect(cultivarFormGenField.validate.isValidSync(undefined)).toBe(false);
    });

    it('disables field if isDisabled is true and sets default value when pre-filled value is provided', () => {
      const mockOperation = {
        path: 'sites/SSF2/interfaces/TigrisSite/methods/UpdateTrayInfo',
        prefilledArgs: {
          crop: { isDisabled: true, value: 'WHC' },
        },
      };
      const field = getField();
      const cultivarFormGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect((cultivarFormGenField as FormGen.FieldAutocompleteFarmDefCrop).autocompleteProps.disabled).toBe(true);
      expect(cultivarFormGenField.default).toBe('WHC');
    });

    it('does not disable the field if isDisabled is false and sets default value when pre-filled value is provided', () => {
      const mockOperation = {
        path: 'sites/SSF2/interfaces/TigrisSite/methods/UpdateTrayInfo',
        prefilledArgs: {
          crop: { isDisabled: false, value: 'WHC' },
        },
      };
      const field = getField();
      const cultivarFormGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect((cultivarFormGenField as FormGen.FieldAutocompleteFarmDefCrop).autocompleteProps.disabled).toBe(false);
      expect(cultivarFormGenField.default).toBe('WHC');
    });

    it('succeeds when Cultivar field is optional and value is not provided', () => {
      const field = getField(true);
      const cultivarFormGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(cultivarFormGenField.validate.isValidSync(undefined)).toBe(true);
    });
  });

  describe('custom types using formgen: AutocompleteFarmDefSku', () => {
    function getField(typeName: string, isOptional = false): ProdActions.NestedField {
      return {
        displayName: 'Sku',
        name: 'sku',
        type: 'TYPE_MESSAGE',
        typeName: typeName,
        fields: [
          {
            displayName: 'Value',
            name: 'value',
            options: {
              farmosRpc: {
                description: 'A SKU code.',
                example: ['B11Bulk1lb', 'WhcBulk1lb', 'Also use Farm Def Service API to get list of valid SKUs'],
                isOptional,
              },
            },
            type: 'TYPE_STRING',
          },
        ],
      };
    }
    const mockOperation = {
      path: 'sites/SSF2/farms/Tigris/actions/sites/SSF2/areas/SecondaryPostHarvest/lines/CasePacking/machines/BoxLabeler/interfaces/BoxLabeler/methods/ChangeProduct',
      prefilledArgs: {},
    };

    it('handle custom Sku type', () => {
      const field = getField('plenty.farmos.api.rpc.Sku');
      const skuField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(skuField.type).toBe('AutocompleteFarmDefSku');
      expect(skuField.name).toBe('value');
      expect(skuField.label).toContain(field.displayName);
      expect(skuField.label).toContain('SSF2/Tigris');
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).farmPath).toBe(currentFarmPath);
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).autocompleteProps.disabled).toBe(false);
      expect(skuField.validate.isValidSync(undefined)).toBe(false);
    });

    it('succeeds when field of Sku type is optional and value is not provided', () => {
      const field = getField('plenty.farmos.api.rpc.Sku', true);
      const skuField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(skuField.validate.isValidSync(undefined)).toBe(true);
    });

    it('handle custom SkuOfBulkClass type', () => {
      const field = getField('plenty.farmos.api.rpc.SkuOfBulkClass');
      const skuField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(skuField.type).toBe('AutocompleteFarmDefSku');
      expect(skuField.name).toBe('value');
      expect(skuField.label).toContain(field.displayName);
      expect(skuField.label).toContain('SSF2/Tigris');
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).farmPath).toBe(currentFarmPath);
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).skuTypeClass).toBe('Bulk');
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).autocompleteProps.disabled).toBe(false);
      expect(skuField.validate.isValidSync(undefined)).toBe(false);
    });

    it('succeeds when field of SkuOfBulkClass type is optional and value is not provided', () => {
      const field = getField('plenty.farmos.api.rpc.SkuOfBulkClass', true);
      const skuField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(skuField.validate.isValidSync(undefined)).toBe(true);
    });

    it('handle custom SkuOfCaseClass type', () => {
      const field = getField('plenty.farmos.api.rpc.SkuOfCaseClass');
      const skuField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(skuField.type).toBe('AutocompleteFarmDefSku');
      expect(skuField.name).toBe('value');
      expect(skuField.label).toContain(field.displayName);
      expect(skuField.label).toContain('SSF2/Tigris');
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).farmPath).toBe(currentFarmPath);
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).skuTypeClass).toBe('Case');
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).autocompleteProps.disabled).toBe(false);
      expect(skuField.validate.isValidSync(undefined)).toBe(false);
    });

    it('succeeds when field of SkuOfCaseClass type is optional and value is not provided', () => {
      const field = getField('plenty.farmos.api.rpc.SkuOfCaseClass', true);
      const skuField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(skuField.validate.isValidSync(undefined)).toBe(true);
    });

    it('handle custom SkuOfClamshellClass type', () => {
      const field = getField('plenty.farmos.api.rpc.SkuOfClamshellClass');
      const skuField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(skuField.type).toBe('AutocompleteFarmDefSku');
      expect(skuField.name).toBe('value');
      expect(skuField.label).toContain(field.displayName);
      expect(skuField.label).toContain('SSF2/Tigris');
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).farmPath).toBe(currentFarmPath);
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).skuTypeClass).toBe('Clamshell');
      expect((skuField as FormGen.FieldAutocompleteFarmDefSku).autocompleteProps.disabled).toBe(false);
      expect(skuField.validate.isValidSync(undefined)).toBe(false);
    });

    it('succeeds when field of SkuOfClamshellClass type is optional and value is not provided', () => {
      const field = getField('plenty.farmos.api.rpc.SkuOfClamshellClass', true);
      const skuField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(skuField.validate.isValidSync(undefined)).toBe(true);
    });
  });

  describe('custom types using formgen: KeyboardDatePicker', () => {
    const mockDate = '2022-09-07';
    const mockDateTime = `${mockDate}T08:00:00.000Z`;

    beforeEach(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date(mockDateTime));
      Settings.defaultZone = 'America/Los_Angeles';
    });

    afterEach(() => {
      jest.useRealTimers();
      Settings.defaultZone = 'system';
    });

    function getField(isOptional = false): ProdActions.NestedField {
      return {
        displayName: 'Date',
        name: 'date',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.Date',
        fields: [
          {
            displayName: 'Value',
            name: 'value',
            options: {
              rules: {
                string: {
                  pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
                },
              },
              farmosRpc: {
                description: 'Date in YYYY-MM-DD format.',
                example: ['2022-05-01'],
                isOptional,
              },
            },
            type: 'TYPE_STRING',
          },
        ],
      };
    }

    const mockOperation = {
      path: 'sites/LAX1/areas/SecondaryPostHarvest/lines/CaseProcessing/machines/CaseFiller/interfaces/Requests/methods/CreateCaseLabels',
      prefilledArgs: {},
    };

    it('handle custom type Date', () => {
      const field = getField();
      const dateField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      }) as FormGen.FieldKeyboardDatePicker;
      expect(dateField.type).toBe('KeyboardDatePicker');
      expect(dateField.name).toBe('value');
      expect(dateField.label).toBe(field.displayName);
      expect(dateField.valueFormat).toBe(DateTimeFormat.SQL_DATE_ONLY);
      expect(dateField.validate.isValidSync(undefined)).toBe(false);
      expect(dateField.validate.isValidSync('')).toBe(false);
      expect(dateField.validate.isValidSync('2022-A01-99')).toBe(true);
      expect(dateField.validate.isValidSync('2022-01-01')).toBe(true);
    });

    it('disables field if isDisabled is true and sets default value when pre-filled value is provided', () => {
      const mockOperation = {
        path: 'sites/LAX1/areas/SecondaryPostHarvest/lines/CaseProcessing/machines/CaseFiller/interfaces/Requests/methods/CreateCaseLabels',
        prefilledArgs: {
          date: { isDisabled: true, value: '2022-01-01' },
        },
      };
      const field = getField();
      const dateField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect((dateField as FormGen.FieldKeyboardDatePicker).keyboardDatePickerProps.disabled).toBe(true);
      expect(dateField.default).toBe('2022-01-01');
    });

    it('does not disable the field if isDisabled is false and sets default value when pre-filled value is provided', () => {
      const mockOperation = {
        path: 'sites/LAX1/areas/SecondaryPostHarvest/lines/CaseProcessing/machines/CaseFiller/interfaces/Requests/methods/CreateCaseLabels',
        prefilledArgs: {
          date: { isDisabled: false, value: '2022-01-01' },
        },
      };
      const field = getField();
      const dateField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect((dateField as FormGen.FieldKeyboardDatePicker).keyboardDatePickerProps.disabled).toBe(false);
      expect(dateField.default).toBe('2022-01-01');
    });

    it('succeeds when field is optional and value is not provided', () => {
      const field = getField(true);
      const dateField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(dateField.validate.isValidSync(undefined)).toBe(true);
      expect(dateField.validate.isValidSync(null)).toBe(true);
      expect(dateField.validate.isValidSync('')).toBe(true);
    });

    it('has default value of "undefined" when date field is optional', () => {
      const field = getField(true);
      const dateField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(dateField.default).toBe(undefined);
    });

    it('has default value of current NOW when date field is required', () => {
      const field = getField();
      const dateField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(dateField.default).toBe(mockDate);
    });
  });

  describe('custom types using formgen: Select', () => {
    function testSelectField(field: ProdActions.NestedField, operation: ProdActions.Operation) {
      const formGenField = formGenFieldCustomTypeFactory({ field, operation, currentFarmPath });

      expect(formGenField.type).toBe('Select');
      expect(formGenField.name).toBe('value');
      expect(formGenField.label).toBe(field.displayName);
      expect((formGenField as FormGen.FieldSelect).options).toBe(
        (field.fields[0] as ProdActions.FundamentalField).options.farmosRpc.values
      );
      expect((formGenField as FormGen.FieldSelect).selectProps.disabled).toBe(false);
      expect(formGenField.validate.isValidSync('1')).toBe(true);
      expect(formGenField.validate.isValidSync('')).toBe(false);
      expect(formGenField.validate.isValidSync(undefined)).toBe(false);
    }

    it('handles custom type: GermStackId', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Germ Stack Id',
        name: 'germ_stack_id',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.GermStackId',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: { description: 'The germ stack id.', values: ['1', '2'] },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/Propagation/lines/PropagationRack/interfaces/PropRack/methods/LoadGermStack',
        prefilledArgs: {},
      };
      testSelectField(field, mockOperation);
    });

    it('handles custom type: LegacySite', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Site',
        name: 'site',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.LegacySite',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: { description: 'The site.', values: ['TIGRIS', 'SSF1'] },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/SecondaryPostHarvest/lines/CasePacking/machines/BoxLabeler/interfaces/BoxLabeler/methods/ChangeProduct',
        prefilledArgs: {},
      };

      testSelectField(field, mockOperation);
    });

    it('handles custom type: PackageType', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Package Type',
        name: 'package_type',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.PackageType',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description: 'The package type.',
                values: [
                  'CLAMSHELL_4OZ',
                  'CLAMSHELL_4o5OZ',
                  'BULK_1LB',
                  'BULK_3LB',
                  'CASE_6_CLAMSHELL_4OZ',
                  'CASE_6_CLAMSHELL_4o5OZ',
                ],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/SecondaryPostHarvest/lines/CasePacking/machines/BoxLabeler/interfaces/BoxLabeler/methods/ChangeProduct',
        prefilledArgs: {},
      };

      testSelectField(field, mockOperation);
    });

    it('handles custom type: ContainerType', () => {
      const field: ProdActions.NestedField = {
        displayName: 'ContainerType',
        name: 'container_type',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.ContainerType',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description: 'The type of container',
                values: ['TRAY', 'TOWER', 'TABLE', 'TOTE', 'BATCH_SEED', 'LINE_SIDE_SEED', 'CARRIER'],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/LAX1/interfaces/FarmState/methods/CreateContainers',
        prefilledArgs: {},
      };

      testSelectField(field, mockOperation);
    });

    it('handles custom type: ContainerVersion', () => {
      const field: ProdActions.NestedField = {
        displayName: 'ContainerVersion',
        name: 'container_version',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.laramie.ContainerVersion',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description: 'Container version.',
                values: ['LARAMIE', 'SWIFT_RIVER'],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/LAR1/areas/NorthBuilding/lines/QA/machines/BoxLane1/interfaces/Inspection/methods/PlantsPlacedForInspection',
        prefilledArgs: {},
      };

      testSelectField(field, mockOperation);
    });

    it('handles custom type: PropLineId', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Prop Line Id',
        name: 'prop_line_id',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.PropLineId',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: { description: 'The prop line id.', values: ['1', '2', '3', '4', '5', '6', '7', '8'] },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/Propagation/lines/PropagationRack/interfaces/PropRack/methods/UnloadPropLine',
        prefilledArgs: {},
      };

      testSelectField(field, mockOperation);
    });

    it('handles custom type: ResourceContainerStatus', () => {
      const field: ProdActions.NestedField = {
        displayName: 'ResourceContainerStatus',
        name: 'resource_container_status',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.ResourceContainerStatus',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description: 'The physical state a container is in.',
                values: ['IN_USE', 'CLEAN', 'DIRTY', 'TRASHED', 'UNINITIALIZED', 'UNKNOWN'],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/LAX1/interfaces/FarmState/methods/CreateContainers',
        prefilledArgs: {},
      };

      testSelectField(field, mockOperation);
    });

    it('handles custom type: ToteStorageMode', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Tote Storage Mode',
        name: 'tote_storage_mode',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.ToteStorageMode',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description:
                  'Post-harvest mode that determines location where crops should be stored after being harvested (TOTE: stored in totes; DIRECT: conveyed directly to Blender).',
                values: ['TOTE', 'DIRECT'],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/LAX1/farms/LAX1/workCenters/Harvest/interfaces/Harvest/methods/UnloadTowersFromVerticalGrowAndHarvest',
        prefilledArgs: {},
      };

      testSelectField(field, mockOperation);
    });

    it('handle custom type: FarmDefPathSelect', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Pick Up Location',
        fields: [
          {
            displayName: 'Value',
            name: 'value',
            options: {
              farmosRpc: {
                description: 'A FarmDef path (with very specific restrictions).',
                example: [],
                values: [], // no values provided here, so get from parent/container options field.
              },
              rules: {
                string: {
                  pattern: '^.+$',
                },
              },
            },
            type: 'TYPE_STRING',
          },
        ],
        name: 'pick_up_location',
        options: {
          farmosRpc: {
            values: [
              'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack1',
              'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack2',
              'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack3',
              'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack4',
              'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack5',
              'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack6',
              'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack7',
              'sites/LAX1/areas/TableAutomation/lines/TableCrane/machines/CleanTableStack',
              'sites/LAX1/areas/TableAutomation/lines/TableCrane/machines/TableWasher/containerLocations/WashTablePickup',
              'sites/LAX1/areas/TableAutomation/lines/MainTable/machines/TableConveyance/containerLocations/MainLinePickup',
              'sites/LAX1/areas/TableAutomation/lines/MainTable/machines/TrayLoader/containerLocations/TrayLoaderPickup',
            ],
          },
        },
        repeated: false,
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.FarmDefPathSelect',
      };

      const mockOperation = {
        path: 'sites/LAX1/areas/TableAutomation/lines/TableCrane/interfaces/Requests/methods/MoveTableWithCraneLine',
        prefilledArgs: {},
      };

      const formGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });

      expect(formGenField.type).toBe('Select');
      expect(formGenField.name).toBe('value');
      expect(formGenField.label).toBe(field.displayName);
      expect((formGenField as FormGen.FieldSelect).options).toEqual(field.options.farmosRpc.values);
    });

    it('handle custom type: EupPropPathSelect', () => {
      const propRack1HeadLiftExpectedOptions = [
        'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
        'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2',
        'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel3',
        'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel4',
        'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel5',
        'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel6',
        'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel7',
        'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel8',
        'sites/LAX1/areas/TableAutomation/lines/MainTable/machines/TableConveyance',
      ];
      const field: ProdActions.NestedField = {
        displayName: 'Pick Up Location',
        fields: [
          {
            displayName: 'Value',
            name: 'value',
            options: {
              farmosRpc: {
                description: 'A FarmDef path (specifically restricted according to the prop rack and lift).',
                example: [],
                values: [], // no values provided here, so get from parent/container options field.
              },
              rules: {
                string: {
                  pattern: '^.+$',
                },
              },
            },
            type: 'TYPE_STRING',
          },
        ],
        name: 'pick_up_location',
        options: {
          farmosRpc: {
            values: [
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel3',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel4',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel5',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel6',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel7',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel8',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel1',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel2',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel3',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel4',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel5',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel6',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel7',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel8',
              'sites/LAX1/areas/TableAutomation/lines/MainTable/machines/TableConveyance',
            ],
          },
        },
        repeated: false,
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.EupPropPathSelect',
      };

      const mockOperation = {
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/HeadTableLift/interfaces/TableLift/methods/GetTableWithLift',
        prefilledArgs: {},
      };

      const formGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });

      expect(formGenField.type).toBe('Select');
      expect(formGenField.name).toBe('value');
      expect(formGenField.label).toBe(field.displayName);
      expect((formGenField as FormGen.FieldSelect).options).toEqual(propRack1HeadLiftExpectedOptions);
    });

    it('handle custom type: EupPropPathSelect', () => {
      const propRack2TailLiftExpectedOptions = [
        'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel1',
        'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel2',
        'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel3',
        'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel4',
        'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel5',
        'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel6',
        'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel7',
        'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel8',
      ];
      const field: ProdActions.NestedField = {
        displayName: 'Pick Up Location',
        fields: [
          {
            displayName: 'Value',
            name: 'value',
            options: {
              farmosRpc: {
                description: 'A FarmDef path (specifically restricted according to the prop rack and lift).',
                example: [],
                values: [], // no values provided here, so get from parent/container options field.
              },
              rules: {
                string: {
                  pattern: '^.+$',
                },
              },
            },
            type: 'TYPE_STRING',
          },
        ],
        name: 'pick_up_location',
        options: {
          farmosRpc: {
            values: [
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel3',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel4',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel5',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel6',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel7',
              'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel8',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel1',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel2',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel3',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel4',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel5',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel6',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel7',
              'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/PropLevel8',
              'sites/LAX1/areas/TableAutomation/lines/MainTable/machines/TableConveyance',
            ],
          },
        },
        repeated: false,
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.EupPropPathSelect',
      };

      const mockOperation = {
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack2/machines/TailTableLift/interfaces/TableLift/methods/GetTableWithLift',
        prefilledArgs: {},
      };

      const formGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });

      expect(formGenField.type).toBe('Select');
      expect(formGenField.name).toBe('value');
      expect(formGenField.label).toBe(field.displayName);
      expect((formGenField as FormGen.FieldSelect).options).toEqual(propRack2TailLiftExpectedOptions);
    });

    it('succeeds when field is optional and value is not provided', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Prop Line Id',
        name: 'prop_line_id',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.PropLineId',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description: 'The prop line id.',
                isOptional: true,
                values: ['1', '2', '3', '4', '5', '6', '7', '8'],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/Propagation/lines/PropagationRack/interfaces/PropRack/methods/UnloadPropLine',
        prefilledArgs: {},
      };

      const formGenField = formGenFieldCustomTypeFactory({ field, operation: mockOperation, currentFarmPath });
      expect(formGenField.validate.isValidSync(undefined)).toBe(true);
    });
  });

  describe('custom types usring formgen: TextField with type number', () => {
    it('handles custom type GrowLineId', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Grow Line Id',
        name: 'grow_line_id',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.GrowLineId',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_INT32',
            options: {
              rules: {
                int32: {
                  lte: 5,
                  gte: 1,
                },
              },
              farmosRpc: { description: 'The prop line id.' },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/interfaces/GrowLane1/methods/Index',
        prefilledArgs: {},
      };

      const growLineIdFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });

      expect(growLineIdFormGenField.type).toBe('TextField');
      expect(growLineIdFormGenField.name).toBe('value');
      expect(growLineIdFormGenField.label).toBe(field.displayName);
      expect((growLineIdFormGenField as FormGen.FieldTextField).textFieldProps.disabled).toBe(false);
      expect(growLineIdFormGenField.validate.isValidSync('1')).toBe(true);
      expect(growLineIdFormGenField.validate.isValidSync('5')).toBe(true);
      expect(growLineIdFormGenField.validate.isValidSync('6')).toBe(false);
      expect(growLineIdFormGenField.validate.isValidSync('')).toBe(false);
    });
  });

  describe('custom types usring formgen: TextField with type number', () => {
    it('handles custom type NumberOfCasesInPalletPartition', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Number Of Cases In Pallet Partition',
        name: 'number_of_cases_in_pallet_partition',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.NumberOfCasesInPalletPartition',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_INT32',
            options: {
              rules: {
                int32: {
                  gte: 1,
                },
              },
              farmosRpc: { description: 'Number of cases in pallet partition' },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/LAX1/areas/SecondaryPostHarvest/lines/CaseProcessing/machines/Palletizer/interfaces/Requests/methods/PartitionPalletAndCreateLabels',
        prefilledArgs: {},
      };

      const numberOfCasesInPalletPartitionField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });

      expect(numberOfCasesInPalletPartitionField.type).toBe('TextField');
      expect(numberOfCasesInPalletPartitionField.name).toBe('value');
      expect(numberOfCasesInPalletPartitionField.label).toBe(field.displayName);
      expect((numberOfCasesInPalletPartitionField as FormGen.FieldTextField).textFieldProps.disabled).toBe(false);
      expect(numberOfCasesInPalletPartitionField.validate.isValidSync('1')).toBe(true);
      expect(numberOfCasesInPalletPartitionField.validate.isValidSync('5')).toBe(true);
      expect(numberOfCasesInPalletPartitionField.validate.isValidSync('0')).toBe(false);
      expect(numberOfCasesInPalletPartitionField.validate.isValidSync('')).toBe(false);
    });
  });

  describe('custom types that are varition of serial number using formgen: TextField with type String', () => {
    function commonTestsForSerialNumberField(formGenField: any, field: ProdActions.NestedField, type = 'TextField') {
      expect(formGenField.type).toBe(type);
      expect(formGenField.name).toBe('value');
      expect(formGenField.label).toBe(field.displayName);
      expect(formGenField.textFieldProps.disabled).toBe(false);
      expect(formGenField.validate.isValidSync('')).toBe(false);
    }

    it('handles custom type: SerialForContainer', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Serial For Container',
        name: 'serial_for_container',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.SerialForContainer',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern:
                    '(^P900-[A-Z0-9]{8}:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$)|(^800-\\d{8}:(TOW|TRY|TBL):\\d{3}-\\d{3}-\\d{3}$)',
                },
              },
              farmosRpc: {
                description: 'The serial number for a container.',
                example: [
                  'P900-0008480B:M8NG-0KJU-0F',
                  'P900-0011118A:O16L-4TOG-G8',
                  '800-00009336:TOW:000-000-123',
                  'Also use Traceability Service API to get list of valid container serials',
                ],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/interfaces/TigrisSite/methods/AddLabel',
        prefilledArgs: {},
      };

      const serialForContainerFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });
      commonTestsForSerialNumberField(serialForContainerFormGenField, field);
      expect(serialForContainerFormGenField.validate.isValidSync('P900-0008480B:M8NG-0KJU-0F')).toBe(true);
      expect(serialForContainerFormGenField.validate.isValidSync('900-0008480B:M8NG-0KJU-0F')).toBe(false);
    });

    it('handles custom type: SerialForTable', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Serial For Table',
        name: 'serial_for_table',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.SerialForTable',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern:
                    '(^P900-0008046A:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$)|(^800-\\d{8}:TBL:\\d{3}-\\d{3}-\\d{3}$)',
                },
              },
              farmosRpc: {
                description: 'The serial number of a table.',
                example: [
                  'P900-0008046A:5WNV-JSM6-KB',
                  '800-00009336:TBL:000-000-123',
                  'Also use Traceability Service API to get list of valid table serials',
                ],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/Germination/lines/TableGermination/interfaces/GerminationLine/methods/UnloadStack',
        prefilledArgs: {},
      };

      const serialForTableFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });
      commonTestsForSerialNumberField(serialForTableFormGenField, field);
      expect(serialForTableFormGenField.validate.isValidSync('800-00009336:TBL:000-000-123')).toBe(true);
      expect(serialForTableFormGenField.validate.isValidSync('700-00009336:TBL:000-000-123')).toBe(false);
    });

    it('handles custom type: SerialForTote', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Serial For Tote',
        name: 'serial_for_tote',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.SerialForTote',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern: '^.+:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$',
                },
              },
              farmosRpc: {
                description: 'The serial number of a tote.',
                example: [
                  'P900-0011118A:ZT2C-IRMC-X6',
                  'Also use Traceability Service API to get list of valid tote serials',
                ],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/CentralProcessing/lines/TowerProcessing/machines/Harvester/interfaces/Harvester/methods/Harvest',
        prefilledArgs: {},
      };

      const serialForToteFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });
      commonTestsForSerialNumberField(serialForToteFormGenField, field);
      expect(serialForToteFormGenField.validate.isValidSync('P900-0011118A:ZT2C-IRMC-X6')).toBe(true);
      expect(serialForToteFormGenField.validate.isValidSync('700-00009336:TBL:000-000-123')).toBe(false);
    });

    it('handles custom type: SerialForTower', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Serial For Tower',
        name: 'serial_for_tower',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.SerialForTower',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern:
                    '(^P900-(0008480B|0011118A):[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$)|(^800-\\d{8}:TOW:\\d{3}-\\d{3}-\\d{3}$)',
                },
              },
              farmosRpc: {
                description: 'The serial number of a tower',
                example: [
                  'P900-0008480B:M8NG-0KJU-0F',
                  'P900-0011118A:O16L-4TOG-G8',
                  '800-00009336:TOW:000-000-123',
                  'Also use Traceability Service API to get list of valid tower serials',
                ],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane2/interfaces/GrowLane2/methods/Shuttle',
        prefilledArgs: {},
      };

      const serialForTowerFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });
      commonTestsForSerialNumberField(serialForTowerFormGenField, field);
      expect(serialForTowerFormGenField.validate.isValidSync('P900-0011118A:O16L-4TOG-G8')).toBe(true);
      expect(serialForTowerFormGenField.validate.isValidSync('P500-0011118A:O16L-4TOG-G8')).toBe(false);
    });

    it('handles custom type: SerialForTray', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Serial For Tray',
        name: 'serial_for_tray',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.SerialForTray',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern:
                    '(^P900-0008529A:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$)|(^800-\\d{8}:TRY:\\d{3}-\\d{3}-\\d{3}$)',
                },
              },
              farmosRpc: {
                description: 'The serial number of a tray',
                example: [
                  'P900-0008529A:CQCT-H69J-EB',
                  '800-00009336:TRY:000-000-123',
                  'Also use Traceability Service API to get list of valid tray serials',
                ],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/interfaces/TigrisSite/methods/UpdateTrayInfo',
        prefilledArgs: {},
      };

      const serialForTrayFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });
      commonTestsForSerialNumberField(serialForTrayFormGenField, field);
      expect(serialForTrayFormGenField.validate.isValidSync('P900-0008529A:CQCT-H69J-EB')).toBe(true);
      expect(serialForTrayFormGenField.validate.isValidSync('P500-0011118A:O16L-4TOG-G')).toBe(false);
    });

    it('handles custom type: SerialForTableWithPath', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Serial For Table With Path',
        name: 'serial_for_table',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.SerialForTableWithPath',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern:
                    '(^P900-0008046A:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$)|(^800-\\d{8}:TBL:\\d{3}-\\d{3}-\\d{3}$)',
                },
              },
              farmosRpc: {
                description: 'The serial number of a table.',
                example: [
                  'P900-0008046A:5WNV-JSM6-KB',
                  '800-00009336:TBL:000-000-123',
                  'Also use Traceability Service API to get list of valid table serials',
                ],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/SSF2/areas/Germination/lines/TableGermination/interfaces/GerminationLine/methods/UnloadStack',
        prefilledArgs: {},
      };

      const serialForTableFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      }) as FormGen.FieldTextFieldRemoteHelperText<FarmStateContainer>;
      commonTestsForSerialNumberField(serialForTableFormGenField, field, 'TextFieldRemoteHelperText');
      expect(serialForTableFormGenField.validate.isValidSync('800-00009336:TBL:000-000-123')).toBe(true);
      expect(serialForTableFormGenField.validate.isValidSync('700-00009336:TBL:000-000-123')).toBe(false);

      // method options methods
      expect(serialForTableFormGenField.url('800-00009336:TBL:000-000-123')).toEqual(
        '/api/plentyservice/executive-service/get-container-by-serial/800-00009336:TBL:000-000-123'
      );
      expect(serialForTableFormGenField.renderHelperText(mockFarmStateContainer)).toEqual(
        'Path: LAX1/VerticalGrow/GrowRoom1/GrowLine1/A2'
      );
    });

    it('handles custom type: ResourceId', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Id',
        fields: [
          {
            displayName: 'Value',
            name: 'value',
            options: {
              farmosRpc: {
                description: 'Either resource state id, container id, material id, container serial or material lot',
                example: ['38cd193f-1165-42ec-a794-14b4f65cf70e', '800-00000000:TOW:000-000-000'],
                values: [],
              },
              rules: {
                string: {
                  pattern: '^.*$',
                },
              },
            },
            type: 'TYPE_STRING',
          },
        ],
        name: 'id',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.ResourceId',
      };

      const mockOperation = {
        path: 'sites/SSF2/interfaces/Traceability/methods/RemoveContainerLabel',
        prefilledArgs: {},
      };

      const idFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });
      commonTestsForSerialNumberField(idFormGenField, field);
      expect(idFormGenField.validate.isValidSync('P900-0008529A:CQCT-H69J-EB')).toBe(true);
      expect(idFormGenField.validate.isValidSync('')).toBe(false);
    });

    it('handles custom type: PackageComponentLotName', () => {
      const field: ProdActions.NestedField = {
        displayName: 'Package Component Lot Name',
        name: 'package_component_lot_name',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.PackageComponentLotName',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern: '^.+$',
                },
              },
              farmosRpc: {
                description: 'The package component lot name',
                example: ['000-0000000A/00-000-00-00-00/01234567-8'],
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/LAX1/areas/PrimaryPostHarvest/lines/Packaging/interfaces/Requests/methods/ReceivePackageComponents',
        prefilledArgs: {},
      };

      const idFormGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });
      commonTestsForSerialNumberField(idFormGenField, field);
      expect(idFormGenField.validate.isValidSync('000-0000000A/00-000-00-00-00/01234567-8')).toBe(true);
      expect(idFormGenField.validate.isValidSync('')).toBe(false);
    });

    it('handles custom type: QrCodeJson', () => {
      const field: ProdActions.NestedField = {
        displayName: 'QrCodeJson',
        name: 'qr_code_json',
        type: 'TYPE_MESSAGE',
        repeated: true,
        typeName: 'plenty.farmos.api.rpc.QrCodeJson',
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              rules: {
                string: {
                  pattern: '^.+$',
                },
              },
              farmosRpc: {
                description: 'The internal QR code content of case label.',
              },
            },
          },
        ],
      };

      const mockOperation = {
        path: 'sites/LAX1/areas/SecondaryPostHarvest/lines/CaseProcessing/machines/CaseFiller/interfaces/Requests/methods/ScanCompletedCases',
        prefilledArgs: {},
      };

      const formGenField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });

      expect(formGenField.type).toBe('TextField');
      expect(formGenField.name).toBe('value');
      expect(formGenField.label).toBe(field.displayName);
      expect((formGenField as FormGen.FieldTextField).textFieldProps.disabled).toBe(false);
      expect((formGenField as FormGen.FieldTextField).textFieldProps.multiline).toBe(true);
      expect((formGenField as FormGen.FieldTextField).textFieldProps.maxRows).toBe(5);
      expect((formGenField as FormGen.FieldTextField).textFieldProps.autoFocus).toBe(true);
      expect((formGenField as FormGen.FieldTextField).addGroupOnNewLineOrReturn).toBe(true);
      expect(formGenField.validate.isValidSync('')).toBe(false);
      expect(formGenField.validate.isValidSync('1\n')).toBe(false);
      expect(formGenField.validate.isValidSync('json string')).toBe(true);
    });
  });

  describe('handles "isOptional" in TYPE_MESSAGE overriding nested field', () => {
    const mockOperation = {
      path: 'sites/SSF2/interfaces/TigrisSite/methods/AddLabel',
      prefilledArgs: {},
      context: {
        containerType: 'TOWER',
        materialType: undefined,
        existingLabels: ['label1'],
      },
    };

    function getField(isOptional: boolean): ProdActions.NestedField {
      return {
        displayName: 'Label',
        name: 'label',
        type: 'TYPE_MESSAGE',
        typeName: 'plenty.farmos.api.rpc.Label',
        options: {
          farmosRpc: {
            isOptional: isOptional, // TYPE_MESSAGE isOptional overrides nested value.
          },
        },
        fields: [
          {
            name: 'value',
            displayName: 'value',
            type: 'TYPE_STRING',
            options: {
              farmosRpc: {
                description: 'label field',
                isOptional: !isOptional,
              },
            },
          },
        ],
      };
    }

    it('sets the field as optional when TYPE_MESSAGE field has "isOptional" is true', () => {
      const field = getField(true);
      const labelField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });

      expect(labelField.validate.isValidSync(undefined)).toBe(true);
    });

    it('sets the field as required when TYPE_MESSAGE field has "isOptional" is false', () => {
      const field = getField(false);
      const labelField = formGenFieldCustomTypeFactory({
        field,
        operation: mockOperation,
        currentFarmPath,
      });

      expect(labelField.validate.isValidSync(undefined)).toBe(false);
    });
  });
});
