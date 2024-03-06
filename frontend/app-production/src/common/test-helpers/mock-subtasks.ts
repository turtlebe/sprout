import { DurativeTaskState, SummaryStatus, TaskStatus } from '../../common/types';

export const mockSubtasks: DurativeTaskState[] = [
  {
    taskStatus: TaskStatus.RUNNING,
    statusOfLastActCycle: { status: SummaryStatus.RUNNING, description: null },
    subtaskIds: [],
    summary: [{ status: SummaryStatus.RUNNING, description: '10/50 Trays of WHC seeded' }],
    createdAt: 1638205723.712311,
    taskInstance: {
      id: '68067e7c-eb8c-4e18-ada9-53b200bcd0f0',
      type: 'unknown',
      displayTitle: 'SeedTraysAndLoadToTable',
    },
    executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
  },
  {
    taskStatus: TaskStatus.RUNNING,
    statusOfLastActCycle: { status: SummaryStatus.RUNNING, description: null },
    subtaskIds: [],
    summary: [{ status: SummaryStatus.RUNNING, description: '10/50 Trays of WHC seeded' }],
    createdAt: 1638205723.712311,
    taskInstance: {
      id: 'e2330a13-fb4e-484b-966d-82d3551b5201',
      type: 'unknown',
      displayTitle: 'MoveTableWithCrane',
    },
    executingReactorPath: 'sites/LAX1/farms/LAX1/workCenters/Seed',
  },
];
