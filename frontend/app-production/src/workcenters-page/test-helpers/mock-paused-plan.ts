import {
  PlanStatus,
  SummaryStatus,
  TaskStatus,
  WorkcenterPlan,
  WorkcenterPlanResponse,
  WorkcenterTaskDetailsResponse,
} from '../../common/types';
import { getDateFormat } from '../../common/utils';

const today = new Date();
const todayDate = getDateFormat(today);

const planId = '02ff1dc7-ade1-48be-94e0-521d85f36539';
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/PropLoad';
const mockTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:YW97-3K02-0U',
        germ_stack_path: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack7',
        prop_level_path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
      }),
      workcenter,
      planId,
      title: 'Move table of WHC from Germ Stack 1 to Prop Level 3',
    },
    executionDetails: {
      taskStatus: TaskStatus.COMPLETED,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.SUCCESS,
          description: 'Table moved',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1c18babd-e0b8-4cdb-919d-dc9581c8edfb',
        type: 'mock',
        displayTitle: 'Move table of WHC from Germ Stack 1 to Prop Level 3',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
    },
  },
  {
    taskDetails: {
      id: 'b3070b29-67a7-4800-bad1-8de09d0247a4',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromGerm',
      taskParametersJsonPayload: JSON.stringify({
        table_serial: 'P900-0008046A:YW97-3K02-0U',
        germ_stack_path: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack7',
        prop_level_path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel1',
      }),
      workcenter,
      planId,
      title: 'Move table of B11 from Germ Stack 2 to Prop Level 4',
    },
    executionDetails: {
      taskStatus: TaskStatus.FAILED,
      statusOfLastActCycle: undefined,
      summary: [
        {
          status: SummaryStatus.FAILURE,
          description: 'Move failed',
        },
      ],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: 'b3070b29-67a7-4800-bad1-8de09d0247a4',
        type: 'mock',
        displayTitle: 'Move table of B11 from Germ Stack 2 to Prop Level 4',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
    },
  },
];
const plan: WorkcenterPlan = {
  id: '8308ef64-ddf3-415b-9b38-36a0b4cd3ee0',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockTasks.map(task => task.taskDetails.id),
  status: PlanStatus.PAUSED,
  progress: 50,
  summary: [
    {
      status: SummaryStatus.SUCCESS,
      description: 'Table of WHC moved',
    },
    {
      status: SummaryStatus.FAILURE,
      description: 'Table of B11 failed to move',
    },
  ],
};
export const mockPropLoadPausedPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
