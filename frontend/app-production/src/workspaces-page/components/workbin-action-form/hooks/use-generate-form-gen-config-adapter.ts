import { useGenerateFormGenConfigFromActionModel } from '@plentyag/app-production/src/actions-form-page/hooks';
import { useGetWorkspaces } from '@plentyag/app-production/src/common/hooks/use-get-workspaces';
import {
  PRODUCTION_LEAD_ROLE_NAME,
  WorkbinDefinitionId,
  WorkbinInstanceId,
  WorkbinTaskDefinition,
  WorkbinTaskInstance,
  WorkbinTaskStatus,
} from '@plentyag/app-production/src/common/types';
import { when } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { useCoreStore } from '@plentyag/core/src/core-store';
import * as yup from 'yup';

interface SumbitPayload {
  workbinTaskDefinitionId: WorkbinDefinitionId;
  workbinTaskInstanceId?: WorkbinInstanceId;
  workbin: string;
  completer: string;
  description: string;
  status: WorkbinTaskStatus;
  values: { [name: string]: any };
  comment: string;
  resultForPassFailCheck?: boolean;
}

/**
 * Adapter that generates a form-gen configuration from given workbin task defn/instance...
 * it adapts the given workbin task defn/instance to an action model so we can re-use the
 * function "generateFormGenConfigFromActionModel" to generate a form-gen from an action.
 */
export function useGenerateFormGenConfigAdapter({
  workbinTaskDefinition,
  workbinTaskInstance,
  workbin,
  isUpdating,
}: {
  workbinTaskDefinition?: WorkbinTaskDefinition;
  workbinTaskInstance?: WorkbinTaskInstance;
  workbin: string;
  isUpdating: boolean;
}) {
  const [state] = useCoreStore();
  const { workspaces } = useGetWorkspaces();

  const workbinTaskDefinitionFields =
    workbinTaskDefinition?.fields.map<ProdActions.Field>(field => {
      return {
        displayName: field.name,
        name: field.name,
        options: field.options,
        type: field.type,
      };
    }) || [];

  const fieldDefaults: ProdActions.Operation['prefilledArgs'] = {};
  workbinTaskDefinition?.fields.forEach(field => {
    const defaultValue = workbinTaskInstance.values[field.name];
    if (defaultValue) {
      fieldDefaults[field.name] = {
        isDisabled: false,
        value: defaultValue,
      };
    }
  });

  const operation: ProdActions.Operation = {
    path: '',
    prefilledArgs: {
      ...fieldDefaults,
      priority: { isDisabled: true, value: workbinTaskDefinition?.priority },
      sopLink: { isDisabled: true, value: workbinTaskDefinition?.sopLink },
    },
  };

  const action: ProdActions.ActionModel = {
    name: workbinTaskDefinition?.title,
    description: `${workbinTaskDefinition?.description} [SOP link](${workbinTaskDefinition?.sopLink})`,
    fields: workbinTaskDefinitionFields,
  };

  function serialize(values: any): SumbitPayload {
    const fieldValues = {};
    const fieldNames = workbinTaskDefinition.fields.map(field => field.name);
    Object.keys(values).forEach(key => {
      if (fieldNames.includes(key)) {
        fieldValues[key] = values[key];
      }
    });

    const isSkipped = values.skip === 'yes';

    return {
      workbinTaskDefinitionId: workbinTaskDefinition.id,
      workbinTaskInstanceId: isUpdating && workbinTaskInstance?.id ? workbinTaskInstance.id : undefined,
      workbin: workbin,
      completer: isSkipped ? state.currentUser.username : values.completer,
      description: workbinTaskInstance?.description || workbinTaskDefinition?.description || '',
      status: isSkipped ? 'SKIPPED' : 'COMPLETED',
      values: isSkipped ? undefined : fieldValues,
      comment: values.comment,
      resultForPassFailCheck: values.resultForPassFailCheck == 'yes' ? true : false,
    };
  }

  const formGen = useGenerateFormGenConfigFromActionModel({
    action,
    operation,
    serialize,
    createEndpoint: '/api/production/workspaces/create-workbin-instance',
    updateEndpoint: '/api/production/workspaces/update-workbin-instance',
  });

  // allow user to marked the task as "SKIPPED"
  const skipTask: FormGen.FieldSelect = {
    type: 'Select',
    name: 'skip',
    label: 'Skip Task?',
    default: 'no',
    options: ['yes', 'no'],
    validate: yup.string().required(),
    // for two cases, hide the skip field and use default value 'no':
    // 1. creating a new instance task via "Common Workbin Tasks & Actions" - since these are user initiated tasks they do not
    // make sense to allow skipping. in this cases "isUpdating" will be false.
    // 2. when task is created by "FarmOS" (as indicated by task definition field "definitionCreatedByInternalService" is true).
    inputContainerStyle: {
      display: !isUpdating || workbinTaskDefinition?.definitionCreatedByInternalService ? 'none' : 'initial',
    },
  };

  const notesField: FormGen.FieldTextField = {
    type: 'TextField',
    label: 'Notes',
    name: 'comment',
    validate: yup.string().when('skip', {
      is: 'yes',
      then: yup.string().required(),
      otherwise: yup.string(),
    }),
    textFieldProps: {
      variant: 'outlined',
      multiline: true,
      minRows: 4,
    },
  };

  const matchingWorkspace = workspaces?.find(workspace => workspace.role === workbin);

  // if not skipping, then these fields are shown and notes is not mandatory
  const fieldsWhenNotSkippingTask: FormGen.FieldIf = {
    type: 'if',
    if: when(['skip'], skip => skip === 'no'),
    fields: [
      ...(formGen.fields as FormGen.Field[]),
      {
        type: 'AutocompleteUser',
        farmPath: state.currentUser.currentFarmDefPath,
        roles: [PRODUCTION_LEAD_ROLE_NAME, matchingWorkspace?.userStoreRoleName],
        label: 'Completer',
        name: 'completer',
        default: state.currentUser.username,
        validate: yup.string().required(),
      },
    ],
  };

  // update the formgen config with new fields to supporting skipping.
  formGen.fields = [];

  if (workbinTaskInstance?.description) {
    const instanceDescription: FormGen.FieldTypography = {
      type: 'Typography',
      name: 'instance-description',
      label: workbinTaskInstance?.description,
    };
    formGen.fields.push(instanceDescription);
  }

  formGen.fields.push(skipTask, notesField, fieldsWhenNotSkippingTask);

  if (workbinTaskDefinition?.hasPassFailCheck) {
    formGen.fields.push({
      type: 'Select',
      name: 'resultForPassFailCheck',
      label: 'Passed?',
      default: 'yes',
      options: ['yes', 'no'],
      validate: yup.string().required(),
    });
  }

  return formGen;
}
