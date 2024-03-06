import { DurativeTaskState, SummaryStatus, TaskStatus } from '../../common/types';
export const mockLeafTasks: DurativeTaskState[] = [
  {
    taskStatus: TaskStatus.RUNNING,
    statusOfLastActCycle: { status: SummaryStatus.RUNNING, description: '' },
    subtaskIds: [],
    summary: [{ status: SummaryStatus.RUNNING, description: '10/50 Trays of WHC seeded' }],
    createdAt: 1638205723.712311,
    taskInstance: {
      id: '170ea918-92df-45f0-a124-c4593b0cc1dd',
      type: 'unknown',
      displayTitle: 'GetSeededTraysToTable',
    },
    executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
  },
  {
    taskStatus: TaskStatus.RUNNING,
    statusOfLastActCycle: { status: SummaryStatus.RUNNING, description: '' },
    subtaskIds: [],
    summary: [{ status: SummaryStatus.RUNNING, description: '10/50 Trays of WHC seeded' }],
    createdAt: 1638205723.712311,
    taskInstance: {
      id: 'cf38ecee-abde-4cbe-9562-09b1d8299bc8',
      type: 'unknown',
      displayTitle: 'LoadTraysIntoTable',
    },
    executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
  },
  {
    taskStatus: TaskStatus.COMPLETED,
    statusOfLastActCycle: { status: SummaryStatus.RUNNING, description: '' },
    subtaskIds: [],
    summary: [{ status: SummaryStatus.RUNNING, description: '10/50 Trays of WHC seeded' }],
    createdAt: 1638205723.712311,
    taskInstance: {
      id: '6423d6e5-3591-495f-8e12-415463ab1554',
      type: 'SubmitWorkbinTask',
      taskDetails: {
        id: 'winbin-instance-id',
        workbinTaskDefinitionId: 'defn-id',
        workbin: 'Seeder',
        completer: 'tester',
        status: 'NOT_STARTED',
        values: [],
        createdAt: '0',
        updatedAt: '0',
      },
      displayTitle: 'Move table to tray loader',
    },
    executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
  },
];
