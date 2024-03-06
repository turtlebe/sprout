import { UploadHistoryEntry } from '@plentyag/app-production-admin/src/import-plans-page/types';
import { orderBy, pick } from 'lodash';
import { useMemo } from 'react';

export interface UploadHistoryLineItem
  extends Pick<UploadHistoryEntry, 'status' | 'uploadedAt' | 'userName' | 'fileName'> {
  id: string;
  uploadId: string;
  workcenter?: string;
  plannedDate?: string;
  tasksCount?: number;
  confirmedCreateTasksAt?: string;
  createdSuccessfullyAt?: string;
}

export const useProcessUploadHistory = (uploadHistory: UploadHistoryEntry[] = []): UploadHistoryLineItem[] => {
  return useMemo<UploadHistoryLineItem[]>(() => {
    const uploadHistoryList = uploadHistory.reduce<UploadHistoryLineItem[]>(
      (acc, uploadHistoryEntry: UploadHistoryEntry) => {
        const lineItemMetadata: Omit<UploadHistoryLineItem, 'id'> = {
          ...pick(uploadHistoryEntry, ['status', 'uploadedAt', 'userName', 'fileName']),
          uploadId: uploadHistoryEntry.id,
        };

        // Create a line item with status for each created task
        if (uploadHistoryEntry?.tasks?.length > 0) {
          uploadHistoryEntry.tasks.forEach((task, index) => {
            acc.push({
              ...lineItemMetadata,
              ...task,
              id: `${uploadHistoryEntry.id}_${index}`,
            });
          });

          // Otherwise, create a single line item with status
        } else {
          acc.push({
            ...lineItemMetadata,
            id: uploadHistoryEntry.id,
          });
        }

        return acc;
      },
      []
    );

    const preSortedUploadHistoryList = orderBy(uploadHistoryList, 'uploadedAt', 'desc');

    return preSortedUploadHistoryList;
  }, [uploadHistory]);
};
