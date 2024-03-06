import { ReactorStateReturnType } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/types';

// portion of reactor state for testing action modules: sites/LAX1/areas/TowerAutomation/lines/TransferConveyance
export const mockReactorState: ReactorStateReturnType = {
  state: {
    buffersStates: {
      bufferPathToBufferStateMap: {
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1': {
          bufferOutflowPaused: false,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1',
          carrierIds: [1, 13, 16, 19],
          goalCount: 5,
          outflowPausable: true,
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer2': {
          bufferOutflowPaused: false,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer2',
          carrierIds: [],
          outflowPausable: true,
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer': {
          bufferOutflowPaused: true,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer',
          carrierIds: [],
          outflowPausable: false,
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/EmptyCarrierBuffer': {
          bufferOutflowPaused: false,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/EmptyCarrierBuffer',
          carrierIds: [],
          outflowPausable: true,
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/MaintenanceBuffer': {
          bufferOutflowPaused: false,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/MaintenanceBuffer',
          carrierIds: [],
          outflowPausable: false,
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PHCarrierBuffer': {
          bufferOutflowPaused: false,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PHCarrierBuffer',
          carrierIds: [],
          outflowPausable: false,
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PreInspectionBuffer': {
          bufferOutflowPaused: false,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PreInspectionBuffer',
          carrierIds: [],
          outflowPausable: true,
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer': {
          bufferOutflowPaused: false,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer',
          carrierIds: [],
          outflowPausable: true,
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/SeedlingBuffer': {
          bufferOutflowPaused: true,
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/SeedlingBuffer',
          carrierIds: [1],
          outflowPausable: true,
        },
      },
    },
    carrierSerialsAllowedForRoutingPathOverride: [],
    completedTasksAwaitingConfirmation: {},
    emptyCarriersAtPreHarvestLanesManagementEnabled: false,
    lastPublishedInstant: 1682545201.792802,
    lingeringCarriersManagementEnabled: false,
    maxNumberOfCarriersToBeRoutedWithPickupRobotRouting: 0,
    maybeCarrierAtPickupRobotForRouting: null,
    maybeLastCarrierSerialDefaultRoutedFromPickupRobot: null,
    maybePickupRobotRoutingDestinationOverride: null,
    numberOfCarriersRoutedSincePickupRobotRoutingLastEnabled: 0,
    openWorkbinTaskIds: {},
    overrideRoutingTableConditions: {
      GR1_1A: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
      GR1_1B: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING',
      GR3_1A: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING',
      GR3_2A: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING',
    },
    overrideRoutingTableFinalDestinations: {
      GR1_1A: 'GR1_1B',
      GR1_1B: 'PRE_HARVEST_1',
      GR3_1A: 'GR3_1B',
      GR3_2A: 'GR3_2B',
    },
    path: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
    pickupRobotRoutingEnabled: true,
    preHarvestBufferFlowRoutingEnabled: false,
    routingPathOverrideEnabled: true,
    statusOfLastActCycle: {
      description: null,
      status: 'RUNNING',
    },
    statusesForPreviouslyCompletedTasks: {},
    transferConveyanceBehaviorExecutionMode: 'DO_NOT_EXECUTE_DEFAULT_BEHAVIORS',
  },
};

export const mockPreHarvestReactorState: ReactorStateReturnType = {
  state: {
    activeTask: null,
    activeTasks: {},
    awaitTellFromCameraGatewayPeriodInSeconds: 15,
    cachedTells: {},
    completedTasksAwaitingConfirmation: {},
    lastPublishedInstant: 1685507554.8123753,
    lockInfo: null,
    memoizedNodeStatuses: {},
    openWorkbinTaskIds: {},
    path: 'sites/LAX1/areas/VerticalGrow/lines/PreHarvest/machines/PreHarvestInspection',
    preHarvestInspectionDefaultBehaviorFeatureFlags: {
      routeTowersAfterInspection: false,
    },
    preHarvestInspectionRoutingMode: 'ROUTE_TO_PRE_HARVEST_LANE_2',
    recentImageCapturedTowerSerial: null,
    recentModelProcessedTowerSerial: null,
    serialOfLastImagedTower: null,
    statusOfLastActCycle: {
      description: 'PreHarvest Inspection Routing is NOT enabled.; NOT ticking behavior tree.',
      status: 'RUNNING',
    },
    statusesForPreviouslyCompletedTasks: {},
    subTaskIdsForNodeName: {},
    subTasksExecutionStatus: {},
    subTasksExecutorsPaths: {},
    trace: {
      childNodes: [
        {
          childNodes: [
            {
              childNodes: [],
              description: null,
              name: 'WaitForCondition',
              status: {
                description: 'PreHarvest Inspection Routing is NOT enabled.; NOT ticking behavior tree.',
                status: 'RUNNING',
              },
            },
            {
              childNodes: [],
              description: null,
              name: 'WaitForCondition',
              status: null,
            },
            {
              childNodes: [],
              description: null,
              name: 'WaitForCondition',
              status: null,
            },
            {
              childNodes: [],
              description: null,
              name: 'WaitForCondition',
              status: null,
            },
            {
              childNodes: [],
              description: null,
              name: 'WaitForCondition',
              status: null,
            },
            {
              childNodes: [],
              description: null,
              name: 'Branch',
              status: null,
            },
          ],
          description: null,
          name: 'Sequence',
          status: {
            description: 'PreHarvest Inspection Routing is NOT enabled.; NOT ticking behavior tree.',
            status: 'RUNNING',
          },
        },
        {
          childNodes: [],
          description: null,
          name: 'UnknownNodeType',
          status: null,
        },
      ],
      description: null,
      name: 'Sequence',
      status: {
        description: 'PreHarvest Inspection Routing is NOT enabled.; NOT ticking behavior tree.',
        status: 'RUNNING',
      },
    },
  },
};
