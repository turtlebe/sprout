import { WorkcenterTaskDetails, WorkcenterTaskDetailsResponse } from '@plentyag/app-production/src/common/types';

export interface TaskDetails extends Omit<WorkcenterTaskDetails, 'planId' | 'id' | 'title'> {
  plannedDate?: string;
  title?: string;
}

export interface CreatedTask {
  plannedDate: string;
  workcenterTask: WorkcenterTaskDetailsResponse;
}

export interface WorkcenterTasksImport {
  plannedDate?: string;
  workcenter: string;
  task?: string;
  tasks?: TaskDetails[];
  taskCount?: number;
}

export enum UploadHistoryProcessingStatus {
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
  CONFIRMED_CREATE_TASKS = 'CONFIRMED_CREATE_TASKS',
  ERROR_CREATING_TASKS = 'ERROR_CREATING_TASKS',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  CREATED_SUCCESSFULLY = 'CREATED_SUCCESSFULLY',
}

export interface UploadHistoryEntry {
  id: string;
  status: UploadHistoryProcessingStatus;
  uploadedAt: string;
  confirmedCreateTasksAt?: string;
  createdSuccessfullyAt?: string;
  userName: string;
  fileName: string;
  tasks?: WorkcenterTasksImport[];
}

/**
 * upload-bulk-create-tasks-file response shape from the BFF:
 * {
 *   upload_id: '123-abc',
 *   [Workcenter]: {
 *     [Date]: [
 *         plannedDate: date string,
 *         taskParametersJsonPayload: JSON string,
 *         taskPath: string,
 *         workcenter: string
 *       ]
 *     }
 *   },
 *   ...
 * }
 * This is the same shape used to upload back into the BFF to process creating the tasks
 *
 */
export interface UploadBulkCreateTasks {
  [key: string]: Record<string, TaskDetails[]> | string;
  upload_id: string;
}
