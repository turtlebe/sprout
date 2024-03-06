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
const workcenter = 'sites/LAX1/farms/LAX1/workCenters/Pack';
const mockTasks: WorkcenterTaskDetailsResponse[] = [
  {
    taskDetails: {
      id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Pack/interfaces/Pack/methods/BlendPackageAndPalletizeSku',
      taskParametersJsonPayload: JSON.stringify({
        number_of_cases: 10,
        sku: { value: 'KC1Clamshell4o5oz' },
      }),
      workcenter,
      planId,
      title: 'BlendPackageAndPalletizeSkuTask',
    },
    executionDetails: {
      taskStatus: TaskStatus.CREATED,
      statusOfLastActCycle: undefined,
      summary: [],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Pack',
    },
  },
  {
    taskDetails: {
      id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
      taskPath: 'sites/LAX1/farms/LAX1/workCenters/Pack/interfaces/Pack/methods/BlendPackageAndPalletizeSku',
      taskParametersJsonPayload: JSON.stringify({
        number_of_cases: 10,
        sku: { value: 'KC1Clamshell4o5oz' },
      }),
      workcenter,
      planId,
      title: undefined,
    },
    executionDetails: {
      taskStatus: TaskStatus.CREATED,
      statusOfLastActCycle: undefined,
      summary: [],
      subtaskIds: [],
      createdAt: 1638205723.712311,
      taskInstance: {
        id: '1b2b2f9b-cbd1-477a-93de-5112acfd939c',
        type: 'mock',
        displayTitle: '???',
      },
      executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Pack',
    },
  },
];
const plan: WorkcenterPlan = {
  id: 'db353d3f-4846-481e-b2db-1e7269e97a71',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockTasks.map(task => task.taskDetails.id),
  status: PlanStatus.RUNNING,
  progress: 50,
  summary: [
    {
      status: SummaryStatus.RUNNING,
      description: 'Pack 25 cases of Sweet Sunrise Clamshell 4.5oz',
    },
  ],
};
export const mockPackWorkcenterPlan: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockTasks,
};
