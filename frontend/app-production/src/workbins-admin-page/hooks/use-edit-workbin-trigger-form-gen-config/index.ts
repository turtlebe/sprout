import { PartialColDefs, TooltipColumnDescription } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';
import * as yup from 'yup';

import { useLoadWorkbinTaskDefinitions } from '../../../common/hooks';
import { WorkbinTaskTrigger } from '../../../common/types/workspace';

export interface UseEditWorkbinTriggerFormGenConfigReturn {
  config: FormGen.Config;
  isLoadingDefinitions: boolean;
}

export interface EditWorkbinTriggerFormikValues {
  groupId: string;
  groupName: string;
  workbin: string;
  description: string;
  ordering: FormGen.ValueLabel[];
}

const taskWorkbinGroupColDef: PartialColDefs = {
  groupId: {
    headerName: 'ID',
    field: 'groupId',
    colId: 'groupId',
    headerTooltip: 'The id of the trigger, auto generated upon creation.',
  },
  groupName: {
    headerName: 'Name',
    field: 'groupName',
    colId: 'groupName',
    headerTooltip:
      'A unique name per workbin, used so services can identify all definitions belonging to a type by the name.',
  },
  workbin: {
    headerName: 'Workbin',
    field: 'workbin',
    colId: 'workbin',
    headerTooltip: 'Which workbin does this group belong to.',
  },
  description: {
    headerName: 'Description',
    field: 'description',
    colId: 'description',
    headerTooltip: 'More information about the purpose of the group (if any).',
  },
  ordering: {
    headerName: 'Ordering',
    field: 'ordering',
    colId: 'ordering',
    headerTooltip: 'What is the ordering of task definitions in this trigger.',
  },
};

function groupOrderingToList(ordering: object): string[] {
  const entriesList = [];
  for (const [orderingValue, workbinDefinitionId] of Object.entries(ordering)) {
    entriesList.push({ id: workbinDefinitionId, order: parseInt(orderingValue) });
  }

  return entriesList.sort((a, b) => a['order'] - b['order']).map(value => value['id']);
}

function listToGroupOrdering(orderList: FormGen.ValueLabel[] = []): object {
  const orderingMap = {};
  orderList.forEach((value, index) => {
    orderingMap[index + 1] = value.value;
  });
  return orderingMap;
}

export function useEditWorkbinTriggerFormGenConfig(
  workbinGroup: WorkbinTaskTrigger,
  isUpdating: boolean
): UseEditWorkbinTriggerFormGenConfigReturn {
  const [coreState] = useCoreStore();
  const { loadData, workbinTaskDefinitions, isLoading } = useLoadWorkbinTaskDefinitions();

  const definitionFilter = {
    farm: coreState.currentUser.currentFarmDefPath,
    definitionCreatedByInternalService: false,
  };
  if (workbinGroup.workbin) {
    definitionFilter['workbin'] = workbinGroup.workbin;
  }
  const initialDefinitionsForGroup = groupOrderingToList(workbinGroup.ordering);
  React.useEffect(() => {
    loadData(definitionFilter);
  }, [coreState.currentUser.currentFarmDefPath]);

  return {
    config: {
      title: isUpdating ? 'Edit Workbin Trigger' : 'Create New Workbin Trigger',
      permissions: {
        create: { resource: Resources.HYP_PRODUCTION, level: PermissionLevels.FULL },
        update: { resource: Resources.HYP_PRODUCTION, level: PermissionLevels.FULL },
      },
      serialize: (formValues: EditWorkbinTriggerFormikValues): Omit<WorkbinTaskTrigger, 'createdAt' | 'updatedAt'> => {
        return {
          groupId: workbinGroup.groupId,
          groupName: formValues.groupName,
          farm: coreState.currentUser.currentFarmDefPath,
          workbin: formValues.workbin,
          description: formValues.description,
          ordering: listToGroupOrdering(formValues.ordering),
        };
      },
      // TODO: SD-15775 This endpoint should really be 'upsert-workbin-task-group' but
      // for now this is what it's named in PUP
      createEndpoint: '/api/plentyservice/workbin-service/create-workbin-task-group',
      updateEndpoint: '/api/plentyservice/workbin-service/create-workbin-task-group',
      context: { tableCols: taskWorkbinGroupColDef },
      fields: [
        {
          type: 'TextField',
          name: 'groupName',
          label: 'Name',
          default: isUpdating ? workbinGroup.groupName : undefined,
          textFieldProps: { disabled: isUpdating },
          validate: yup.string().required(),
          tooltip: TooltipColumnDescription,
        },
        {
          type: 'TextField',
          name: 'workbin',
          label: 'Workbin',
          default: workbinGroup.workbin,
          textFieldProps: { disabled: true },
          tooltip: TooltipColumnDescription,
        },
        {
          type: 'TextField',
          name: 'description',
          label: 'Description',
          default: workbinGroup.description,
          tooltip: TooltipColumnDescription,
          textFieldProps: {
            variant: 'outlined',
            multiline: true,
            minRows: 4,
          },
        },
        {
          type: 'AutocompleteMultipleDndOrdering',
          name: 'ordering',
          label: 'Ordering',
          default: JSON.stringify(workbinGroup.ordering),
          tooltip: TooltipColumnDescription,
          addNewOptionText: 'Choose new Workbin task to add ...',
          options: isLoading
            ? []
            : workbinTaskDefinitions
                .filter(value => workbinGroup.workbin === null || value.workbins.includes(workbinGroup.workbin))
                .map(definition => {
                  return { value: definition.id, label: definition.shortTitle };
                }),
          selected: isLoading
            ? []
            : workbinTaskDefinitions
                .filter(definition => initialDefinitionsForGroup.includes(definition.id))
                .sort((a, b) => {
                  return initialDefinitionsForGroup.indexOf(a.id) - initialDefinitionsForGroup.indexOf(b.id);
                })
                .map(definition => definition.shortTitle),
        },
      ],
    },
    isLoadingDefinitions: isLoading,
  };
}
