import { useGetWorkspaces } from '@plentyag/app-production/src/common/hooks/use-get-workspaces';
import { useLoadWorkbinTriggers } from '@plentyag/app-production/src/common/hooks/use-load-workbin-triggers';
import { mockWorkspaces } from '@plentyag/app-production/src/common/test-helpers';
import { isConcreteField } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { mockWorkbinTaskDefinitionData } from '../../../workspaces-page/test-helpers';
import { TaskDefinitionFields } from '../../components/task-definition-fields';

import { useEditTaskDefinitionFormGenConfig } from '.';

mockCurrentUser();

jest.mock('../../components/task-definition-fields');
const mockTaskDefinitionField = TaskDefinitionFields as jest.Mock;
mockTaskDefinitionField.mockImplementation(() => <div>mock Task Definition Fields</div>);

jest.mock('@plentyag/app-production/src/common/hooks/use-get-workspaces');
const mockUseGetWorkspaces = useGetWorkspaces as jest.Mock;
mockUseGetWorkspaces.mockReturnValue({
  workspaces: mockWorkspaces,
});

jest.mock('@plentyag/app-production/src/common/hooks/use-load-workbin-triggers');
const mockUseLoadWorkbinTriggers = useLoadWorkbinTriggers as jest.Mock;
mockUseLoadWorkbinTriggers.mockReturnValue({
  workbinTaskTriggers: [],
  isLoading: false,
  loadData: jest.fn(),
});

const mockTaskDefn = mockWorkbinTaskDefinitionData[0];
// test: scheduled type task in workbin side (type = triggered)
const submitData = {
  id: mockTaskDefn.id,
  shortTitle: 'Test short title',
  title: 'Test full title',
  description: 'Test description',
  sopLink: 'Test SOP link',
  hasPassFailCheck: true,
  priority: 'REGULAR',
  groupNames: mockTaskDefn.groups,
  workbins: mockTaskDefn.workbins,
  fields: [
    { fieldName: 'field1', fieldType: 'TYPE_FLOAT' },
    { fieldName: 'field2', fieldType: 'TYPE_STRING', isRequired: true },
  ],
  taskType: 'Triggered',
};

describe('useEditTaskDefinitionFormGenConfig', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('generates formGen config for creating definition', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[0];
    const { result } = renderHook(() => useEditTaskDefinitionFormGenConfig(mockTaskDefn, false));

    const formGenConfig = result.current;
    expect(formGenConfig.title).toBe('Create New Workbin Task Definition');
    expect(formGenConfig.fields).toHaveLength(9);
    expect(formGenConfig.fields[0]['label']).toEqual('Short Title');
    expect(formGenConfig.fields[1]['label']).toEqual('Title');
    expect(formGenConfig.fields[2]['label']).toEqual('Description');
    expect(formGenConfig.fields[3]['label']).toEqual('SOP Link');
    expect(formGenConfig.fields[4]['label']).toEqual('Pass / Fail Check');
    expect(formGenConfig.fields[5]['label']).toEqual('Workbins');
    expect(formGenConfig.fields[6]['label']).toEqual('Fields');
    expect(formGenConfig.fields[7]['label']).toEqual('Type of task?');
    expect(formGenConfig.fields[8]['fields']).toHaveLength(2);
  });

  it('generates proper default values for field: Type of task?', () => {
    const { result: resultTestCase1 } = renderHook(() =>
      useEditTaskDefinitionFormGenConfig(mockWorkbinTaskDefinitionData[0], false)
    );
    const formGenConfigTestCase1 = resultTestCase1.current;
    expect(formGenConfigTestCase1.fields[7]['default']).toEqual('Triggered');

    const { result: resultTestCase2 } = renderHook(() =>
      useEditTaskDefinitionFormGenConfig(mockWorkbinTaskDefinitionData[1], false)
    );
    const formGenConfigTestCase2 = resultTestCase2.current;
    expect(formGenConfigTestCase2.fields[7]['default']).toEqual('Unscheduled');
  });

  function expectSerializedDataToBe(serializedData) {
    expect(serializedData.shortTitle).toEqual(submitData.shortTitle);
    expect(serializedData.title).toEqual(submitData.title);
    expect(serializedData.description).toEqual(submitData.description);
    expect(serializedData.sopLink).toEqual(submitData.sopLink);
    expect(serializedData.hasPassFailCheck).toEqual(submitData.hasPassFailCheck);
    expect(serializedData.priority).toEqual(submitData.priority);
    expect(serializedData.groups).toEqual(submitData.groupNames);
    expect(serializedData.workbins).toEqual(submitData.workbins);
    expect(serializedData.fields).toEqual([
      { name: 'field1', type: 'TYPE_FLOAT', options: { farmosRpc: { isOptional: true } } },
      { name: 'field2', type: 'TYPE_STRING', options: { farmosRpc: {} } },
    ]);
    expect(serializedData.scheduled).toEqual(true);
  }

  it('serializes data needed to create a workbin task', () => {
    const { result } = renderHook(() => useEditTaskDefinitionFormGenConfig(mockTaskDefn, false));
    const formGenConfig = result.current;
    const serializedData = formGenConfig.serialize(submitData);

    expectSerializedDataToBe(serializedData);

    // specific expectations when creating a task.
    expect(serializedData.id).toBeNull();
    expect(serializedData.definitionCreatedByInternalService).toBe(false);

    // test: unscheduled type task in workbin side (type = unscheduled)
    const newSubmitData = { ...submitData, taskType: 'Unscheduled' };
    const serializedDataUnscheduled = formGenConfig.serialize(newSubmitData);
    expect(serializedDataUnscheduled.scheduled).toEqual(false);
  });

  it('serializes data needed to edit a workbin task', () => {
    const { result } = renderHook(() => useEditTaskDefinitionFormGenConfig(mockTaskDefn, true));
    const formGenConfig = result.current;
    const serializedData = formGenConfig.serialize(submitData);

    expectSerializedDataToBe(serializedData);

    // specific expectations when editing a task.
    expect(serializedData.id).toBe(mockTaskDefn.id);
    expect(serializedData.definitionCreatedByInternalService).toBe(mockTaskDefn.definitionCreatedByInternalService);
  });

  it('disables some fields when editing a farmos workbin task', () => {
    const mockTaskDefn = mockWorkbinTaskDefinitionData[1];
    const { result } = renderHook(() => useEditTaskDefinitionFormGenConfig(mockTaskDefn, true));
    const formGenConfig = result.current;

    function getFieldByName(fieldName: string) {
      return formGenConfig.fields.find(field => isConcreteField(field) && field.name === fieldName);
    }

    const passFailCheckField = getFieldByName('hasPassFailCheck') as FormGen.FieldCheckbox;
    expect(passFailCheckField.checkboxProps.disabled).toBe(true);

    const workbinsField = getFieldByName('workbins') as FormGen.FieldAutocomplete;
    expect(workbinsField.autocompleteProps.disabled).toBe(true);

    const shortTitleField = getFieldByName('shortTitle') as FormGen.FieldTextField;
    expect(shortTitleField.textFieldProps.disabled).toBe(true);
    // validation not used when editing - since this field is disabled.
    expect(shortTitleField.validate).toBe(undefined);

    // test that react component showing list of fields is disabled.
    const fieldsField = getFieldByName('fields') as FormGen.FieldReactComponent;
    expect(mockTaskDefinitionField).not.toHaveBeenCalled();
    // mock render react compoent, that should be disabled
    render(fieldsField.component({}));
    expect(mockTaskDefinitionField).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
      {}
    );
  });
});
