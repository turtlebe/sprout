import { ReactorStateReturnType } from '../types';

export const mockReactorStateReturnValue: ReactorStateReturnType = {
  state: {
    activeTask: {
      id: 'd8630544-f631-47c7-b513-9ed9774f8d57',
      lock: null,
      submitter: null,
      taskParams: {
        entry: [
          {
            crop: 'WHR',
            numberOfTrays: 1,
          },
        ],
      },
      type: 'SeedTraysAndLoadToTableTask',
    },
    activeTasks: {
      'd8630544-f631-47c7-b513-9ed9774f8d57': {
        id: 'd8630544-f631-47c7-b513-9ed9774f8d57',
        lock: null,
        submitter: null,
        taskParams: {
          entry: [
            {
              crop: 'WHR',
              numberOfTrays: 1,
            },
          ],
        },
        type: 'SeedTraysAndLoadToTableTask',
      },
      'd8630544-f631-47c7-b513-9ed9774f8d58': {
        id: 'd8630544-f631-47c7-b513-9ed9774f8d57',
        lock: null,
        submitter: null,
        taskParams: {
          entry: [
            {
              crop: 'WHR',
              numberOfTrays: 1,
            },
          ],
        },
        type: 'SeedTraysAndLoadToTableTask',
      },
    },
    cachedTells: {},
    cleanTrayConveyanceState: null,
    completedTasksAwaitingConfirmation: {},
    currentCropBeingSeeded: 'WHR',
    currentGoalTraysToSeed: 1,
    lastPublishedInstant: 1629388837.06404,
    lockInfo: null,
    memoizedNodeStatuses: {
      'GetSeededTraysToTableForCropTask dispatcher node.': 'SUCCESS',
      'Remember finishing subtask with id=548e8c88-e874-4126-ad05-873f11631da8': 'FAILURE',
    },
    path: 'Requests',
    seededTrayConveyanceState: null,
    seederState: null,
    serialOfTableReadyToBeLoaded: null,
    statusOfLastActCycle: 'RUNNING',
    statusesForPreviouslyCompletedTasks: {},
    subTaskIdsForNodeName: {
      'GetSeededTraysToTableForCropTask dispatcher node.': '548e8c88-e874-4126-ad05-873f11631da8',
    },
    subTasksExecutionStatus: {
      '548e8c88-e874-4126-ad05-873f11631da8': 'RUNNING',
    },
    subTasksExecutorsPaths: {
      '548e8c88-e874-4126-ad05-873f11631da8':
        'sites/LAX1/areas/TrayAutomation/lines/TrayProcessing/machines/SeederController',
    },
    successfullySeededTraysPerCropAtTable: [],
    totalGoalTraysToBeLoaded: 1,
    trace: {
      childNodes: [
        {
          childNodes: [],
          description: null,
          name: 'UnknownNodeType',
          status: null,
        },
        {
          childNodes: [],
          description: null,
          name: 'UnknownNodeType',
          status: null,
        },
        {
          childNodes: [
            {
              childNodes: [
                {
                  childNodes: [
                    {
                      childNodes: [
                        {
                          childNodes: [
                            {
                              childNodes: [
                                {
                                  childNodes: [],
                                  description: 'DispatchTask',
                                  name: 'DispatchTask',
                                  status: { status: 'SUCCESS', description: '' },
                                },
                                {
                                  childNodes: [],
                                  description: 'AwaitTaskCompleted',
                                  name: 'AwaitTaskCompleted',
                                  status: { status: 'RUNNING', description: '' },
                                },
                              ],
                              description: 'Sequence',
                              name: 'Sequence',
                              status: { status: 'RUNNING', description: '' },
                            },
                          ],
                          description: 'GetSeededTraysToTableForCropTask dispatcher node.',
                          name: 'GetSeededTraysToTableForCropTask dispatcher node.',
                          status: { status: 'RUNNING', description: '' },
                        },
                      ],
                      description: 'Waiting to process GetSeededTraysToTableForCropTask with Optional[1] with crop WHR',
                      name: 'Timeout',
                      status: { status: 'FAILURE', description: '' },
                    },
                    {
                      childNodes: [],
                      description: null,
                      name: 'UnknownNodeType',
                      status: null,
                    },
                    {
                      childNodes: [],
                      description: null,
                      name: 'UnknownNodeType',
                      status: null,
                    },
                  ],
                  description: 'Branch',
                  name: 'Branch',
                  status: { status: 'SUCCESS', description: '' },
                },
              ],
              description: 'Sequence',
              name: 'Sequence',
              status: { status: 'SUCCESS', description: '' },
            },
            {
              childNodes: [],
              description: null,
              name: 'UnknownNodeType',
              status: null,
            },
          ],
          description: 'Parallel',
          name: 'Parallel',
          status: { status: 'RUNNING', description: '' },
        },
        {
          childNodes: [],
          description: 'Timeout',
          name: 'Timeout',
          status: null,
        },
        {
          childNodes: [],
          description: 'Load trays to table subtask',
          name: 'Load trays to table subtask',
          status: null,
        },
      ],
      description: 'Sequence',
      name: 'Sequence',
      status: { status: 'RUNNING', description: '' },
    },
    traysLoadedToTableSoFar: 0,
    traysSuccessfullySeededForCrop: 0,
    workingSetOfTasks: {},
  },
};
