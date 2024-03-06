import { ReactorStateReturnType } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/types';

export const mockTransferConveyanceReactorState: ReactorStateReturnType = {
  state: {
    activeTask: null,
    activeTasks: {},
    bufferManagementEnabled: false,
    buffersStates: {
      bufferPathToBufferStateMap: {
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1': {
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1',
          carrierIds: [],
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer2': {
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer2',
          carrierIds: [],
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer': {
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer',
          carrierIds: [],
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/EmptyCarrierBuffer': {
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/EmptyCarrierBuffer',
          carrierIds: [],
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/MaintenanceBuffer': {
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/MaintenanceBuffer',
          carrierIds: [],
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PHCarrierBuffer': {
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PHCarrierBuffer',
          carrierIds: [],
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer': {
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer',
          carrierIds: [],
        },
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/SeedlingBuffer': {
          bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/SeedlingBuffer',
          carrierIds: [],
        },
      },
    },
    cachedTells: {
      '06137a7e-7703-4257-812b-061a908f7cca': 1678097640.4571028,
      '685f06f1-a0b3-45db-9f8d-5f62ab397888': 1678097571.437148,
    },
    carrierSerialsAllowedForRoutingPathOverride: [],
    completedTasksAwaitingConfirmation: {},
    emptyCarriersAtPreHarvestLanesManagementEnabled: false,
    lastPublishedInstant: 1678384431.532364,
    lingeringCarriersManagementEnabled: false,
    lingeringCarriersMapImpl: {
      map: {
        '13': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.359153,
              taskId: 'b2464d50-7eec-47b7-976a-5a88b1fd5077',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-009-806',
          maybeZone: null,
          startedLingeringAt: 1667266273.042153,
        },
        '14': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.310153,
              taskId: '7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-009-901',
          maybeZone: null,
          startedLingeringAt: 1667266273.043153,
        },
        '25': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.261153,
              taskId: 'df9ae778-b85b-4e72-b339-ef791357c1a9',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-010-130',
          maybeZone: null,
          startedLingeringAt: 1667266273.044153,
        },
        '3': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.463153,
              taskId: '435639c4-1669-4485-872b-467d37c46464',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-009-651',
          maybeZone: null,
          startedLingeringAt: 1667266273.043153,
        },
        '39': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.092153,
              taskId: 'df9d4d75-34b4-4d69-a4df-30408f6ffa70',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-009-979',
          maybeZone: null,
          startedLingeringAt: 1667266273.044153,
        },
        '64': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.399153,
              taskId: 'c8618884-087d-4ebb-bf33-6a6fb88e0d04',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-009-944',
          maybeZone: null,
          startedLingeringAt: 1667266273.044153,
        },
        '70': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.197153,
              taskId: '7ca541d5-e98e-4cb8-a521-1188caa4f64c',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-009-948',
          maybeZone: null,
          startedLingeringAt: 1667266273.044153,
        },
        '81': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.573153,
              taskId: 'cab18d19-1ce5-4035-9ad8-9cee19cfe479',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-009-899',
          maybeZone: null,
          startedLingeringAt: 1667266273.033153,
        },
        '84': {
          locationPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          maybeLingeringCarrierResolutionTaskDetails: {
            dehydratedWorkbinTaskDispatcher: {
              lastWorkbinTaskTickStatus: {
                description: null,
                status: 'RUNNING',
              },
              lastWorkbinTaskTickTime: 1667266333.638153,
              taskId: '149c9ac3-518a-42af-a1c6-eb0900ace476',
            },
          },
          maybeTowerSerial: '800-00011957:TOW:000-009-910',
          maybeZone: null,
          startedLingeringAt: 1667266273.043153,
        },
      },
    },
    lockInfo: null,
    maxNumberOfCarriersToBeRoutedWithPickupRobotRouting: 0,
    maybeLastCarrierSerialDefaultRoutedFromPickupRobot: null,
    maybePickupRobotRoutingDestinationOverride: null,
    memoizedNodeStatuses: {
      'LingeringCarrierWorkbinTask_CARRIER_13_SERIAL_800-00011957:TOW:000-009-806_d84f4450-70a3-4fb4-b4a6-7dd82dbb87ef':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=b2464d50-7eec-47b7-976a-5a88b1fd5077, displayTitle=SubmitWorkbinTask id=b2464d50-7eec-47b7-976a-5a88b1fd5077, taskDetails=WorkbinTaskInstance{id=b2464d50-7eec-47b7-976a-5a88b1fd5077, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 13, containing tower 800-00011957:TOW:000-009-806 (which has status IN_USE and contains material d84f4450-70a3-4fb4-b4a6-7dd82dbb87ef (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.359153Z, updatedAt=2022-11-01T01:32:13.359153Z, resultForPassFailCheck=false}} with id b2464d50-7eec-47b7-976a-5a88b1fd5077",
          status: 'SUCCESS',
        },
      'LingeringCarrierWorkbinTask_CARRIER_14_SERIAL_800-00011957:TOW:000-009-901_9c4e73b8-6896-4bdf-b601-2bd603a87510':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7, displayTitle=SubmitWorkbinTask id=7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7, taskDetails=WorkbinTaskInstance{id=7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 14, containing tower 800-00011957:TOW:000-009-901 (which has status IN_USE and contains material 9c4e73b8-6896-4bdf-b601-2bd603a87510 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.310153Z, updatedAt=2022-11-01T01:32:13.310153Z, resultForPassFailCheck=false}} with id 7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7",
          status: 'SUCCESS',
        },
      'LingeringCarrierWorkbinTask_CARRIER_25_SERIAL_800-00011957:TOW:000-010-130_09a8bede-e03a-42f2-ab36-8d65c81aeeaf':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=df9ae778-b85b-4e72-b339-ef791357c1a9, displayTitle=SubmitWorkbinTask id=df9ae778-b85b-4e72-b339-ef791357c1a9, taskDetails=WorkbinTaskInstance{id=df9ae778-b85b-4e72-b339-ef791357c1a9, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 25, containing tower 800-00011957:TOW:000-010-130 (which has status IN_USE and contains material 09a8bede-e03a-42f2-ab36-8d65c81aeeaf (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.261153Z, updatedAt=2022-11-01T01:32:13.261153Z, resultForPassFailCheck=false}} with id df9ae778-b85b-4e72-b339-ef791357c1a9",
          status: 'SUCCESS',
        },
      'LingeringCarrierWorkbinTask_CARRIER_39_SERIAL_800-00011957:TOW:000-009-979_21d8891d-735a-4043-8e05-917407284771':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=df9d4d75-34b4-4d69-a4df-30408f6ffa70, displayTitle=SubmitWorkbinTask id=df9d4d75-34b4-4d69-a4df-30408f6ffa70, taskDetails=WorkbinTaskInstance{id=df9d4d75-34b4-4d69-a4df-30408f6ffa70, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 39, containing tower 800-00011957:TOW:000-009-979 (which has status IN_USE and contains material 21d8891d-735a-4043-8e05-917407284771 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.092153Z, updatedAt=2022-11-01T01:32:13.092153Z, resultForPassFailCheck=false}} with id df9d4d75-34b4-4d69-a4df-30408f6ffa70",
          status: 'SUCCESS',
        },
      'LingeringCarrierWorkbinTask_CARRIER_3_SERIAL_800-00011957:TOW:000-009-651_6191143e-83b5-44f1-9a09-a4e1283fd330':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=435639c4-1669-4485-872b-467d37c46464, displayTitle=SubmitWorkbinTask id=435639c4-1669-4485-872b-467d37c46464, taskDetails=WorkbinTaskInstance{id=435639c4-1669-4485-872b-467d37c46464, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 3, containing tower 800-00011957:TOW:000-009-651 (which has status IN_USE and contains material 6191143e-83b5-44f1-9a09-a4e1283fd330 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.463153Z, updatedAt=2022-11-01T01:32:13.463153Z, resultForPassFailCheck=false}} with id 435639c4-1669-4485-872b-467d37c46464",
          status: 'SUCCESS',
        },
      'LingeringCarrierWorkbinTask_CARRIER_64_SERIAL_800-00011957:TOW:000-009-944_3976c13d-21af-4fce-afb4-8b3278bc1b99':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=c8618884-087d-4ebb-bf33-6a6fb88e0d04, displayTitle=SubmitWorkbinTask id=c8618884-087d-4ebb-bf33-6a6fb88e0d04, taskDetails=WorkbinTaskInstance{id=c8618884-087d-4ebb-bf33-6a6fb88e0d04, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 64, containing tower 800-00011957:TOW:000-009-944 (which has status IN_USE and contains material 3976c13d-21af-4fce-afb4-8b3278bc1b99 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.399153Z, updatedAt=2022-11-01T01:32:13.399153Z, resultForPassFailCheck=false}} with id c8618884-087d-4ebb-bf33-6a6fb88e0d04",
          status: 'SUCCESS',
        },
      'LingeringCarrierWorkbinTask_CARRIER_70_SERIAL_800-00011957:TOW:000-009-948_ca9a103c-e87b-4d22-b0b2-781677ff0856':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=7ca541d5-e98e-4cb8-a521-1188caa4f64c, displayTitle=SubmitWorkbinTask id=7ca541d5-e98e-4cb8-a521-1188caa4f64c, taskDetails=WorkbinTaskInstance{id=7ca541d5-e98e-4cb8-a521-1188caa4f64c, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 70, containing tower 800-00011957:TOW:000-009-948 (which has status IN_USE and contains material ca9a103c-e87b-4d22-b0b2-781677ff0856 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.197153Z, updatedAt=2022-11-01T01:32:13.197153Z, resultForPassFailCheck=false}} with id 7ca541d5-e98e-4cb8-a521-1188caa4f64c",
          status: 'SUCCESS',
        },
      'LingeringCarrierWorkbinTask_CARRIER_81_SERIAL_800-00011957:TOW:000-009-899_a835bf23-6016-45c2-b8ab-10fd91f06b29':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=cab18d19-1ce5-4035-9ad8-9cee19cfe479, displayTitle=SubmitWorkbinTask id=cab18d19-1ce5-4035-9ad8-9cee19cfe479, taskDetails=WorkbinTaskInstance{id=cab18d19-1ce5-4035-9ad8-9cee19cfe479, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 81, containing tower 800-00011957:TOW:000-009-899 (which has status IN_USE and contains material a835bf23-6016-45c2-b8ab-10fd91f06b29 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.573153Z, updatedAt=2022-11-01T01:32:13.573153Z, resultForPassFailCheck=false}} with id cab18d19-1ce5-4035-9ad8-9cee19cfe479",
          status: 'SUCCESS',
        },
      'LingeringCarrierWorkbinTask_CARRIER_84_SERIAL_800-00011957:TOW:000-009-910_42abbe88-c149-48ea-b9c2-71bd8ffd1528':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=149c9ac3-518a-42af-a1c6-eb0900ace476, displayTitle=SubmitWorkbinTask id=149c9ac3-518a-42af-a1c6-eb0900ace476, taskDetails=WorkbinTaskInstance{id=149c9ac3-518a-42af-a1c6-eb0900ace476, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 84, containing tower 800-00011957:TOW:000-009-910 (which has status IN_USE and contains material 42abbe88-c149-48ea-b9c2-71bd8ffd1528 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.638153Z, updatedAt=2022-11-01T01:32:13.638153Z, resultForPassFailCheck=false}} with id 149c9ac3-518a-42af-a1c6-eb0900ace476",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-13-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=b2464d50-7eec-47b7-976a-5a88b1fd5077, displayTitle=SubmitWorkbinTask id=b2464d50-7eec-47b7-976a-5a88b1fd5077, taskDetails=WorkbinTaskInstance{id=b2464d50-7eec-47b7-976a-5a88b1fd5077, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 13, containing tower 800-00011957:TOW:000-009-806 (which has status IN_USE and contains material d84f4450-70a3-4fb4-b4a6-7dd82dbb87ef (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.994037Z, updatedAt=2022-11-01T01:32:13.994037Z, resultForPassFailCheck=false}} with id b2464d50-7eec-47b7-976a-5a88b1fd5077",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-14-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7, displayTitle=SubmitWorkbinTask id=7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7, taskDetails=WorkbinTaskInstance{id=7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 14, containing tower 800-00011957:TOW:000-009-901 (which has status IN_USE and contains material 9c4e73b8-6896-4bdf-b601-2bd603a87510 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:14.036872Z, updatedAt=2022-11-01T01:32:14.036872Z, resultForPassFailCheck=false}} with id 7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-25-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=df9ae778-b85b-4e72-b339-ef791357c1a9, displayTitle=SubmitWorkbinTask id=df9ae778-b85b-4e72-b339-ef791357c1a9, taskDetails=WorkbinTaskInstance{id=df9ae778-b85b-4e72-b339-ef791357c1a9, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 25, containing tower 800-00011957:TOW:000-010-130 (which has status IN_USE and contains material 09a8bede-e03a-42f2-ab36-8d65c81aeeaf (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.837171Z, updatedAt=2022-11-01T01:32:13.837171Z, resultForPassFailCheck=false}} with id df9ae778-b85b-4e72-b339-ef791357c1a9",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-3-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=435639c4-1669-4485-872b-467d37c46464, displayTitle=SubmitWorkbinTask id=435639c4-1669-4485-872b-467d37c46464, taskDetails=WorkbinTaskInstance{id=435639c4-1669-4485-872b-467d37c46464, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 3, containing tower 800-00011957:TOW:000-009-651 (which has status IN_USE and contains material 6191143e-83b5-44f1-9a09-a4e1283fd330 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.795751Z, updatedAt=2022-11-01T01:32:13.795751Z, resultForPassFailCheck=false}} with id 435639c4-1669-4485-872b-467d37c46464",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-39-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=df9d4d75-34b4-4d69-a4df-30408f6ffa70, displayTitle=SubmitWorkbinTask id=df9d4d75-34b4-4d69-a4df-30408f6ffa70, taskDetails=WorkbinTaskInstance{id=df9d4d75-34b4-4d69-a4df-30408f6ffa70, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 39, containing tower 800-00011957:TOW:000-009-979 (which has status IN_USE and contains material 21d8891d-735a-4043-8e05-917407284771 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.874450Z, updatedAt=2022-11-01T01:32:13.874450Z, resultForPassFailCheck=false}} with id df9d4d75-34b4-4d69-a4df-30408f6ffa70",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-64-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=c8618884-087d-4ebb-bf33-6a6fb88e0d04, displayTitle=SubmitWorkbinTask id=c8618884-087d-4ebb-bf33-6a6fb88e0d04, taskDetails=WorkbinTaskInstance{id=c8618884-087d-4ebb-bf33-6a6fb88e0d04, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 64, containing tower 800-00011957:TOW:000-009-944 (which has status IN_USE and contains material 3976c13d-21af-4fce-afb4-8b3278bc1b99 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.953089Z, updatedAt=2022-11-01T01:32:13.953089Z, resultForPassFailCheck=false}} with id c8618884-087d-4ebb-bf33-6a6fb88e0d04",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-70-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=7ca541d5-e98e-4cb8-a521-1188caa4f64c, displayTitle=SubmitWorkbinTask id=7ca541d5-e98e-4cb8-a521-1188caa4f64c, taskDetails=WorkbinTaskInstance{id=7ca541d5-e98e-4cb8-a521-1188caa4f64c, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 70, containing tower 800-00011957:TOW:000-009-948 (which has status IN_USE and contains material ca9a103c-e87b-4d22-b0b2-781677ff0856 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.910320Z, updatedAt=2022-11-01T01:32:13.910320Z, resultForPassFailCheck=false}} with id 7ca541d5-e98e-4cb8-a521-1188caa4f64c",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-81-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=cab18d19-1ce5-4035-9ad8-9cee19cfe479, displayTitle=SubmitWorkbinTask id=cab18d19-1ce5-4035-9ad8-9cee19cfe479, taskDetails=WorkbinTaskInstance{id=cab18d19-1ce5-4035-9ad8-9cee19cfe479, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 81, containing tower 800-00011957:TOW:000-009-899 (which has status IN_USE and contains material a835bf23-6016-45c2-b8ab-10fd91f06b29 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.709185Z, updatedAt=2022-11-01T01:32:13.709185Z, resultForPassFailCheck=false}} with id cab18d19-1ce5-4035-9ad8-9cee19cfe479",
          status: 'SUCCESS',
        },
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-84-PotentiallyLingeringCarrierHandlerNode':
        {
          description:
            "Dispatched SubmitWorkbinTask{id=149c9ac3-518a-42af-a1c6-eb0900ace476, displayTitle=SubmitWorkbinTask id=149c9ac3-518a-42af-a1c6-eb0900ace476, taskDetails=WorkbinTaskInstance{id=149c9ac3-518a-42af-a1c6-eb0900ace476, workbinTaskDefinitionId=dd967972-95c8-4c7b-b44f-18d5260651ab, workbin=ProductionLead, completer=, status=NOT_STARTED, values={}, description=Carrier 84, containing tower 800-00011957:TOW:000-009-910 (which has status IN_USE and contains material 42abbe88-c149-48ea-b9c2-71bd8ffd1528 (which has status IN_USE)), is lingering at sites/LAX1/areas/TowerAutomation/lines/TransferConveyance.  Please manage this lingering tower by assigning it a destination and/or correcting it or it's container or material status., createdAt=2022-11-01T01:32:13.754074Z, updatedAt=2022-11-01T01:32:13.754074Z, resultForPassFailCheck=false}} with id 149c9ac3-518a-42af-a1c6-eb0900ace476",
          status: 'SUCCESS',
        },
    },
    numberOfCarriersRoutedSincePickupRobotRoutingLastEnabled: 0,
    openWorkbinTaskIds: {},
    overrideRoutingTableConditions: {
      GR1_1A: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
      GR1_1B: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING',
      GR1_3A: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING',
    },
    overrideRoutingTableFinalDestinations: {
      GR1_1A: 'GR1_1B',
      GR1_1B: 'GR1_2A',
      GR1_3A: 'GR1_3B',
    },
    path: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
    pickupRobotRoutingEnabled: false,
    preHarvestBufferFlowRoutingEnabled: false,
    routingPathOverrideEnabled: false,
    statusOfLastActCycle: {
      description: 'Parallel',
      status: 'RUNNING',
    },
    statusesForPreviouslyCompletedTasks: {},
    subTaskIdsForNodeName: {
      'LingeringCarrierWorkbinTask_CARRIER_13_SERIAL_800-00011957:TOW:000-009-806_d84f4450-70a3-4fb4-b4a6-7dd82dbb87ef':
        'b2464d50-7eec-47b7-976a-5a88b1fd5077',
      'LingeringCarrierWorkbinTask_CARRIER_14_SERIAL_800-00011957:TOW:000-009-901_9c4e73b8-6896-4bdf-b601-2bd603a87510':
        '7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7',
      'LingeringCarrierWorkbinTask_CARRIER_25_SERIAL_800-00011957:TOW:000-010-130_09a8bede-e03a-42f2-ab36-8d65c81aeeaf':
        'df9ae778-b85b-4e72-b339-ef791357c1a9',
      'LingeringCarrierWorkbinTask_CARRIER_39_SERIAL_800-00011957:TOW:000-009-979_21d8891d-735a-4043-8e05-917407284771':
        'df9d4d75-34b4-4d69-a4df-30408f6ffa70',
      'LingeringCarrierWorkbinTask_CARRIER_3_SERIAL_800-00011957:TOW:000-009-651_6191143e-83b5-44f1-9a09-a4e1283fd330':
        '435639c4-1669-4485-872b-467d37c46464',
      'LingeringCarrierWorkbinTask_CARRIER_64_SERIAL_800-00011957:TOW:000-009-944_3976c13d-21af-4fce-afb4-8b3278bc1b99':
        'c8618884-087d-4ebb-bf33-6a6fb88e0d04',
      'LingeringCarrierWorkbinTask_CARRIER_70_SERIAL_800-00011957:TOW:000-009-948_ca9a103c-e87b-4d22-b0b2-781677ff0856':
        '7ca541d5-e98e-4cb8-a521-1188caa4f64c',
      'LingeringCarrierWorkbinTask_CARRIER_81_SERIAL_800-00011957:TOW:000-009-899_a835bf23-6016-45c2-b8ab-10fd91f06b29':
        'cab18d19-1ce5-4035-9ad8-9cee19cfe479',
      'LingeringCarrierWorkbinTask_CARRIER_84_SERIAL_800-00011957:TOW:000-009-910_42abbe88-c149-48ea-b9c2-71bd8ffd1528':
        '149c9ac3-518a-42af-a1c6-eb0900ace476',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-13-PotentiallyLingeringCarrierHandlerNode':
        'b2464d50-7eec-47b7-976a-5a88b1fd5077',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-14-PotentiallyLingeringCarrierHandlerNode':
        '7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-25-PotentiallyLingeringCarrierHandlerNode':
        'df9ae778-b85b-4e72-b339-ef791357c1a9',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-3-PotentiallyLingeringCarrierHandlerNode':
        '435639c4-1669-4485-872b-467d37c46464',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-39-PotentiallyLingeringCarrierHandlerNode':
        'df9d4d75-34b4-4d69-a4df-30408f6ffa70',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-64-PotentiallyLingeringCarrierHandlerNode':
        'c8618884-087d-4ebb-bf33-6a6fb88e0d04',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-70-PotentiallyLingeringCarrierHandlerNode':
        '7ca541d5-e98e-4cb8-a521-1188caa4f64c',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-81-PotentiallyLingeringCarrierHandlerNode':
        'cab18d19-1ce5-4035-9ad8-9cee19cfe479',
      'ManageLingeringCarriers-FindAndHandlePotentiallyLingeringCarriersParallelNode-FindOrCreatePotentiallyLingeringCarrierHandlerNode-84-PotentiallyLingeringCarrierHandlerNode':
        '149c9ac3-518a-42af-a1c6-eb0900ace476',
    },
    subTasksExecutionStatus: {
      '149c9ac3-518a-42af-a1c6-eb0900ace476': 'RUNNING',
      '435639c4-1669-4485-872b-467d37c46464': 'RUNNING',
      '7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7': 'RUNNING',
      '7ca541d5-e98e-4cb8-a521-1188caa4f64c': 'RUNNING',
      'b2464d50-7eec-47b7-976a-5a88b1fd5077': 'RUNNING',
      'c8618884-087d-4ebb-bf33-6a6fb88e0d04': 'RUNNING',
      'cab18d19-1ce5-4035-9ad8-9cee19cfe479': 'RUNNING',
      'df9ae778-b85b-4e72-b339-ef791357c1a9': 'RUNNING',
      'df9d4d75-34b4-4d69-a4df-30408f6ffa70': 'RUNNING',
    },
    subTasksExecutorsPaths: {
      '149c9ac3-518a-42af-a1c6-eb0900ace476': 'sites/LAX1/Workbins',
      '435639c4-1669-4485-872b-467d37c46464': 'sites/LAX1/Workbins',
      '7a3bd03c-7ffe-4249-9cea-2fb5c8f476b7': 'sites/LAX1/Workbins',
      '7ca541d5-e98e-4cb8-a521-1188caa4f64c': 'sites/LAX1/Workbins',
      'b2464d50-7eec-47b7-976a-5a88b1fd5077': 'sites/LAX1/Workbins',
      'c8618884-087d-4ebb-bf33-6a6fb88e0d04': 'sites/LAX1/Workbins',
      'cab18d19-1ce5-4035-9ad8-9cee19cfe479': 'sites/LAX1/Workbins',
      'df9ae778-b85b-4e72-b339-ef791357c1a9': 'sites/LAX1/Workbins',
      'df9d4d75-34b4-4d69-a4df-30408f6ffa70': 'sites/LAX1/Workbins',
    },
    trace: {
      childNodes: [
        {
          childNodes: [
            {
              childNodes: [],
              description: 'Checking if transfer conveyance default behavior execution is enabled.',
              name: 'CheckConditionNode',
              status: {
                description: null,
                status: 'SUCCESS',
              },
            },
            {
              childNodes: [
                {
                  childNodes: [
                    {
                      childNodes: [],
                      description: null,
                      name: 'WaitForCondition',
                      status: {
                        description: 'Routing path override feature is NOT enabled; NOT ticking behavior tree.',
                        status: 'RUNNING',
                      },
                    },
                    {
                      childNodes: [],
                      description: null,
                      name: 'Sequence',
                      status: null,
                    },
                  ],
                  description: null,
                  name: 'Sequence',
                  status: {
                    description: 'Routing path override feature is NOT enabled; NOT ticking behavior tree.',
                    status: 'RUNNING',
                  },
                },
                {
                  childNodes: [
                    {
                      childNodes: [],
                      description: null,
                      name: 'WaitForCondition',
                      status: {
                        description: 'Lingering carrier management feature is NOT enabled; NOT ticking behavior tree.',
                        status: 'RUNNING',
                      },
                    },
                    {
                      childNodes: [],
                      description: 'Node which manages lingering carriers',
                      name: 'ManageLingeringCarriers',
                      status: null,
                    },
                  ],
                  description: null,
                  name: 'Sequence',
                  status: {
                    description: 'Lingering carrier management feature is NOT enabled; NOT ticking behavior tree.',
                    status: 'RUNNING',
                  },
                },
                {
                  childNodes: [
                    {
                      childNodes: [],
                      description: null,
                      name: 'WaitForCondition',
                      status: {
                        description: 'Buffer management feature is NOT enabled; NOT ticking behavior tree.',
                        status: 'RUNNING',
                      },
                    },
                    {
                      childNodes: [],
                      description:
                        'Managing all the buffers for transfer conveyance sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
                      name: 'ManageBuffers',
                      status: null,
                    },
                  ],
                  description: null,
                  name: 'Sequence',
                  status: {
                    description: 'Buffer management feature is NOT enabled; NOT ticking behavior tree.',
                    status: 'RUNNING',
                  },
                },
                {
                  childNodes: [
                    {
                      childNodes: [],
                      description: null,
                      name: 'WaitForCondition',
                      status: {
                        description:
                          'Empty carriers at preharvest lane management feature is NOT enabled; NOT ticking behavior tree.',
                        status: 'RUNNING',
                      },
                    },
                    {
                      childNodes: [],
                      description: null,
                      name: 'Sequence',
                      status: null,
                    },
                  ],
                  description: null,
                  name: 'Sequence',
                  status: {
                    description:
                      'Empty carriers at preharvest lane management feature is NOT enabled; NOT ticking behavior tree.',
                    status: 'RUNNING',
                  },
                },
                {
                  childNodes: [
                    {
                      childNodes: [],
                      description: null,
                      name: 'WaitForCondition',
                      status: {
                        description: 'Pickup robot routing feature is NOT enabled; NOT ticking behavior tree.',
                        status: 'RUNNING',
                      },
                    },
                    {
                      childNodes: [],
                      description: null,
                      name: 'Sequence',
                      status: null,
                    },
                  ],
                  description: null,
                  name: 'Sequence',
                  status: {
                    description: 'Pickup robot routing feature is NOT enabled; NOT ticking behavior tree.',
                    status: 'RUNNING',
                  },
                },
                {
                  childNodes: [
                    {
                      childNodes: [],
                      description: null,
                      name: 'WaitForCondition',
                      status: {
                        description:
                          'Pre harvest buffer flow default routing feature is NOT enabled; NOT ticking behavior tree.',
                        status: 'RUNNING',
                      },
                    },
                    {
                      childNodes: [],
                      description: null,
                      name: 'Sequence',
                      status: null,
                    },
                  ],
                  description: null,
                  name: 'Sequence',
                  status: {
                    description:
                      'Pre harvest buffer flow default routing feature is NOT enabled; NOT ticking behavior tree.',
                    status: 'RUNNING',
                  },
                },
              ],
              description: null,
              name: 'Parallel',
              status: {
                description: 'Parallel',
                status: 'RUNNING',
              },
            },
            {
              childNodes: [],
              description: 'Node that will always return RUNNING status.',
              name: 'Running',
              status: null,
            },
          ],
          description: null,
          name: 'Branch',
          status: {
            description: 'Parallel',
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
        description: 'Parallel',
        status: 'RUNNING',
      },
    },
    transferConveyanceBehaviorExecutionMode: 'EXECUTE_DEFAULT_BEHAVIORS',
  },
};
