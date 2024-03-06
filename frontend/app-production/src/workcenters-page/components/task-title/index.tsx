import React from 'react';

import { WorkcenterTaskDetailsResponse } from '../../../common/types';

import {
  BlendPackageAndPalletizeSkuTaskTitle,
  DefaultTaskTitle,
  LoadEmptiesToVerticalGrowTaskTitle,
  LoadTableIntoPropFromCleanTableStackTaskTitle,
  LoadTableIntoPropFromGermTaskTitle,
  PreparePropForProductionTaskTitle,
  SeedTraysAndLoadTableToGermTaskTitle,
  TransplantTowersAndLoadToVerticalGrowTaskTitle,
  UnloadTableFromPropAndSendToTransplanterTaskTitle,
  UnloadTowersFromVerticalGrowAndHarvestTaskTitle,
} from './components';
import { TaskTitleRendererProps } from './types';

const dataTestIds = {};

export { dataTestIds as dataTestIdsTaskTitle };

export interface TaskTitle {
  task: WorkcenterTaskDetailsResponse;
}

interface TaskTitleRendererMap {
  [workcenterName: string]: { [taskName: string]: React.FC<TaskTitleRendererProps> };
}

// provides a mapping from "workcenter" and "task" to component that will render the given task title.
const taskTitleRendererMap: TaskTitleRendererMap = {
  Harvest: {
    UnloadTowersFromVerticalGrowAndHarvest: UnloadTowersFromVerticalGrowAndHarvestTaskTitle,
  },

  Pack: {
    BlendPackageAndPalletizeSku: BlendPackageAndPalletizeSkuTaskTitle,
  },

  PropLoad: {
    LoadTableIntoPropFromCleanTableStack: LoadTableIntoPropFromCleanTableStackTaskTitle,
    LoadTableIntoPropFromGerm: LoadTableIntoPropFromGermTaskTitle,
  },

  PropUnload: {
    PreparePropForProduction: PreparePropForProductionTaskTitle,
    UnloadTableFromPropAndSendToTransplanter: UnloadTableFromPropAndSendToTransplanterTaskTitle,
  },

  Seed: {
    SeedTraysAndLoadTableToGerm: SeedTraysAndLoadTableToGermTaskTitle,
  },

  Transplant: {
    LoadEmptiesToVerticalGrow: LoadEmptiesToVerticalGrowTaskTitle,
    TransplantTowersAndLoadToVerticalGrow: TransplantTowersAndLoadToVerticalGrowTaskTitle,
  },
};

/**
 * Provides a renderer for the task title. It uses the task farm def path to find a matching render.
 * If one does not exist then the default renderer is used.
 */
export const TaskTitle: React.FC<TaskTitle> = ({ task }) => {
  const workcenterName = task?.taskDetails?.workcenter?.split('/').at(-1);
  const taskName = task?.taskDetails?.taskPath?.split('/').at(-1);

  const TaskTitleRenderer =
    taskTitleRendererMap[workcenterName] && taskTitleRendererMap[workcenterName][taskName]
      ? taskTitleRendererMap[workcenterName][taskName]
      : DefaultTaskTitle;

  return <TaskTitleRenderer task={task} />;
};
