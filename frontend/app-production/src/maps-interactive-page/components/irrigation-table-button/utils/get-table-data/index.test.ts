import {
  InternalIrrigationStatus,
  IrrigationExecutionType,
  IrrigationStatus,
  IrrigationTask,
  TaskType,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { Settings } from 'luxon';

import { getTableData } from '.';

const mockTableSerial = '800-00000257:TBL:000-000-374';
const mockLotName = '02e8fc82-7860-4104-aad4-2734158cbbbc';
const mockRackPath = 'sites/LAX1/areas/Propagation/lines/PropagationRack1';
const siteTimeZone = 'America/Los_Angeles';

describe('getTableData', () => {
  function runAllTestsInTimeZone(timeZone: string) {
    describe(`run tests in time zone: ${timeZone}`, () => {
      beforeAll(() => {
        Settings.defaultZone = timeZone;
      });

      afterAll(() => {
        Settings.defaultZone = 'system';
      });

      it('add rows for created status tasks', () => {
        // two created task, note: purposely mis-ordered so sorting will be tested.
        const mockIrrigationTasks: IrrigationTask[] = [
          {
            id: '6286e460-d240-475e-abb6-d044c3e597df',
            lotName: '02e8fc82-7860-4104-aad4-2734158cbbbc',
            tableSerial: '800-00000257:TBL:000-000-374',
            plannedStartDate: '2023-01-15T08:00:00.000Z',
            plannedVolume: 185,
            status: IrrigationStatus.CREATED,
            executions: [],
            type: TaskType.MANUAL,
            rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
          },
          {
            id: '6c699509-d382-4fab-ac15-ba7e7ecb5ee3',
            lotName: '02e8fc82-7860-4104-aad4-2734158cbbbc',
            tableSerial: '800-00000257:TBL:000-000-374',
            plannedStartDate: '2023-01-14T08:00:00.000Z',
            plannedVolume: 187,
            status: IrrigationStatus.CREATED,
            executions: [],
            type: TaskType.MANUAL,
            rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
          },
        ];
        // table loaded into prop at very end of day 0 in SF timezone.
        const mockTableLoadedDate = new Date('2023-01-15T01:00:00.000Z');
        const irrigationTaskTabelRowData = getTableData({
          irrigationTasks: mockIrrigationTasks,
          tableSerial: mockTableSerial,
          lotName: mockLotName,
          rackPath: mockRackPath,
          tableLoadedDate: mockTableLoadedDate,
          siteTimeZone,
        });

        expect(irrigationTaskTabelRowData).toHaveLength(2);

        // note: sorted by irrigationDate order.

        const firstRowData = irrigationTaskTabelRowData[0];
        expect(firstRowData.recipeDay).toEqual(0);
        expect(firstRowData.status).toEqual(IrrigationStatus.CREATED);
        expect(firstRowData.irrigationDate).toEqual(new Date(mockIrrigationTasks[1].plannedStartDate));
        expect(firstRowData.plannedVolume).toEqual(mockIrrigationTasks[1].plannedVolume);

        const secondRowData = irrigationTaskTabelRowData[1];
        expect(secondRowData.recipeDay).toEqual(1);
        expect(secondRowData.status).toEqual(IrrigationStatus.CREATED);
        expect(secondRowData.irrigationDate).toEqual(new Date(mockIrrigationTasks[0].plannedStartDate));
        expect(secondRowData.plannedVolume).toEqual(mockIrrigationTasks[0].plannedVolume);
      });

      it('add rows for execution events', () => {
        const mockIrrigationTasks: IrrigationTask[] = [
          {
            id: '63862fa4-83af-46ab-95fb-c283df15f4d3',
            lotName: '02e8fc82-7860-4104-aad4-2734158cbbbc',
            tableSerial: '800-00000257:TBL:000-000-374',
            plannedStartDate: '2023-01-21T08:00:00.000Z',
            plannedVolume: 187,
            status: IrrigationStatus.SUCCESS,
            executions: [
              {
                executedTimestamp: '2023-01-21T18:00:00.000Z',
                failureReason: 'Irrigation value was stuck',
                status: IrrigationStatus.FAILURE,
                type: IrrigationExecutionType.MANUAL,
                rack: 1,
                level: 8,
                bay: 16,
              },
              {
                executedTimestamp: '2023-01-21T19:00:00.000Z',
                failureReason: 'Irrigation value was still stuck',
                status: IrrigationStatus.CANCELLED,
                type: IrrigationExecutionType.MANUAL,
                rack: 1,
                level: 8,
                bay: 16,
              },
              {
                executedTimestamp: '2023-01-22T01:00:00.000Z',
                failureReason: null,
                status: IrrigationStatus.SUCCESS,
                type: IrrigationExecutionType.MANUAL,
                rack: 1,
                level: 8,
                bay: 16,
              },
            ],
            type: TaskType.MANUAL,
            rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
          },
          {
            id: 'e60ed514-71d5-4363-a085-e7d9f0075f7f',
            lotName: '02e8fc82-7860-4104-aad4-2734158cbbbc',
            tableSerial: '800-00000257:TBL:000-000-374',
            plannedStartDate: '2023-01-22T08:00:00.000Z',
            plannedVolume: 187,
            status: IrrigationStatus.ONGOING,
            executions: [
              {
                executedTimestamp: '2023-01-22T14:17:28.000Z',
                failureReason: null,
                status: IrrigationStatus.ONGOING,
                type: IrrigationExecutionType.MANUAL,
                rack: 1,
                level: 8,
                bay: 16,
              },
            ],
            type: TaskType.MANUAL,
            rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
          },
        ];

        const mockTableLoadedDate = new Date('2023-01-21T16:27:00.000Z');
        const irrigationTaskTabelRowData = getTableData({
          irrigationTasks: mockIrrigationTasks,
          tableSerial: mockTableSerial,
          lotName: mockLotName,
          rackPath: mockRackPath,
          tableLoadedDate: mockTableLoadedDate,
          siteTimeZone,
        });

        // four exectuion events:
        // day 0: 1 success, 1 failure, 1 cancelled
        // day 1: 1 ongoing
        expect(irrigationTaskTabelRowData).toHaveLength(4);

        const firstRowDataFailedTask = irrigationTaskTabelRowData[0];
        expect(firstRowDataFailedTask.recipeDay).toEqual(0);
        expect(firstRowDataFailedTask.status).toEqual(IrrigationStatus.FAILURE);
        expect(firstRowDataFailedTask.irrigationDate).toEqual(
          new Date(mockIrrigationTasks[0].executions[0].executedTimestamp)
        );
        expect(firstRowDataFailedTask.failureReason).toEqual(mockIrrigationTasks[0].executions[0].failureReason);

        const secondRowDataCancelledTask = irrigationTaskTabelRowData[1];
        expect(secondRowDataCancelledTask.recipeDay).toEqual(0);
        expect(secondRowDataCancelledTask.status).toEqual(IrrigationStatus.CANCELLED);
        expect(secondRowDataCancelledTask.irrigationDate).toEqual(
          new Date(mockIrrigationTasks[0].executions[1].executedTimestamp)
        );

        const thirdRowDataSuccessTask = irrigationTaskTabelRowData[2];
        expect(thirdRowDataSuccessTask.recipeDay).toEqual(0);
        expect(thirdRowDataSuccessTask.status).toEqual(IrrigationStatus.SUCCESS);
        expect(thirdRowDataSuccessTask.irrigationDate).toEqual(
          new Date(mockIrrigationTasks[0].executions[2].executedTimestamp)
        );

        const fourthRowDataSuccessTask = irrigationTaskTabelRowData[3];
        expect(fourthRowDataSuccessTask.recipeDay).toEqual(1);
        expect(fourthRowDataSuccessTask.status).toEqual(IrrigationStatus.ONGOING);
        expect(fourthRowDataSuccessTask.irrigationDate).toEqual(
          new Date(mockIrrigationTasks[1].executions[0].executedTimestamp)
        );
      });

      it('adds rows for unscheduled task days', () => {
        const mockIrrigationTasks: IrrigationTask[] = [
          {
            id: '6c699509-d382-4fab-ac15-ba7e7ecb5ee3',
            lotName: '02e8fc82-7860-4104-aad4-2734158cbbbc',
            tableSerial: '800-00000257:TBL:000-000-374',
            plannedStartDate: '2023-01-14T08:00:00.000Z',
            plannedVolume: 187,
            status: IrrigationStatus.CREATED,
            executions: [],
            type: TaskType.MANUAL,
            rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
          },
          {
            id: '6286e460-d240-475e-abb6-d044c3e597df',
            lotName: '02e8fc82-7860-4104-aad4-2734158cbbbc',
            tableSerial: '800-00000257:TBL:000-000-374',
            plannedStartDate: '2023-01-17T08:00:00.000Z',
            plannedVolume: 185,
            status: IrrigationStatus.CREATED,
            executions: [],
            type: TaskType.MANUAL,
            rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
          },
        ];
        const mockTableLoadedDate = new Date('2023-01-14T08:00:00.000Z');
        const irrigationTaskTabelRowData = getTableData({
          irrigationTasks: mockIrrigationTasks,
          tableSerial: mockTableSerial,
          lotName: mockLotName,
          rackPath: mockRackPath,
          tableLoadedDate: mockTableLoadedDate,
          siteTimeZone,
        });

        // since there is a two day gap in above created task, two rows
        // for unscheduled task days between above created tasks should be added.
        expect(irrigationTaskTabelRowData).toHaveLength(4);

        const firstRowData = irrigationTaskTabelRowData[0];
        expect(firstRowData.recipeDay).toEqual(0);
        expect(firstRowData.status).toEqual(IrrigationStatus.CREATED);

        const secondRowData = irrigationTaskTabelRowData[1];
        expect(secondRowData.recipeDay).toEqual(1);
        expect(secondRowData.status).toEqual(InternalIrrigationStatus.UNSCHEDULED);
        expect(secondRowData.irrigationDate).toEqual(new Date('2023-01-15T08:00:00.000Z'));

        const thirdRowData = irrigationTaskTabelRowData[2];
        expect(thirdRowData.recipeDay).toEqual(2);
        expect(thirdRowData.status).toEqual(InternalIrrigationStatus.UNSCHEDULED);
        expect(thirdRowData.irrigationDate).toEqual(new Date('2023-01-16T08:00:00.000Z'));

        const fourthRowData = irrigationTaskTabelRowData[3];
        expect(fourthRowData.recipeDay).toEqual(3);
        expect(fourthRowData.status).toEqual(IrrigationStatus.CREATED);
      });

      it('uses recipeDay from backend (irrigationTasks)', () => {
        const mockIrrigationTasks: IrrigationTask[] = [
          {
            id: '6286e460-d240-475e-abb6-d044c3e597df',
            lotName: '02e8fc82-7860-4104-aad4-2734158cbbbc',
            tableSerial: '800-00000257:TBL:000-000-374',
            plannedStartDate: '2023-01-15T08:00:00.000Z',
            plannedVolume: 185,
            status: IrrigationStatus.CREATED,
            executions: [],
            type: TaskType.RECIPE,
            rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
            recipeDay: 0,
          },
          {
            id: '63862fa4-83af-46ab-95fb-c283df15f4d3',
            lotName: '02e8fc82-7860-4104-aad4-2734158cbbbc',
            tableSerial: '800-00000257:TBL:000-000-374',
            plannedStartDate: '2023-01-16T08:00:00.000Z',
            plannedVolume: 187,
            status: IrrigationStatus.SUCCESS,
            executions: [
              {
                executedTimestamp: '2023-01-16T01:00:00.000Z',
                failureReason: null,
                status: IrrigationStatus.SUCCESS,
                type: IrrigationExecutionType.MANUAL,
                rack: 1,
                level: 8,
                bay: 16,
              },
            ],
            type: TaskType.RECIPE,
            rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
            recipeDay: 2,
          },
        ];
        // table loaded into prop at very end of day 0 in SF timezone.
        const mockTableLoadedDate = new Date('2023-01-15T08:00:00.000Z');
        const irrigationTaskTabelRowData = getTableData({
          irrigationTasks: mockIrrigationTasks,
          tableSerial: mockTableSerial,
          lotName: mockLotName,
          rackPath: mockRackPath,
          tableLoadedDate: mockTableLoadedDate,
          siteTimeZone,
        });

        expect(irrigationTaskTabelRowData).toHaveLength(3);

        const firstRowDataFailedTask = irrigationTaskTabelRowData[0];
        expect(firstRowDataFailedTask.recipeDay).toEqual(0);
        expect(firstRowDataFailedTask.status).toEqual(IrrigationStatus.CREATED);

        const secondRowDataFailedTask = irrigationTaskTabelRowData[1];
        expect(secondRowDataFailedTask.recipeDay).toEqual(1);
        expect(secondRowDataFailedTask.status).toEqual(InternalIrrigationStatus.UNSCHEDULED);

        const thirdRowDataFailedTask = irrigationTaskTabelRowData[2];
        expect(thirdRowDataFailedTask.recipeDay).toEqual(2);
        expect(thirdRowDataFailedTask.status).toEqual(IrrigationStatus.SUCCESS);
      });
    });
  }

  runAllTestsInTimeZone('America/Los_Angeles');
  runAllTestsInTimeZone('Europe/London');
});
