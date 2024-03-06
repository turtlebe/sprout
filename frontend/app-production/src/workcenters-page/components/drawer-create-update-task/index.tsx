import {
  useGenerateFormGenConfigFromActionModel,
  useGetActionModel,
} from '@plentyag/app-production/src/actions-form-page/hooks';
import { BaseForm, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Drawer } from '@plentyag/brand-ui/src/material-ui/core';
import { usePostRequest, usePutRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import { omit } from 'lodash';
import React from 'react';

import { CreateOrUpdateTask, WorkcenterPlan } from '../../../common/types';
import { getDateFormat } from '../../../common/utils';
import { WORKCENTERS_PATHS } from '../../../constants';
import { removeEmptyValues } from '../../utils';

const dataTestIds = {
  close: 'dialog-perform-action-close-button',
};

export { dataTestIds as dataTestIdsDialogPerformAction };

interface DrawerCreateUpdateTask {
  task?: CreateOrUpdateTask;
  plan?: WorkcenterPlan; // might not be provided if plan has not yet been created.
  plannedDate: Date;
  workcenterPath: string;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * If a task is provided, a form will be shown allowing the user
 * to create or update the parameters of a workcenter task.
 * A workcenter task is essentially an action so it re-uses "action ui" components
 * to generate formgen config which is used by BaseForm to display a form.
 */
export const DrawerCreateUpdateTask: React.FC<DrawerCreateUpdateTask> = ({
  task,
  plan,
  plannedDate,
  workcenterPath,
  onClose,
  onSuccess,
}) => {
  const isUpdating = task?.isUpdating;

  const { makeRequest: createTask, isLoading: isCreatingTask } = usePostRequest({
    url: !isUpdating && `${WORKCENTERS_PATHS.baseApiPath}/create-task`,
  });
  const { makeRequest: updateTask, isLoading: isUpdatingTask } = usePutRequest({
    url: task?.isUpdating && `/api/plentyservice/executive-service/update-workcenter-task-details/${task.taskId}`,
  });
  const snackbar = useGlobalSnackbar();

  const taskPath = task?.taskPath;

  const operation: ProdActions.Operation = {
    path: taskPath,
    prefilledArgs: {},
  };
  const { action } = useGetActionModel(operation);
  const formGenConfig = useGenerateFormGenConfigFromActionModel({ action, operation });

  const initialValues = task?.isUpdating ? formGenConfig?.deserialize(JSON.parse(task.taskParametersJsonPayload)) : {};

  function getSubmitData(values: any) {
    const submitData = { ...omit(formGenConfig.serialize(values), 'submitter', 'submission_method') };
    return JSON.stringify(removeEmptyValues(submitData));
  }

  const handleCreateTask: BaseForm['onSubmit'] = (values: any) => {
    createTask({
      data: {
        plan,
        workcenter: workcenterPath,
        plannedDate: getDateFormat(plannedDate),
        taskPath,
        taskParametersJsonPayload: getSubmitData(values),
      },
      onSuccess: () => {
        onClose();
        onSuccess();
      },
      onError: error => snackbar.errorSnackbar({ title: 'Error Adding Task', message: parseErrorMessage(error) }),
    });
  };

  const handleUpdateTask: BaseForm['onSubmit'] = (values: any) => {
    updateTask({
      data: {
        taskParametersJsonPayload: getSubmitData(values),
      },
      onSuccess: () => {
        onClose();
        onSuccess();
      },
      onError: error => snackbar.errorSnackbar({ title: 'Error Updating Tasking', message: parseErrorMessage(error) }),
    });
  };

  return (
    <Drawer anchor="right" open={!!task} onClose={onClose}>
      <BaseForm
        isUpdating={isUpdating}
        isLoading={isCreatingTask || isUpdatingTask}
        initialValues={initialValues}
        onSubmit={isUpdating ? handleUpdateTask : handleCreateTask}
        formGenConfig={formGenConfig}
        renderSubmitTextHelper={true}
        isSubmitDisabled={false}
      />
    </Drawer>
  );
};
