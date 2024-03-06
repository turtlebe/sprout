export const action: ProdActions.ActionModel = {
  actionType: 'tell',
  description:
    'Adds a label to a given container. Behind the scene the label may be attached to the container or the material depending on the specific label.',
  fields: [
    {
      displayName: 'Serial',
      fields: [
        {
          displayName: 'Value',
          name: 'value',
          options: {
            farmosRpc: {
              description: 'The serial number for a container.',
              example: [
                'P900-0008480B:M8NG-0KJU-0F',
                'P900-0011118A:O16L-4TOG-G8',
                '800-00009336:TOW:000-000-123',
                'BATCH_SEED-T28G-YHYP-AMON',
                'SHIP_SEED-O7K3-3N3R-4WVH',
                'LINE_SIDE_SEED-XA2W-1LS6-X1N5',
                'Also use Traceability Service API to get list of valid container serials',
              ],
              values: [],
            },
            rules: {
              string: {
                pattern:
                  '(^P900-[A-Z0-9]{8}:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$)|(^800-\\d{8}:(TOW|TRY|TBL):\\d{3}-\\d{3}-\\d{3}$)|(^(BATCH_SEED|SHIP_SEED|LINE_SIDE_SEED):[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})',
              },
            },
          },
          type: 'TYPE_STRING',
        },
      ],
      name: 'serial',
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.SerialForContainer',
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
  name: 'Add Label',
};

export const operation: ProdActions.Operation = {
  path: 'sites/SSF2/interfaces/TigrisSite/methods/AddLabel',
  prefilledArgs: {},
};
