import React from 'react';

import { TaskDetails } from '../../types';

const dataTestIds = {
  root: 'upload-worksheet-error-message-root',
  workcenterError: (workcenter: string) => `upload-worksheet-error-message-${workcenter}`,
};

export { dataTestIds as dataTestIdsUploadWorksheetErrorMessage };

export interface ErrorData {
  error: boolean;
  message: string;
  task: TaskDetails;
}
export interface ErrorDataWithWorkcenter extends ErrorData {
  workcenter: string;
}

export interface UploadWorksheetErrorMessage {
  errorData: Partial<{
    [workcenter: string]: ErrorData;
  }>;
}

export const UploadWorksheetErrorMessage: React.FC<UploadWorksheetErrorMessage> = ({ errorData }) => {
  const workcenterErrors: ErrorDataWithWorkcenter[] = Object.keys(errorData).reduce((acc, workcenter) => {
    const data = errorData[workcenter];
    return data?.error
      ? [
          ...acc,
          {
            workcenter,
            ...data,
          },
        ]
      : acc;
  }, []);

  return (
    <div data-testid={dataTestIds.root}>
      <h3>Error was found in your worksheet!</h3>
      <p>Fix the following errors and try to upload again.</p>
      <ul>
        {workcenterErrors.map(error => (
          <li
            data-testid={dataTestIds.workcenterError(error.workcenter)}
            key={dataTestIds.workcenterError(error.workcenter)}
          >
            In the <b>{error.workcenter}</b> workcenter
            {error?.task?.plannedDate ? ` for plan date ${error?.task?.plannedDate}` : ''}:<br />
            {error?.message}
          </li>
        ))}
      </ul>
    </div>
  );
};
