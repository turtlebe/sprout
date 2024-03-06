import { DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES, mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { SUBMISSION_METHOD_DEFAULT } from '@plentyag/core/src/utils';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';

import { action, operation } from '../../test-helpers/mock-action-and-operation';
import {
  action as seedAndLoadTrayAction,
  operation as seedAndLoadTrayOperation,
} from '../../test-helpers/mock-seed-and-load-tray-action-and-operation';

import { useGenerateFormGenConfigFromActionModel } from '.';

mockCurrentUser();

describe('useGenerateFormGenConfigFromActionModel', () => {
  it('serializes the nested data', () => {
    const { result } = renderHook(() => useGenerateFormGenConfigFromActionModel({ action, operation }));

    const values = { serial: 'P900-0008480B:M8NG-0KJU-0F', label: { value: 'Broken Funnel' } };

    expect(result.current.serialize(values)).toEqual({
      serial: 'P900-0008480B:M8NG-0KJU-0F',
      label: {
        value: 'Broken Funnel',
      },
      submission_method: SUBMISSION_METHOD_DEFAULT,
      submitter: DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES.username,
    });
  });

  it('passes optional createEndpoint and updateEndPoint values', () => {
    const mockCreateEndPoint = '/mock-create';
    const mockUpdateEndPoint = '/mock-update';
    const { result } = renderHook(() =>
      useGenerateFormGenConfigFromActionModel({
        action,
        operation,
        createEndpoint: mockCreateEndPoint,
        updateEndpoint: mockUpdateEndPoint,
      })
    );

    const formGenConfig = result.current;

    expect(formGenConfig).toEqual(
      expect.objectContaining({
        createEndpoint: mockCreateEndPoint,
        updateEndpoint: mockUpdateEndPoint,
      })
    );
  });

  it('generates formGenConfig from given action', () => {
    const { result } = renderHook(() => useGenerateFormGenConfigFromActionModel({ action, operation }));

    const formGenConfig = result.current;

    expect(formGenConfig.title).toBe(action.name);
    expect(formGenConfig.fields).toHaveLength(2);
    const serialField = formGenConfig.fields[0] as FormGen.Field;
    expect(serialField.name).toBe(action.fields[0].name);
    const labelField = formGenConfig.fields[1] as FormGen.Field;
    expect(labelField.name).toBe(action.fields[1].name);
    expect(formGenConfig.createEndpoint).toContain(operation.path);

    expect(formGenConfig.title).toBe(action.name);
    expect(formGenConfig.subtitle).toBe(`(${action.actionType}) ${action.description}`);
    expect(formGenConfig.fields).toHaveLength(2);

    expect(formGenConfig.fields[0].type).toBe('group');
    const serialGroup = formGenConfig.fields[0] as FormGen.FieldGroupArray;
    expect(serialGroup.fields).toHaveLength(1);
    expect(serialGroup.fields[0].type).toBe('TextField');

    expect(formGenConfig.fields[1].type).toBe('group');
    const labelGroup = formGenConfig.fields[1] as FormGen.FieldGroupArray;
    expect(labelGroup.fields).toHaveLength(1);
    const label = labelGroup.fields[0] as FormGen.FieldRadioGroupResourceLabel;
    expect(label.type).toBe('RadioGroupResourceLabel');
    expect(label.name).toBe('value');
  });

  it('filters types that are not supported', () => {
    const consoleError = mockConsoleError();
    const mockSerialize = jest.fn();

    const actionWithUnknownType = cloneDeep(action);
    // create a type that is not supported.
    // @ts-ignore
    actionWithUnknownType.fields[0].type = 'TYPE_UNKNOWN';
    const formGenConfig = useGenerateFormGenConfigFromActionModel({
      action: actionWithUnknownType,
      operation,
      serialize: mockSerialize,
    });

    expect(formGenConfig.title).toBe(action.name);
    expect(formGenConfig.subtitle).toBe(`(${action.actionType}) ${action.description}`);
    expect(formGenConfig.fields).toHaveLength(1);
    expect(formGenConfig.fields[0].type).toBe('group');
    const labelGroup = formGenConfig.fields[0] as FormGen.FieldGroupArray;
    expect(labelGroup.fields).toHaveLength(1);
    expect(labelGroup.fields[0].type).toBe('RadioGroupResourceLabel');

    expect(formGenConfig.serialize).toBe(mockSerialize);

    expect(consoleError).toHaveBeenCalled();
  });

  it('deserializes the data', () => {
    const { result } = renderHook(() =>
      useGenerateFormGenConfigFromActionModel({ action: seedAndLoadTrayAction, operation: seedAndLoadTrayOperation })
    );

    const submittedData = {
      table_serial: 'P900-0008480B:M8NG-0KJU-0F',
      germ_stack_path: {
        value: 'Broken Funnel',
      },
      seed_trays_and_load_to_table_prescription: {
        entry1: {
          number_of_trays: 2,
          crop: 'WHC',
        },
        entry2: {
          number_of_trays: 5,
          crop: 'WHC',
        },
      },
    };

    expect(result.current.deserialize(submittedData)).toEqual(submittedData);
  });
});
