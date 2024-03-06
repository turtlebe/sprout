export const action: ProdActions.ActionModel = {
  actionType: 'request',
  description:
    'Seed and load trays to a particular table in a particular order, and move that table to a given Germination stack.',
  fields: [
    {
      displayName: 'Table Serial',
      name: 'table_serial',
      options: {
        farmosRpc: {
          description: 'The serial number of a table.',
          example: [
            'P900-0008046A:5WNV-JSM6-KB',
            '800-00009336:TBL:000-000-123',
            'Also use Traceability Service API to get list of valid table serials',
          ],
          values: [],
        },
        rules: {
          string: {
            pattern: '(^P900-0008046A:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$)|(^800-\\d{8}:TBL:\\d{3}-\\d{3}-\\d{3}$)',
          },
        },
      },
      type: 'TYPE_STRING',
    },
    {
      displayName: 'Germ Stack Path',
      fields: [
        {
          displayName: 'Value',
          name: 'value',
          options: {
            farmosRpc: {
              description: 'A FarmDef path.',
              example: [
                'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing',
                'sites/LAR1/areas/GrowOut/lines/GP1/machines/GrowLaneA',
                'Also use Farm Def Service API to get list of valid cultivars',
              ],
              values: [],
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
      name: 'germ_stack_path',
      options: {
        farmosRpc: {},
      },
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.FarmDefPath',
    },
    {
      displayName: 'Seed Trays And Load To Table Prescription',
      fields: [
        {
          displayName: 'Entry1',
          fields: [
            {
              displayName: 'Number Of Trays',
              name: 'number_of_trays',
              options: {
                farmosRpc: {
                  description: 'The number of goal trays. A table can hold up to 54 trays.',
                  example: ['54'],
                  isOptional: false,
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
                  isOptional: false,
                  values: [],
                },
              },
              type: 'TYPE_STRING',
            },
          ],
          name: 'entry1',
          options: {
            farmosRpc: {
              isOptional: false,
            },
          },
          type: 'TYPE_MESSAGE',
          typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.requests.SeedTraysAndLoadToTableTaskEntry',
        },
        {
          displayName: 'Entry2',
          fields: [
            {
              displayName: 'Number Of Trays',
              name: 'number_of_trays',
              options: {
                farmosRpc: {
                  description: 'The number of goal trays. A table can hold up to 54 trays.',
                  example: ['54'],
                  isOptional: false,
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
                  isOptional: false,
                  values: [],
                },
              },
              type: 'TYPE_STRING',
            },
          ],
          name: 'entry2',
          options: {
            farmosRpc: {
              isOptional: true,
            },
          },
          type: 'TYPE_MESSAGE',
          typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.requests.SeedTraysAndLoadToTableTaskEntry',
        },
        {
          displayName: 'Entry3',
          fields: [
            {
              displayName: 'Number Of Trays',
              name: 'number_of_trays',
              options: {
                farmosRpc: {
                  description: 'The number of goal trays. A table can hold up to 54 trays.',
                  example: ['54'],
                  isOptional: false,
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
                  isOptional: false,
                  values: [],
                },
              },
              type: 'TYPE_STRING',
            },
          ],
          name: 'entry3',
          options: {
            farmosRpc: {
              isOptional: true,
            },
          },
          type: 'TYPE_MESSAGE',
          typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.requests.SeedTraysAndLoadToTableTaskEntry',
        },
        {
          displayName: 'Entry4',
          fields: [
            {
              displayName: 'Number Of Trays',
              name: 'number_of_trays',
              options: {
                farmosRpc: {
                  description: 'The number of goal trays. A table can hold up to 54 trays.',
                  example: ['54'],
                  isOptional: false,
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
                  isOptional: false,
                  values: [],
                },
              },
              type: 'TYPE_STRING',
            },
          ],
          name: 'entry4',
          options: {
            farmosRpc: {
              isOptional: true,
            },
          },
          type: 'TYPE_MESSAGE',
          typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.requests.SeedTraysAndLoadToTableTaskEntry',
        },
        {
          displayName: 'Entry5',
          fields: [
            {
              displayName: 'Number Of Trays',
              name: 'number_of_trays',
              options: {
                farmosRpc: {
                  description: 'The number of goal trays. A table can hold up to 54 trays.',
                  example: ['54'],
                  isOptional: false,
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
                  isOptional: false,
                  values: [],
                },
              },
              type: 'TYPE_STRING',
            },
          ],
          name: 'entry5',
          options: {
            farmosRpc: {
              isOptional: true,
            },
          },
          type: 'TYPE_MESSAGE',
          typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.requests.SeedTraysAndLoadToTableTaskEntry',
        },
      ],
      name: 'seed_trays_and_load_to_table_prescription',
      options: {
        farmosRpc: {},
      },
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.euphrates.trayautomation.requests.SeedTraysAndLoadToTable',
    },
  ],
  name: 'Seed Trays And Load Table To Germ',
};

export const operation: ProdActions.Operation = {
  path: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
  prefilledArgs: {},
};
