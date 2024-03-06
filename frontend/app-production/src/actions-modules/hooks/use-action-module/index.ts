import { DataModel, UseActionModule, UseActionModuleReturn } from '@plentyag/app-production/src/actions-modules/types';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useLogAxiosErrorInSnackbar, usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { useFormik } from 'formik';
import { useCallback, useEffect } from 'react';

import { getDataSchemaFromActionModel } from '../../shared/utils';

export const useActionModule = ({
  actionModule,
  path,
  getDataModel,
  isLoading = false,
}: UseActionModule): UseActionModuleReturn => {
  const snackbar = useGlobalSnackbar();

  const { actionName, actionRequestType, additionalValidation } = actionModule;

  // Input: Get Action Definition
  const {
    data: actionModel,
    isValidating: isActionModelLoading,
    error: actionModelError,
  } = useSwrAxios<ProdActions.ActionModel>({
    url:
      path &&
      actionRequestType &&
      actionName &&
      `/api/production/actions/${path}/interfaces/${actionRequestType}/methods/${actionName}`,
  });

  useLogAxiosErrorInSnackbar(actionModelError, `Error getting ${actionName} action definition`);

  // Output: Setup post request
  const { makeRequest } = usePostRequest({
    url:
      path &&
      actionRequestType &&
      actionName &&
      `/api/plentyservice/executive-service/request/${path}/interfaces/${actionRequestType}/methods/${actionName}`,
  });

  // Handle form state from initial values to submission
  const formik = useFormik<DataModel>({
    initialValues: getDataModel(actionModel),
    validationSchema: getDataSchemaFromActionModel(actionModel, additionalValidation),
    onSubmit: async (data: DataModel): Promise<DataModel> =>
      new Promise((resolve, reject) =>
        makeRequest({
          data,
          onSuccess: (responseData: DataModel) => {
            resolve(responseData);
            snackbar.successSnackbar(`Edited ${actionName} with Success`);
          },
          onError: error => {
            const message = parseErrorMessage(error);
            snackbar.errorSnackbar({ title: `Error saving ${actionName}`, message });
            reject(error);
          },
        })
      ),
  });

  // only submit when the form has been changed
  const handleSubmit = useCallback(async () => {
    if (formik.dirty) {
      return formik.submitForm();
    }
  }, [formik.dirty, formik.submitForm]);

  // force resetting the form  with values from "getDataModel"
  const resetForm = useCallback(() => {
    const values = getDataModel(actionModel);
    formik.resetForm({ values });
  }, [formik]);

  useEffect(() => {
    if (actionModel) {
      resetForm();
    }
  }, [actionModel]);

  return {
    actionModuleProps: {
      formik,
      actionModel,
      isLoading: isLoading || isActionModelLoading,
    },
    handleSubmit,
    resetForm,
  };
};
