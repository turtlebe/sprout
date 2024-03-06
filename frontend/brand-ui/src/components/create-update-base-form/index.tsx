import { MakeRequestParams, usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { replaceRouteUrlParams } from '@plentyag/core/src/utils/replace-route-url-params';
import React from 'react';

import { BaseForm, BaseFormReadyEvent, dataTestIdsBaseForm } from '../base-form';
import { useFormGenFields } from '../form-gen';
import { dataTestIdsTitleRenderer } from '../form-gen/components/title-renderer';

import { useStyles } from './styles';

const dataTestIds = {
  submit: dataTestIdsBaseForm.submit,
  title: dataTestIdsTitleRenderer.title,
};

export { dataTestIds as dataTestIdsCreateUpdateBaseForm };

export interface CreateUpdateBaseForm<OnSuccessResponse = any> {
  formGenConfig: FormGen.Config;
  layout?: FormGen.Layout;
  isUpdating?: boolean;
  initialValues?: any;
  showTitle?: boolean;
  renderSubmitTextHelper?: boolean;
  isSubmitDisabled?: boolean;
  onBeforeSubmit?: (values: any, onContinue: () => void) => void;
  onSuccess: MakeRequestParams<OnSuccessResponse>['onSuccess'];
  disableDefaultOnSuccessHandler?: boolean;
  disableDefaultOnErrorHandler?: boolean;
  onError?: (err: any) => void;
  onIsSubmittingChange?: (isSubmitting: boolean) => void;
  disableGoToPath?: boolean;
}

// interface that the parent components should inherit.
export type CreateUpdateFormProps<OnSuccessResponse = any> = Omit<
  CreateUpdateBaseForm<OnSuccessResponse>,
  'formGenConfig'
>;

export const CreateUpdateBaseForm: React.FC<CreateUpdateBaseForm<unknown>> = ({
  formGenConfig,
  layout,
  isUpdating = false,
  initialValues: propInitialValues,
  showTitle = true,
  renderSubmitTextHelper = false,
  isSubmitDisabled = false,
  onBeforeSubmit,
  onSuccess,
  disableDefaultOnSuccessHandler = false,
  disableDefaultOnErrorHandler = false,
  onError,
  onIsSubmittingChange,
  disableGoToPath,
}) => {
  const classes = useStyles({});
  const requests = {
    get: useSwrAxios<FormGen.extractFormikValues<typeof formGenConfig>>(
      Boolean(isUpdating && !propInitialValues) && formGenConfig.getEndpoint && { url: formGenConfig.getEndpoint }
    ),
    create: usePostRequest<
      FormGen.extractFormikValues<typeof formGenConfig>,
      FormGen.extractFormikValues<typeof formGenConfig>
    >({
      url: formGenConfig.createEndpoint,
      headers: formGenConfig.headers,
    }),
    update: usePutRequest<
      FormGen.extractFormikValues<typeof formGenConfig>,
      FormGen.extractFormikValues<typeof formGenConfig>
    >({
      url: formGenConfig.updateEndpoint,
      headers: formGenConfig.headers,
    }),
  };
  const makeRequest = isUpdating ? requests.update.makeRequest : requests.create.makeRequest;
  const isLoading = requests.create.isLoading || requests.update.isLoading;
  const { serializer } = useFormGenFields(formGenConfig);
  const [formEventReady, setFormEventReady] = React.useState<BaseFormReadyEvent>(null);
  const initialValues = serializer.deserialize(propInitialValues ?? requests.get.data);

  const submitRequest = (values: any) => {
    void makeRequest({
      url: replaceRouteUrlParams(isUpdating ? formGenConfig.updateEndpoint : formGenConfig.createEndpoint, values),
      data: serializer.serialize(values),
      onSuccess: (response, headers) => {
        !disableDefaultOnSuccessHandler && formEventReady.api.handleSuccess();
        void onSuccess(response, headers);
      },
      onError: err => {
        onError && onError(err);
        !disableDefaultOnErrorHandler && formEventReady.api.handleError(err);
      },
    });
  };

  // if there is "onBeforeSubmit" defined, we will call that method and wait for the next
  // callback to be called (can be used for "confirmation" dialog boxes).  Otherwise,
  // just make the request
  const handleSubmit: BaseForm['onSubmit'] = (values: any) => {
    if (onBeforeSubmit) {
      onBeforeSubmit(values, (updatedValues?: any) => {
        submitRequest(updatedValues || values);
      });
    } else {
      submitRequest(values);
    }
  };

  React.useEffect(() => {
    onIsSubmittingChange && onIsSubmittingChange(isLoading);
  }, [isLoading]);

  return (
    <BaseForm
      isUpdating={isUpdating}
      isLoading={isLoading}
      layout={layout}
      onSubmit={handleSubmit}
      onBaseFormReady={setFormEventReady}
      formGenConfig={{ ...formGenConfig, title: showTitle ? formGenConfig.title : undefined }}
      classes={{ baseFormFooter: classes.baseFormFooter }}
      renderSubmitTextHelper={renderSubmitTextHelper}
      isSubmitDisabled={isSubmitDisabled}
      initialValues={initialValues}
      disableGoToPath={disableGoToPath}
    />
  );
};
