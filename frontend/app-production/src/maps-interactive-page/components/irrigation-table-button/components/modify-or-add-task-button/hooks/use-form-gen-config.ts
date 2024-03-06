import { TaskType } from '@plentyag/app-production/src/maps-interactive-page/types';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import * as yup from 'yup';

import { irrigationFlowRate } from '../../../constants';
import { IrrigationTaskTableRowData } from '../../../types';

export interface UseFormGenConfig {
  rowData: IrrigationTaskTableRowData;
  isUpdating: boolean;
}

export const useFormGenConfig = ({ rowData, isUpdating }: UseFormGenConfig): FormGen.Config => {
  return {
    title: `${isUpdating ? 'Modify' : 'Add'} Task`,
    subtitle: `Note: ${irrigationFlowRate}.`,
    createEndpoint: '/api/plentyservice/executive-service/create-irrigation-task',
    updateEndpoint: `/api/plentyservice/executive-service/update-irrigation-task/${rowData.id}`,
    serialize: values => {
      const site = getKindFromPath(rowData.rackPath, 'sites');
      const area = getKindFromPath(rowData.rackPath, 'areas');
      const line = getKindFromPath(rowData.rackPath, 'lines');
      const rackPath = `sites/${site}/areas/${area}/lines/${line}`;

      const modifiedValues = {
        plannedVolume: values.volume,
        plannedDate: rowData.irrigationDate.toISOString(),
        lotName: rowData.lotName,
        tableSerial: rowData.tableSerial,
        rackPath,
      };

      if (isUpdating) {
        return modifiedValues;
      }

      // else creating...when creating a new task must also provide task type.
      return { ...modifiedValues, taskType: TaskType.MANUAL };
    },
    fields: [
      {
        type: 'TextField',
        name: 'volume',
        label: 'Volume',
        default: typeof rowData.plannedVolume === 'number' ? rowData.plannedVolume : undefined,
        validate: yup.number().moreThan(0).required().nullable(),
        textFieldProps: { type: 'number' },
      },
    ],
    permissions: {
      create: { resource: Resources.HYP_PRODUCTION, level: PermissionLevels.EDIT },
      update: { resource: Resources.HYP_PRODUCTION, level: PermissionLevels.EDIT },
    },
  };
};
