import { useGetWorkspaces } from '@plentyag/app-production/src/common/hooks/use-get-workspaces';
import { mockWorkspaces } from '@plentyag/app-production/src/common/test-helpers';
import { PRODUCTION_LEAD_ROLE_NAME } from '@plentyag/app-production/src/common/types';
import { DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES, mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';

import { mockWorkbinInstanceData, mockWorkbinTaskDefinitionData } from '../../../test-helpers';

import { useGenerateFormGenConfigAdapter } from '.';

mockCurrentUser();

jest.mock('@plentyag/app-production/src/common/hooks/use-get-workspaces');
const mockUseGetWorkspaces = useGetWorkspaces as jest.Mock;
mockUseGetWorkspaces.mockReturnValue({
  workspaces: mockWorkspaces,
});

function expectSkipFieldToBeHidden(isHidden: boolean, formGenConfig: FormGen.Config) {
  const skipField = formGenConfig.fields[1] as FormGen.FieldSelect;
  expect(skipField.name).toBe('skip');
  expect(skipField.inputContainerStyle).toEqual({ display: isHidden ? 'none' : 'initial' });
}

describe('useGenerateFormGenConfigAdapter', () => {
  it('generates formGen config', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[0];
    const mockInstance = mockWorkbinInstanceData[0].workbinTaskInstance;
    const { result } = renderHook(() =>
      useGenerateFormGenConfigAdapter({
        workbinTaskDefinition: mockTaskDefn,
        workbinTaskInstance: mockInstance,
        workbin: 'Grower',
        isUpdating: false,
      })
    );

    const formGenConfig = result.current;
    expect(formGenConfig.title).toBe(mockTaskDefn.title);
    expect(formGenConfig.subtitle).toContain(mockTaskDefn.description);
    expect(formGenConfig.subtitle).toContain(mockTaskDefn.sopLink);
    expect(formGenConfig.fields).toHaveLength(4);

    // hidden because 'isUpdating' is false
    expectSkipFieldToBeHidden(true, formGenConfig);
  });

  it('hides "skip" field when task defn is created by FarmOS (ie: definitionCreatedByInternalService is true)', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[1];
    const mockInstance = mockWorkbinInstanceData[1].workbinTaskInstance;
    const { result } = renderHook(() =>
      useGenerateFormGenConfigAdapter({
        workbinTaskDefinition: mockTaskDefn,
        workbinTaskInstance: mockInstance,
        workbin: 'Grower',
        isUpdating: true,
      })
    );

    const formGenConfig = result.current;
    expect(formGenConfig.fields).toHaveLength(4);

    // hidden because workbin task definition is created by FarmOS.
    expectSkipFieldToBeHidden(true, formGenConfig);
  });

  it('serialize returns all data necessary to submit task', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[0];
    const mockInstance = mockWorkbinInstanceData[0].workbinTaskInstance;
    const { result } = renderHook(() =>
      useGenerateFormGenConfigAdapter({
        workbinTaskDefinition: mockTaskDefn,
        workbinTaskInstance: mockInstance,
        workbin: 'Grower',
        isUpdating: true,
      })
    );

    const formGenConfig = result.current;

    // visible because 'isUpdating' is false and task is not created by FarmOS
    expectSkipFieldToBeHidden(false, formGenConfig);

    // test: not skipping
    const value = {
      skip: 'no',
      comment: 'done',
      completer: 'lneir',
      TestFieldName: '3141',
    };

    const serializedData = formGenConfig.serialize(value);

    expect(serializedData).toEqual({
      workbinTaskDefinitionId: mockTaskDefn.id,
      workbinTaskInstanceId: mockInstance.id,
      workbin: 'Grower',
      completer: 'lneir',
      description: mockInstance.description,
      status: 'COMPLETED',
      values: {
        TestFieldName: '3141',
      },
      comment: 'done',
      resultForPassFailCheck: false,
    });

    // test: skipping
    const valueWithSkip = {
      skip: 'yes',
      comment: 'skipping',
      TestFieldName: '3141',
    };

    const serializedDataWithSkip = formGenConfig.serialize(valueWithSkip);

    expect(serializedDataWithSkip).toEqual({
      workbinTaskDefinitionId: mockTaskDefn.id,
      workbinTaskInstanceId: mockInstance.id,
      workbin: 'Grower',
      completer: DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES.username,
      description: mockInstance.description,
      status: 'SKIPPED',
      values: undefined,
      comment: 'skipping',
      resultForPassFailCheck: false,
    });

    // test: passed
    const valueWithPass = {
      skip: 'no',
      comment: 'done',
      completer: 'lneir',
      TestFieldName: '3141',
      resultForPassFailCheck: 'yes',
    };

    const serializedDataWithPass = formGenConfig.serialize(valueWithPass);

    expect(serializedDataWithPass).toEqual({
      workbinTaskDefinitionId: mockTaskDefn.id,
      workbinTaskInstanceId: mockInstance.id,
      workbin: 'Grower',
      completer: 'lneir',
      description: mockInstance.description,
      status: 'COMPLETED',
      values: {
        TestFieldName: '3141',
      },
      comment: 'done',
      resultForPassFailCheck: true,
    });
  });

  it('shows empty description when neither workbinTaskInstance nor workbinTaskDefinition have one', () => {
    const _mockWorkbinTaskDefinitionData = cloneDeep(mockWorkbinTaskDefinitionData);
    const mockTaskDefn = _mockWorkbinTaskDefinitionData[0];
    delete mockTaskDefn.description; // remove description for testing purposes.
    const mockInstance = cloneDeep(mockWorkbinInstanceData[0].workbinTaskInstance);
    delete mockInstance.description; // remove description for testing purposes.

    const { result } = renderHook(() =>
      useGenerateFormGenConfigAdapter({
        workbinTaskDefinition: mockTaskDefn,
        workbinTaskInstance: mockInstance,
        workbin: 'Grower',
        isUpdating: true,
      })
    );

    const formGenConfig = result.current;

    const value = {
      skip: 'no',
      comment: 'done',
      completer: 'lneir',
      TestFieldName: '3141',
    };

    const serializedData = formGenConfig.serialize(value);

    expect(serializedData).toEqual(
      expect.objectContaining({
        description: '', // empty description
      })
    );
  });

  it('shows description from workbin instance', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[0];
    const mockInstance = mockWorkbinInstanceData[0].workbinTaskInstance;

    const { result } = renderHook(() =>
      useGenerateFormGenConfigAdapter({
        workbinTaskDefinition: mockTaskDefn,
        workbinTaskInstance: mockInstance,
        workbin: 'Grower',
        isUpdating: true,
      })
    );

    const formGenConfig = result.current;

    const value = {
      skip: 'no',
      comment: 'done',
      completer: 'lneir',
      TestFieldName: '3141',
    };

    const serializedData = formGenConfig.serialize(value);

    expect(serializedData).toEqual(
      expect.objectContaining({
        description: mockInstance.description, // matches description from workbin instance
      })
    );
  });

  it('shows formGen field displaying workbin instance description', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[0];
    const mockInstance = mockWorkbinInstanceData[0].workbinTaskInstance;

    const { result } = renderHook(() =>
      useGenerateFormGenConfigAdapter({
        workbinTaskDefinition: mockTaskDefn,
        workbinTaskInstance: mockInstance,
        workbin: 'Grower',
        isUpdating: true,
      })
    );

    const formGenConfig = result.current;
    expect(formGenConfig.fields).toHaveLength(4);

    const typographyField = formGenConfig.fields[0] as FormGen.FieldTypography;
    expect(typographyField.type).toEqual('Typography');
    expect(typographyField.label).toEqual(mockInstance.description);
  });

  it('completer field has correct roles', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[0];
    const mockInstance = mockWorkbinInstanceData[0].workbinTaskInstance;

    const { result } = renderHook(() =>
      useGenerateFormGenConfigAdapter({
        workbinTaskDefinition: mockTaskDefn,
        workbinTaskInstance: mockInstance,
        workbin: mockInstance.workbin,
        isUpdating: true,
      })
    );

    const formGen = result.current;
    expect(formGen.fields).toHaveLength(4);
    const autoCompleteUserfield = (formGen.fields[3] as FormGen.FieldIf).fields.find(
      field => field.type === 'AutocompleteUser'
    ) as FormGen.FieldAutocompleteUser;
    expect(autoCompleteUserfield.roles).toHaveLength(2);
    expect(autoCompleteUserfield.roles[0]).toBe(PRODUCTION_LEAD_ROLE_NAME);
    expect(autoCompleteUserfield.roles[1]).toBe(mockWorkspaces[1].userStoreRoleName);
  });

  it('shows formGen field(s) displaying workbin instance default values', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[0];
    const mockInstance = mockWorkbinInstanceData[0].workbinTaskInstance;

    const { result } = renderHook(() =>
      useGenerateFormGenConfigAdapter({
        workbinTaskDefinition: mockTaskDefn,
        workbinTaskInstance: { ...mockInstance, values: { TestFieldName: 'DefaultMockValue' } },
        workbin: 'Grower',
        isUpdating: true,
      })
    );

    const formGen = result.current;
    expect(formGen.fields).toHaveLength(4);
    const defaultTestfield = (formGen.fields[3] as FormGen.FieldIf).fields.find(
      field => field.type === 'TextField'
    ) as FormGen.FieldTextField;
    expect(defaultTestfield.name).toEqual(mockTaskDefn.fields[0].name);
    expect(defaultTestfield.default).toEqual('DefaultMockValue');
  });
});
