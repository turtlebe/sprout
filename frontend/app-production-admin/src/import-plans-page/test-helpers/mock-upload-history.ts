import { pick } from 'lodash';

import { UploadHistoryLineItem } from '../components/imported-plans-table/hooks/use-process-upload-history';
import { UploadHistoryEntry, UploadHistoryProcessingStatus } from '../types';

export const mockUploadedTasks = [
  {
    plannedDate: '2042-07-21',
    taskCount: 2,
    workcenter: 'Seed',
  },
  {
    plannedDate: '2042-07-22',
    taskCount: 2,
    workcenter: 'Seed',
  },
];

export const mockUploadHistoryEntry: UploadHistoryEntry = {
  fileName: 'google-sheet.xlsx',
  id: 'plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c1',
  status: UploadHistoryProcessingStatus.AWAITING_CONFIRMATION,
  uploadedAt: '2022-09-21T17:37:47.673427+00:00',
  userName: 'jvu',
};

export const mockConfirmedUploadHistoryEntry: UploadHistoryEntry = {
  confirmedCreateTasksAt: '2022-09-23T17:37:50.138747+00:00',
  fileName: 'google-sheet.xlsx',
  id: 'plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c2',
  status: UploadHistoryProcessingStatus.CONFIRMED_CREATE_TASKS,
  uploadedAt: '2022-09-22T17:37:47.673427+00:00',
  userName: 'jvu',
};

export const mockCreatedUploadHistoryEntry: UploadHistoryEntry = {
  confirmedCreateTasksAt: '2022-09-23T17:37:50.138747+00:00',
  createdSuccessfullyAt: '2022-09-23T17:37:53.015533+00:00',
  fileName: 'google-sheet.xlsx',
  id: 'plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c3',
  status: UploadHistoryProcessingStatus.CREATED_SUCCESSFULLY,
  uploadedAt: '2022-09-24T17:37:47.673427+00:00',
  userName: 'jvu',
  tasks: mockUploadedTasks,
};

export const mockErrorUploadHistoryEntry: UploadHistoryEntry = {
  fileName: 'google-sheet.xlsx',
  id: 'plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c4',
  status: UploadHistoryProcessingStatus.ERROR_CREATING_TASKS,
  uploadedAt: '2022-09-25T17:37:47.673427+00:00',
  userName: 'jvu',
};

export const mockProcessedUploadHistoryLineItem: UploadHistoryLineItem = {
  uploadId: 'plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c4',
  id: 'plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c4_0',
  ...pick(mockCreatedUploadHistoryEntry, ['status', 'uploadedAt', 'userName', 'fileName']),
  ...mockUploadedTasks[0],
};

export const mockUploadHistory: UploadHistoryEntry[] = [
  { ...mockUploadHistoryEntry, id: '1' },
  { ...mockConfirmedUploadHistoryEntry },
  { ...mockCreatedUploadHistoryEntry },
  { ...mockErrorUploadHistoryEntry },
  { ...mockUploadHistoryEntry, id: '5' },
];
