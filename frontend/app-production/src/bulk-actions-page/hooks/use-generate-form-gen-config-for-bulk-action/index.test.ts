import { useGetActionModel } from '@plentyag/app-production/src/actions-form-page/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useGenerateFormGenConfigForBulkAction } from '.';

const mockSerials = ['P900-0008480B:SZSY-EVI3-6R', 'P900-0008046A:LK65-LM28-5Y'];
const mockOperation: ProdActions.Operation = {
  path: 'sites/SSF2/interfaces/Traceability/methods/WashContainer',
  prefilledArgs: {
    serial: {
      isDisabled: true,
      value: mockSerials,
    },
  },
  bulkFieldName: 'serial',
};
const mockAction: ProdActions.ActionModel = {
  actionType: 'request',
  description: 'Wash container',
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
                  '(^P900-[A-Z0-9]{8})|(P800-00012192):[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$|(^800-\\d{8}:(TOW|TRY|TBL):\\d{3}-\\d{3}-\\d{3}$)|(^(BATCH_SEED|SHIP_SEED|LINE_SIDE_SEED):[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})',
              },
            },
          },
          type: 'TYPE_STRING',
        },
      ],
      name: 'serial',
      options: {},
      type: 'TYPE_MESSAGE',
      typeName: 'plenty.farmos.api.rpc.SerialForContainer',
    },
  ],
  name: 'Wash Container',
};

jest.mock('@plentyag/app-production/src/actions-form-page/hooks/use-get-action-model');
const mockUseGetActionModel = useGetActionModel as jest.Mock;
mockUseGetActionModel.mockReturnValue({
  action: mockAction,
});

describe('useGenerateFormGenConfigForBulkAction', () => {
  it('generates form gen config', () => {
    const { result } = renderHook(() => useGenerateFormGenConfigForBulkAction(mockOperation));

    const formGenConfig = result.current;

    expect(formGenConfig.title).toEqual(mockAction.name);

    expect(formGenConfig.fields).toHaveLength(1);
    const groupField = formGenConfig.fields[0] as FormGen.FieldGroupArray;
    expect(groupField.type).toBe('group');
    expect(groupField.fields).toHaveLength(1);

    expect(groupField.fields).toHaveLength(1);
    const groupTextField = groupField.fields[0] as FormGen.FieldTextField;
    expect(groupTextField.type).toBe('TextField');
    expect(groupTextField.label).toBe('Serial(s)');

    const bulkSerialTextField = groupField.fields[0] as FormGen.FieldTextField;

    expect(bulkSerialTextField.default).toBe(mockSerials);

    // field is disabled, so user can not change value.
    expect(bulkSerialTextField.textFieldProps.disabled).toBe(true);

    // when a field is disabled, the only validation is that it is required.
    const validate = bulkSerialTextField.validate;
    expect(() => validate.validateSync(undefined)).toThrow();
    expect(() => validate.validateSync('')).toThrow();
    expect(() => validate.validateSync('123')).not.toThrow();
  });
});
