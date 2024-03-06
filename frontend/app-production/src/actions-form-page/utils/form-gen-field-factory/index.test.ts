import { mockConsoleError } from '@plentyag/core/src/test-helpers';

import { formGenFieldFactory } from '.';

const operation = {
  path: 'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing/machines/ToteFiller/interfaces/ToteFiller/methods/ToteFilled',
  prefilledArgs: {},
};

const currentFarmPath = 'sites/SSF2/farms/Tigris';

describe('formGenfieldFactory', () => {
  it('returns null when invalid type provided', () => {
    const consoleError = mockConsoleError();

    const field: ProdActions.Field = {
      name: 'passed_check_weighting',
      displayName: 'Passed Check Weighting',
      // @ts-ignore
      type: 'TYPE_NOT_VALID', // not a valid type
    };

    const invalidField = formGenFieldFactory({ field, operation, currentFarmPath });
    expect(invalidField).toBeNull();
    expect(consoleError).toHaveBeenCalled();
  });

  it('returns null field when farm def proto mapping is not found', () => {
    const consoleError = mockConsoleError();

    const field: ProdActions.Field = {
      name: 'grow_line_operation_mode',
      displayName: 'Grow Line Operation Mode',
      type: 'TYPE_MESSAGE',
      fields: [
        {
          displayName: 'Value',
          name: 'value',
          type: 'TYPE_STRING',
        },
      ],
      repeated: false,
      typeName: 'plenty.farmos.api.rpc.unsupported', // this proto does not exist
    };

    const invalidField = formGenFieldFactory({ field, operation, currentFarmPath });

    expect(invalidField).toBeNull();
    expect(consoleError).toHaveBeenCalled();
  });

  it('returns group field with with only when field when one of the farm def protos is not found', () => {
    const consoleError = mockConsoleError();

    // the first field here "grow_line_operation_mode" references a farm def proto that does not
    // exist so this field will be dropped from the group.
    const field: ProdActions.Field = {
      name: 'group_test_field',
      displayName: 'group test field',
      type: 'TYPE_MESSAGE',
      typeName: 'grouptest',
      fields: [
        {
          name: 'grow_line_operation_mode',
          displayName: 'Grow Line Operation Mode',
          type: 'TYPE_MESSAGE',
          fields: [
            {
              displayName: 'Value',
              name: 'value',
              type: 'TYPE_STRING',
            },
          ],
          repeated: false,
          typeName: 'plenty.farmos.api.rpc.unsupported', // this proto does not exist
        },
        {
          displayName: 'Weight In Grams',
          name: 'weight_in_grams',
          type: 'TYPE_FLOAT',
        },
      ],
    };

    const result = formGenFieldFactory({ field, operation, currentFarmPath });

    expect(result.type).toBe('group');
    const groupField = result as FormGen.FieldGroupArray;
    expect(groupField.fields).toHaveLength(1);

    const weightInGramsField = groupField.fields[0] as FormGen.FieldTextField;
    expect(weightInGramsField.type).toBe('TextField');
    expect(weightInGramsField.name).toBe('weight_in_grams');
    expect(consoleError).toHaveBeenCalled();
  });

  it('handles "boolean" type field', () => {
    const field: ProdActions.Field = {
      name: 'passed_check_weighting',
      displayName: 'Passed Check Weighting',
      type: 'TYPE_BOOL',
    };

    const boolFormGenField = formGenFieldFactory({ field, operation, currentFarmPath }) as FormGen.FieldSelect;

    expect(boolFormGenField.type).toBe('Select');
    expect(boolFormGenField.name).toBe('passed_check_weighting');
    expect(boolFormGenField.validate.isValidSync('true')).toBe(true);
    expect(boolFormGenField.validate.isValidSync('false')).toBe(true);
    expect(boolFormGenField.validate.isValidSync('f')).toBe(false);
    expect(boolFormGenField.validate.isValidSync('')).toBe(false);
  });

  it('handles "float" type field', () => {
    const field: ProdActions.Field = {
      displayName: 'Weight In Grams',
      name: 'weight_in_grams',
      type: 'TYPE_FLOAT',
    };

    const floatFormGenField = formGenFieldFactory({ field, operation, currentFarmPath }) as FormGen.FieldTextField;

    expect(floatFormGenField.type).toBe('TextField');
    expect(floatFormGenField.name).toBe('weight_in_grams');
    expect(floatFormGenField.validate.isValidSync('1.1')).toBe(true);
    expect(floatFormGenField.validate.isValidSync('1')).toBe(true);
    expect(floatFormGenField.validate.isValidSync('a')).toBe(false);
    expect(floatFormGenField.validate.isValidSync('')).toBe(false);
  });

  it('handles "int32" type field', () => {
    const field: ProdActions.Field = {
      displayName: 'Weight In Grams',
      name: 'weight_in_grams',
      type: 'TYPE_INT32',
    };

    const int32FormGenField = formGenFieldFactory({ field, operation, currentFarmPath }) as FormGen.FieldTextField;

    expect(int32FormGenField.type).toBe('TextField');
    expect(int32FormGenField.name).toBe('weight_in_grams');
    expect(int32FormGenField.validate.isValidSync('1.1')).toBe(false);
    expect(int32FormGenField.validate.isValidSync('1')).toBe(true);
    expect(int32FormGenField.validate.isValidSync('a')).toBe(false);
    expect(int32FormGenField.validate.isValidSync('')).toBe(false);
  });

  it('handles "uint32" type field', () => {
    const field: ProdActions.Field = {
      displayName: 'Weight In Grams',
      name: 'weight_in_grams',
      type: 'TYPE_UINT32',
    };

    const uint32FormGenField = formGenFieldFactory({ field, operation, currentFarmPath }) as FormGen.FieldTextField;

    expect(uint32FormGenField.type).toBe('TextField');
    expect(uint32FormGenField.name).toBe('weight_in_grams');
    expect(uint32FormGenField.validate.isValidSync('1.1')).toBe(false);
    expect(uint32FormGenField.validate.isValidSync('-1')).toBe(false);
    expect(uint32FormGenField.validate.isValidSync('-1.1')).toBe(false);
    expect(uint32FormGenField.validate.isValidSync('1')).toBe(true);
    expect(uint32FormGenField.validate.isValidSync('0')).toBe(true);
    expect(uint32FormGenField.validate.isValidSync('a')).toBe(false);
    expect(uint32FormGenField.validate.isValidSync('')).toBe(false);
  });

  it('handles "string" type field', () => {
    const field: ProdActions.Field = {
      displayName: 'Tote Serial',
      name: 'tote_serial',
      type: 'TYPE_STRING',
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const textFormGenField = formGenField as FormGen.FieldTextField;
    expect(textFormGenField.type).toBe('TextField');
    expect(textFormGenField.name).toBe('tote_serial');
    expect(textFormGenField.validate.isValidSync('123-xyz')).toBe(true);
    expect(textFormGenField.validate.isValidSync('')).toBe(false);
    expect(textFormGenField.textFieldProps.disabled).toBe(false);
  });

  it('handles "enum" type field', () => {
    const field: ProdActions.EnumField = {
      displayName: 'Mode',
      enumOptions: {
        name: 'Mode',
        value: [
          {
            name: 'MODE_ZERO',
            number: 0,
          },
          {
            name: 'MODE_ONE',
            number: 1,
          },
        ],
      },
      typeName: 'really.long.path.Mode',
      name: 'enum_sample',
      type: 'TYPE_ENUM',
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const radioFormGenField = formGenField as FormGen.FieldRadioGroup;
    expect(radioFormGenField.type).toBe('RadioGroup');
    expect(radioFormGenField.name).toBe('enum_sample');
    expect(radioFormGenField.validate.isValidSync('MODE_ZERO')).toBe(true);
    expect(radioFormGenField.validate.isValidSync('MODE_TWO')).toBe(false);
    expect(radioFormGenField.radioProps.disabled).toBe(false);
  });

  it('disables the field if isDisabled is true and sets default value when pre-filled value is provided', () => {
    const field: ProdActions.Field = {
      displayName: 'Tote Serial',
      name: 'tote_serial',
      type: 'TYPE_STRING',
    };

    const operation = {
      path: 'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing/machines/ToteFiller/interfaces/ToteFiller/methods/ToteFilled',
      prefilledArgs: {
        tote_serial: { isDisabled: true, value: 'xyz' },
      },
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const textFormGenField = formGenField as FormGen.FieldTextField;
    expect(textFormGenField.name).toBe('tote_serial');
    expect(textFormGenField.textFieldProps.disabled).toBe(true);
    expect(textFormGenField.default).toBe('xyz');
  });

  it('does not disable the field if isDisabled is false and sets default value when pre-filled value is provided', () => {
    const field: ProdActions.Field = {
      displayName: 'Tote Serial',
      name: 'tote_serial',
      type: 'TYPE_STRING',
    };

    const operation = {
      path: 'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing/machines/ToteFiller/interfaces/ToteFiller/methods/ToteFilled',
      prefilledArgs: {
        tote_serial: { isDisabled: false, value: 'xyz' },
      },
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const textFormGenField = formGenField as FormGen.FieldTextField;
    expect(textFormGenField.name).toBe('tote_serial');
    expect(textFormGenField.textFieldProps.disabled).toBe(false);
    expect(textFormGenField.default).toBe('xyz');
  });

  it('handles custom types', () => {
    const field: ProdActions.NestedField = {
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
            rules: {
              string: {
                pattern: '^[A-Z0-9]{3}$',
              },
            },
            farmosRpc: {
              description: 'A cultivar code.',
              example: ['B11', 'WHC', 'Also use Farm Def Service API to get list of valid cultivars'],
              values: [],
            },
          },
        },
      ],
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.name).toBe('crop');
    expect(groupField.fields).toHaveLength(1);
    const cultivarFormGenField = groupField.fields[0] as FormGen.FieldAutocompleteFarmDefCrop;
    expect(cultivarFormGenField.type).toBe('AutocompleteFarmDefCrop');
    expect(cultivarFormGenField.name).toBe('value');
  });

  it('handles SKU custom type', () => {
    const field: ProdActions.NestedField = {
      displayName: 'Sku',
      name: 'sku',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.Sku',
      fields: [
        {
          name: 'value',
          displayName: 'value',
          type: 'TYPE_STRING',
          options: {
            rules: {
              string: {
                pattern: '^[A-Z]([a-zA-Z0-9]*)?$',
              },
            },
            farmosRpc: {
              description: 'A SKU code.',
              example: ['B11Bulk1lb', 'WhcBulk1lb', 'Also use Farm Def Service API to get list of valid SKUs'],
              values: [],
            },
          },
        },
      ],
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.name).toBe('sku');
    expect(groupField.fields).toHaveLength(1);
    const skuFormGenField = groupField.fields[0] as FormGen.FieldAutocompleteFarmDefSku;
    expect(skuFormGenField.type).toBe('AutocompleteFarmDefSku');
    expect(skuFormGenField.name).toBe('value');
  });

  it('handles SkuOfBulkClass custom type', () => {
    const field: ProdActions.NestedField = {
      displayName: 'Sku',
      name: 'sku',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.SkuOfBulkClass',
      fields: [
        {
          name: 'value',
          displayName: 'value',
          type: 'TYPE_STRING',
          options: {
            rules: {
              string: {
                pattern: '^[A-Z]([a-zA-Z0-9]*)?$',
              },
            },
            farmosRpc: {
              description: 'A SKU code of bulk class.',
              example: [
                'B11Bulk1lbPlenty16.0oz',
                'PPSBulk1lbPlenty16.0oz',
                'Also use Farm Def Service API to get list of valid SKUs',
              ],
              values: [],
            },
          },
        },
      ],
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.name).toBe('sku');
    expect(groupField.fields).toHaveLength(1);
    const skuFormGenField = groupField.fields[0] as FormGen.FieldAutocompleteFarmDefSku;
    expect(skuFormGenField.type).toBe('AutocompleteFarmDefSku');
    expect(skuFormGenField.name).toBe('value');
  });

  it('handles SkuOfCaseClass custom type', () => {
    const field: ProdActions.NestedField = {
      displayName: 'Sku',
      name: 'sku',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.SkuOfCaseClass',
      fields: [
        {
          name: 'value',
          displayName: 'value',
          type: 'TYPE_STRING',
          options: {
            rules: {
              string: {
                pattern: '^[A-Z]([a-zA-Z0-9]*)?$',
              },
            },
            farmosRpc: {
              description: 'A SKU code of case class.',
              example: [
                'B11Case6Clamshell4o5ozPlenty',
                'PPSCase6Clamshell4o5ozPlenty',
                'Also use Farm Def Service API to get list of valid SKUs',
              ],
              values: [],
            },
          },
        },
      ],
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.name).toBe('sku');
    expect(groupField.fields).toHaveLength(1);
    const skuFormGenField = groupField.fields[0] as FormGen.FieldAutocompleteFarmDefSku;
    expect(skuFormGenField.type).toBe('AutocompleteFarmDefSku');
    expect(skuFormGenField.name).toBe('value');
  });

  it('handles SkuOfClamshellClass custom type', () => {
    const field: ProdActions.NestedField = {
      displayName: 'Sku',
      name: 'sku',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.SkuOfClamshellClass',
      fields: [
        {
          name: 'value',
          displayName: 'value',
          type: 'TYPE_STRING',
          options: {
            rules: {
              string: {
                pattern: '^[A-Z]([a-zA-Z0-9]*)?$',
              },
            },
            farmosRpc: {
              description: 'A SKU code of clamshell class.',
              example: [
                'B11Clamshell4o5ozPlenty4.5oz',
                'PPSClamshell4o5ozPlenty4.5oz',
                'Also use Farm Def Service API to get list of valid SKUs',
              ],
              values: [],
            },
          },
        },
      ],
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.name).toBe('sku');
    expect(groupField.fields).toHaveLength(1);
    const skuFormGenField = groupField.fields[0] as FormGen.FieldAutocompleteFarmDefSku;
    expect(skuFormGenField.type).toBe('AutocompleteFarmDefSku');
    expect(skuFormGenField.name).toBe('value');
  });

  it('handles nested protos', () => {
    const field: ProdActions.NestedField = {
      displayName: 'Module1 Config',
      fields: [
        {
          displayName: 'Enabled',
          name: 'enabled',
          options: {
            farmosRpc: {
              description: 'Indicates whether drum module is enabled',
              example: [],
              values: [],
            },
          },
          type: 'TYPE_BOOL',
        },
        {
          displayName: 'Drum Rotation',
          name: 'drum_rotation',
          options: {
            farmosRpc: {
              description: 'Determines the size of the seed that will be picked',
              example: [],
              values: [],
            },
          },
          type: 'TYPE_INT32',
        },
        {
          displayName: 'Config Uuid',
          name: 'config_uuid',
          options: {
            farmosRpc: {
              description: 'The uuid of the config version currently used',
              example: [],
              values: [],
            },
          },
          type: 'TYPE_STRING',
        },
      ],
      name: 'module1_config',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.trayprocessing.seeder.ModuleConfig',
    };

    const operation = {
      path: 'sites/LAX1/areas/TrayAutomation/lines/TrayProcessing/machines/Seeder/interfaces/Seeder/methods/TraySeeded',
      prefilledArgs: {},
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.label).toBe('Module1 Config');
    expect(groupField.name).toBe('module1_config');
    expect(groupField.fields).toHaveLength(3);

    // second item should be 'enabled' field
    const enabledField = groupField.fields[0] as FormGen.FieldSelect;
    expect(enabledField.type).toBe('Select');
    expect(enabledField.name).toBe('enabled');

    // third item should be 'drum_rotation'
    const drumRotationField = groupField.fields[1] as FormGen.FieldTextField;
    expect(drumRotationField.type).toBe('TextField');
    expect(drumRotationField.name).toBe('drum_rotation');
    expect(drumRotationField.textFieldProps.type).toBe('number');

    // fourth item should be 'config_uuid'
    const configUuidField = groupField.fields[2] as FormGen.FieldTextField;
    expect(configUuidField.type).toBe('TextField');
    expect(configUuidField.name).toBe('config_uuid');
  });

  it('handles nested proto containing array of nested protos', () => {
    const field: ProdActions.NestedField = {
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.Entries',
      name: 'entries',
      displayName: 'The Entries',
      fields: [
        {
          fields: [
            {
              displayName: 'Number Of Trays',
              name: 'number_of_trays',
              options: {
                farmosRpc: {
                  description: 'The number of goal trays. A table can hold up to 54 trays.',
                  example: ['54'],
                  values: [],
                },
                rules: {
                  int32: {
                    gt: 0,
                    lte: 54,
                  },
                },
              },
              type: 'TYPE_INT32',
            },
            {
              displayName: 'Crop',
              name: 'crop',
              options: {
                farmosRpc: {
                  description: 'The crop to be seeded in the goal trays.',
                  example: ['WHR'],
                  values: [],
                },
              },
              type: 'TYPE_STRING',
            },
          ],
          name: 'entry1',
          type: 'TYPE_MESSAGE',
          displayName: 'Entry1',
          typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.requests.SeedTraysAndLoadToTableTaskEntry',
        },
        {
          fields: [
            {
              displayName: 'Number Of Trays',
              name: 'number_of_trays',
              options: {
                farmosRpc: {
                  description: 'The number of goal trays. A table can hold up to 54 trays.',
                  example: ['54'],
                  values: [],
                },
                rules: {
                  int32: {
                    gt: 0,
                    lte: 54,
                  },
                },
              },
              type: 'TYPE_INT32',
            },
            {
              displayName: 'Crop',
              name: 'crop',
              options: {
                farmosRpc: {
                  description: 'The crop to be seeded in the goal trays.',
                  example: ['WHR'],
                  values: [],
                },
              },
              type: 'TYPE_STRING',
            },
          ],
          name: 'entry2',
          type: 'TYPE_MESSAGE',
          displayName: 'Entry2',
          typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.requests.SeedTraysAndLoadToTableTaskEntry',
        },
      ],
    };

    const operation = {
      path: 'sites/LAX1/areas/TrayAutomation/interfaces/Requests/methods/SeedTraysAndLoadToTable',
      prefilledArgs: {},
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.label).toBe('The Entries');
    expect(groupField.name).toBe('entries');
    expect(groupField.fields).toHaveLength(2);

    const entry1 = groupField.fields[0] as FormGen.FieldGroupArray;
    expect(entry1.type).toBe('group');
    expect(entry1.label).toBe('Entry1');
    expect(entry1.name).toBe('entry1');
    expect(entry1.fields).toHaveLength(2);
    const numTraysField1 = entry1.fields[0] as FormGen.FieldTextField;
    expect(numTraysField1.type).toBe('TextField');
    expect(numTraysField1.name).toBe('number_of_trays');
    const cropField1 = entry1.fields[1] as FormGen.FieldTextField;
    expect(cropField1.type).toBe('TextField');
    expect(cropField1.name).toBe('crop');

    const entry2 = groupField.fields[1] as FormGen.FieldGroupArray;
    expect(entry2.type).toBe('group');
    expect(entry2.label).toBe('Entry2');
    expect(entry2.name).toBe('entry2');
    expect(entry2.fields).toHaveLength(2);
    const numTraysField2 = entry2.fields[0] as FormGen.FieldTextField;
    expect(numTraysField2.type).toBe('TextField');
    expect(numTraysField2.name).toBe('number_of_trays');
    const cropField2 = entry2.fields[1] as FormGen.FieldTextField;
    expect(cropField2.type).toBe('TextField');
    expect(cropField2.name).toBe('crop');
  });

  it('handles nested proto containing a custom type', () => {
    const field: ProdActions.NestedField = {
      displayName: 'Config',
      fields: [
        {
          displayName: 'Enabled',
          name: 'enabled',
          options: {
            farmosRpc: {
              description: 'Indicates whether drum module is enabled',
              example: [],
              values: [],
            },
          },
          type: 'TYPE_BOOL',
        },
        {
          displayName: 'Label',
          fields: [
            {
              displayName: 'Value',
              name: 'value',
              options: {
                farmosRpc: {
                  description: 'The label for a container or material.',
                  example: [
                    'Broken Funnel',
                    'Extraneous Vegetative Matter',
                    'Broken Tower',
                    'Also use Traceability Service API to get list of valid labels',
                  ],
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
          name: 'label',
          type: 'TYPE_MESSAGE',
          typeName: 'plenty.farmos.api.rpc.Label',
        },
      ],
      name: 'config',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.trayprocessing.seeder.ModuleConfig',
    };

    const operation = {
      path: 'sites/LAX1/areas/TrayAutomation/lines/TrayProcessing/machines/Seeder/interfaces/Seeder/methods/TraySeeded',
      prefilledArgs: {},
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.label).toBe('Config');
    expect(groupField.name).toBe('config');
    expect(groupField.fields).toHaveLength(2);

    const boolField = groupField.fields[0] as FormGen.FieldSelect;
    expect(boolField.type).toBe('Select');
    expect(boolField.name).toBe('enabled');

    const labelField = groupField.fields[1] as FormGen.FieldGroupArray;
    expect(labelField.type).toBe('group');
    expect(labelField.name).toBe('label');
    expect(labelField.fields).toHaveLength(1);
    const labelValue = labelField.fields[0] as FormGen.FieldRadioGroupResourceLabel;
    expect(labelValue.type).toBe('RadioGroupResourceLabel');
    expect(labelValue.name).toBe('value');
  });

  it('applies isOptional value to nested fields when number of nested fields is greater than 1', () => {
    const field: ProdActions.NestedField = {
      displayName: 'Config',
      fields: [
        {
          displayName: 'Enabled',
          name: 'enabled',
          options: {
            farmosRpc: {
              description: 'Indicates whether drum module is enabled',
              example: [],
              values: [],
              isOptional: false,
            },
          },
          type: 'TYPE_BOOL',
        },
        {
          displayName: 'Label',
          name: 'label',
          type: 'TYPE_STRING',
        },
      ],
      name: 'config',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.trayprocessing.seeder.ModuleConfig',
      options: { farmosRpc: { isOptional: true } }, // isOptional here is applied to nested fields
    };

    const operation = {
      path: 'sites/LAX1/areas/TrayAutomation/lines/TrayProcessing/machines/Seeder/interfaces/Seeder/methods/TraySeeded',
      prefilledArgs: {},
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.label).toBe('Config');
    expect(groupField.name).toBe('config');
    expect(groupField.fields).toHaveLength(2);

    // first item should be 'enabled' field
    const enabledField = groupField.fields[0] as FormGen.Field;
    expect(enabledField.validate.isValidSync(undefined)).toBe(true);
    expect(enabledField.validate.isValidSync(null)).toBe(true);
    expect(enabledField.validate.isValidSync(true)).toBe(true);
    expect(enabledField.validate.isValidSync(false)).toBe(true);

    // second item should be 'label' field
    const labelField = groupField.fields[1] as FormGen.Field;
    expect(labelField.validate.isValidSync(undefined)).toBe(true);
    expect(labelField.validate.isValidSync(null)).toBe(true);
    expect(labelField.validate.isValidSync('some label')).toBe(true);
  });

  it('applies isOptional value to nested field when number of nested fields is equal to 1', () => {
    const field: ProdActions.NestedField = {
      displayName: 'Label',
      name: 'label',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.Label',
      options: { farmosRpc: { isOptional: true } }, // isOptional here will be applied to nested field.
      fields: [
        {
          displayName: 'Value',
          name: 'value',
          options: {
            farmosRpc: {
              description: 'The label for a container or material.',
              example: [
                'Broken Funnel',
                'Extraneous Vegetative Matter',
                'Broken Tower',
                'Also use Traceability Service API to get list of valid labels',
              ],
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
    };

    const operation = {
      path: 'sites/LAX1/areas/TrayAutomation/lines/TrayProcessing/machines/Seeder/interfaces/Seeder/methods/TraySeeded',
      prefilledArgs: {},
    };

    const formGenField = formGenFieldFactory({ field, operation, currentFarmPath });

    const groupField = formGenField as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.name).toBe('label');
    expect(groupField.fields).toHaveLength(1);

    const valueField = groupField.fields[0] as FormGen.Field;
    expect(valueField.validate.isValidSync(undefined)).toBe(true);
  });
});
