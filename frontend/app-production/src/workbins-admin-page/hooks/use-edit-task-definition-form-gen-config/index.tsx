import { PartialColDefs, TooltipColumnDescription } from '@plentyag/brand-ui/src/components';
import { when } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';
import * as yup from 'yup';

import { useGetWorkspaces, useLoadWorkbinTriggers } from '../../../common/hooks';
import { WorkbinPriority, WorkbinTaskDefinition, WorkbinTaskTrigger } from '../../../common/types/workspace';
import { FieldDynamicOption, TaskDefinitionFields } from '../../components/task-definition-fields';

export type UseEditTaskDefinitionFormGenConfigReturn = FormGen.Config;

export interface EditTaskDefinitionFormikValues {
  id: string;
  shortTitle: string;
  title: string;
  description: string;
  sopLink: string;
  hasPassFailCheck: boolean;
  priority: WorkbinPriority;
  groupNames: string[];
  workbins: string[];
  fields: FieldDynamicOption[];
  taskType: string;
}

const taskDefinitionColDef: PartialColDefs = {
  id: {
    headerName: 'ID',
    field: 'id',
    colId: 'id',
    headerTooltip: 'The id of the definition, auto generated upon creation.',
  },
  shortTitle: {
    headerName: 'Short Title',
    field: 'shortTitle',
    colId: 'shortTitle',
    headerTooltip:
      'This short unique title is used to easily distinguish one task from another on the Workbin Task Page.',
  },
  title: {
    headerName: 'Title',
    field: 'title',
    colId: 'title',
    headerTooltip: 'This short description of the task will show on the users task list.',
  },
  description: {
    headerName: 'Description',
    field: 'description',
    colId: 'description',
    headerTooltip: 'More information about the specifics of these type of tasks.',
  },
  sopLink: {
    headerName: 'SOP Link',
    field: 'sopLink',
    colId: 'sopLink',
    headerTooltip: 'The SOP Link if any exists.',
  },
  hasPassFailCheck: {
    headerName: 'Pass / Fail Check',
    field: 'hasPassFailCheck',
    colId: 'hasPassFailCheck',
    headerTooltip:
      'Indicate wheather when submitting tasks of this type we ask user to fill an extra form field to inform us if the task passed or not.',
  },
  priority: {
    headerName: 'Priority',
    field: 'priority',
    colId: 'priority',
    headerTooltip:
      'SHIFT: Tasks with this priority will be presented in the bottom section of the task list, for the entire day, and will not gate any operations. URGENT: Task with this priority will be presented at the top section of the Task list will be marked as urgent, and are recommended to address first. REGULAR: Taks with this priority will be presented upon their trigger in the middle section of the task list.',
  },
  groupNames: {
    headerName: 'Group names',
    field: 'groupNames',
    colId: 'groupNames',
    headerTooltip: 'Any groups this definition might be part of.',
  },
  workbins: {
    headerName: 'Workbins',
    field: 'workbins',
    colId: 'workbins',
    headerTooltip: 'In which workbins can instances of this type be created.',
  },
  fields: {
    headerName: 'Fields',
    field: 'fields',
    colId: 'fields',
    headerTooltip: 'The custom fields that potentially need to be filled for this type of workbin.',
  },
  taskType: {
    headerName: 'Type of task',
    field: 'taskType',
    colId: 'taskType',
    headerTooltip:
      'Triggered tasks will be started on different schedules by executive service. Unscheduled tasks can only be created on demand from the UI.',
  },
};

export function useEditTaskDefinitionFormGenConfig(
  taskDefinition: WorkbinTaskDefinition,
  isUpdating: boolean
): UseEditTaskDefinitionFormGenConfigReturn {
  const [coreState] = useCoreStore();
  const { workspaces, isLoading: isLoadingWorkspaces } = useGetWorkspaces();
  const { loadData, workbinTaskTriggers, isLoading: isLoadingTriggers } = useLoadWorkbinTriggers();

  React.useEffect(() => {
    loadData({
      farm: coreState.currentUser.currentFarmDefPath,
    });
  }, [coreState.currentUser.currentFarmDefPath]);

  const initialFields = React.useMemo(() => {
    return taskDefinition.fields.map(value => ({
      fieldName: value.name,
      fieldType: value.type,
      isRequired: !Boolean(value.options?.farmosRpc?.isOptional),
    }));
  }, [taskDefinition]);

  if (!taskDefinition) {
    return;
  }

  // when editing a farmOS task defn (ie: definitionCreatedByInternalService = true) some fields as disabled.
  const isEditDisabledForFarmOsTaskDefn = isUpdating && taskDefinition.definitionCreatedByInternalService;

  const EditFieldsComponent: React.FC<FormGen.FieldProps<FormGen.FieldReactComponent>> = props => {
    return (
      <TaskDefinitionFields
        disabled={isEditDisabledForFarmOsTaskDefn}
        initialFields={initialFields}
        availableTypes={['TYPE_STRING', 'TYPE_FLOAT']}
        {...props}
      />
    );
  };

  const formGen = {
    title: isUpdating ? 'Edit Workbin Task Definition' : 'Create New Workbin Task Definition',
    permissions: {
      create: { resource: Resources.HYP_PRODUCTION, level: PermissionLevels.FULL },
      update: { resource: Resources.HYP_PRODUCTION, level: PermissionLevels.FULL },
    },
    serialize: (formValues: EditTaskDefinitionFormikValues): Omit<WorkbinTaskDefinition, 'createdAt' | 'updatedAt'> => {
      const selectedTriggers: WorkbinTaskTrigger[] = formValues.groupNames
        ? workbinTaskTriggers.filter(group => formValues.groupNames.includes(group.groupName))
        : [];

      const fields = formValues.fields.map(value => ({
        name: value.fieldName,
        type: value.fieldType,
        options: value.isRequired ? { farmosRpc: {} } : { farmosRpc: { isOptional: true } },
      }));
      return {
        id: isUpdating ? taskDefinition.id : null,
        shortTitle: formValues.shortTitle,
        farm: coreState.currentUser.currentFarmDefPath,
        title: formValues.title,
        description: formValues.description,
        sopLink: formValues.sopLink,
        hasPassFailCheck: formValues.hasPassFailCheck,
        priority: formValues.priority,
        groups: selectedTriggers,
        workbins: formValues.workbins,
        fields,
        scheduled: formValues.taskType === 'Triggered',
        definitionCreatedByInternalService: isUpdating ? taskDefinition.definitionCreatedByInternalService : false,
      };
    },
    createEndpoint: '/api/plentyservice/workbin-service/upsert-workbin-task-definition',
    updateEndpoint: '/api/plentyservice/workbin-service/upsert-workbin-task-definition',
    context: { tableCols: taskDefinitionColDef },
    fields: [],
  };

  const triggeredOrUnscheduled: FormGen.FieldRadioGroup = {
    type: 'RadioGroup',
    name: 'taskType',
    label: 'Type of task?',
    default: taskDefinition.scheduled ? 'Triggered' : 'Unscheduled',
    options: [
      { value: 'Triggered', label: 'Triggered' },
      { value: 'Unscheduled', label: 'Unscheduled' },
    ],
    validate: yup.string().required(),
    radioProps: { disabled: isUpdating, size: 'small' },
    tooltip: TooltipColumnDescription,
  };
  // if skipping, then only show the comment field
  const fieldsWhenTriggered: FormGen.FieldIf = {
    type: 'if',
    if: when(['taskType'], taskType => taskType === 'Triggered'),
    fields: [
      {
        type: 'Select',
        name: 'priority',
        label: 'Priority',
        options: ['SHIFT', 'URGENT', 'REGULAR'],
        validate: yup.string().required(),
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'AutocompleteMultiple',
        name: 'groupNames',
        label: 'Triggers',
        default: taskDefinition.groups.map(item => item.groupName),
        options: isLoadingTriggers
          ? []
          : workbinTaskTriggers
              .filter(item => taskDefinition.workbins.includes(item.workbin))
              .map(item => item.groupName)
              .sort((a, b) => a.localeCompare(b)),
        tooltip: TooltipColumnDescription,
      },
    ],
  };
  const formGenFields = [
    // TODO: Once WBS will be updated to return this as 'name' instead of 'type' this will also get updated
    {
      type: 'TextField',
      name: 'shortTitle',
      label: 'Short Title',
      textFieldProps: { disabled: isUpdating },
      validate: isUpdating ? undefined : yup.string().required().max(25),
      tooltip: TooltipColumnDescription,
    },
    {
      type: 'TextField',
      name: 'title',
      label: 'Title',
      validate: yup.string().required().max(100),
      tooltip: TooltipColumnDescription,
    },
    {
      type: 'TextField',
      name: 'description',
      label: 'Description',
      tooltip: TooltipColumnDescription,
      textFieldProps: {
        variant: 'outlined',
        multiline: true,
        minRows: 4,
      },
    },
    {
      type: 'TextField',
      name: 'sopLink',
      label: 'SOP Link',
      tooltip: TooltipColumnDescription,
    },
    {
      type: 'Checkbox',
      name: 'hasPassFailCheck',
      label: 'Pass / Fail Check',
      default: taskDefinition.hasPassFailCheck,
      validate: yup.bool(),
      tooltip: TooltipColumnDescription,
      checkboxProps: { disabled: isEditDisabledForFarmOsTaskDefn },
    },
    {
      type: 'AutocompleteMultiple',
      name: 'workbins',
      label: 'Workbins',
      validate: yup.array().required(),
      options: isLoadingWorkspaces ? [] : workspaces.map(item => item.role),
      tooltip: TooltipColumnDescription,
      autocompleteProps: { disabled: isEditDisabledForFarmOsTaskDefn },
    },
    {
      type: 'ReactComponent',
      name: 'fields',
      label: 'Fields',
      default: JSON.stringify(taskDefinition.fields),
      tooltip: TooltipColumnDescription,
      component: EditFieldsComponent,
    },
    triggeredOrUnscheduled,
    fieldsWhenTriggered,
  ];

  formGen.fields = formGenFields;
  return formGen;
}
