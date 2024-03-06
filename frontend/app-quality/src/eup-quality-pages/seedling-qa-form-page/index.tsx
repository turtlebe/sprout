import { BaseForm, BaseFormReadyEvent } from '@plentyag/brand-ui/src/components/base-form';
import { DialogConfirmation } from '@plentyag/brand-ui/src/components/dialog-confirmation';
import { useFormGenFields } from '@plentyag/brand-ui/src/components/form-gen';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Can } from '@plentyag/core/src/components/can';
import useCoreStore from '@plentyag/core/src/core-store';
import { usePostRequest, usePutRequest } from '@plentyag/core/src/hooks/use-axios';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { replaceRouteUrlParams } from '@plentyag/core/src/utils/replace-route-url-params';
import { omit } from 'lodash';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { deserializeDataFromPlugs, serializePlugsFromValues } from '../../common/serialize-deserialize-plugs';
import { InfoDialog } from '../components/info-message-dialog/info-message-dialog';

import {
  DEFECT_VALIDATION,
  EUPHRATES_PERCENTAGES,
  EUPHRATES_PLUGS,
  PLANT_DEFECTS,
  PLUG_DEFECTS,
  PROCESSING_DEFECTS,
  RECORD_SAVED_ERROR_SUBSTRING,
} from './constants';
import { useFormGenConfig } from './hooks/use-form-gen-config';
import { defectsErrorMessage, moveToCompostMessage, moveToTransplantMessage } from './utils/message';

export { dataTestIdsBaseForm as dataTestIdsSeedlingQaForm } from '@plentyag/brand-ui/src/components/base-form';

export const SeedlingQaFormEup: React.FC<Pick<RouteComponentProps<SeedlingQA.URLParams>, 'match'>> = ({ match }) => {
  // Determine if this is an Update or a Create
  const isUpdating = Boolean(match.params.seedlingQaId);
  const snackbarProps = useGlobalSnackbar();
  // Get FormGen Config
  const config = useFormGenConfig();
  const { serializer, findFieldBy } = useFormGenFields(config, { isUpdating });
  // Requests
  const requests = {
    get: useSwrAxios<FormGen.extractFormikValues<typeof config>>(
      isUpdating && { url: replaceRouteUrlParams(config.getEndpoint, match.params) }
    ),
    create: usePostRequest<FormGen.extractFormikValues<typeof config>, FormGen.extractFormikValues<typeof config>>({
      url: replaceRouteUrlParams(config.createEndpoint, match.params),
    }),
    update: usePutRequest<FormGen.extractFormikValues<typeof config>, FormGen.extractFormikValues<typeof config>>({
      url: replaceRouteUrlParams(config.updateEndpoint, match.params),
    }),
  };

  const initialFormData = {
    cultivar: '',
    trayId: '',
    site: '',
    notes: '',
    plugs: {},
    enableThresholdsValidation: true,
  };

  const [coreState] = useCoreStore();
  const [formEventReady, setFormEventReady] = React.useState<BaseFormReadyEvent>(null);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState<boolean>(false);
  const [validationMessage, setvalidationMessage] = React.useState<string | React.ReactNode>('');

  const [isInfoDialogOpen, setIsInfoDialogOpen] = React.useState<boolean>(false);
  const [infoDialogContent, setInfoDialogContent] = React.useState<string | React.ReactNode>('');
  const [formData, setFormData] = React.useState(initialFormData);
  const [defectsState, setdefectsState] = React.useState<Object>();

  // others
  const isLoading =
    requests.get.isValidating || requests.create.isLoading || requests.update.isLoading || config.isLoading;
  const data = requests.get.data;
  let newData = {};
  if (data) {
    newData = deserializeDataFromPlugs({
      values: data,
      plugs: EUPHRATES_PLUGS,
      percentages: EUPHRATES_PERCENTAGES,
      plug_defects: PLUG_DEFECTS,
      processing_defects: PROCESSING_DEFECTS,
      plant_defects: PLANT_DEFECTS,
    });
  }

  const initialValues = {
    ...serializer.deserialize(newData),
    id: requests.get.data?.id,
  };
  const makeRequest = isUpdating ? requests.update.makeRequest : requests.create.makeRequest;
  const permission = isUpdating ? config.permissions?.update : config.permissions?.create;

  const handleBadRequest = error => {
    let message = parseErrorMessage(error);
    if (message.startsWith(DEFECT_VALIDATION)) {
      let defectsJSON = JSON.parse(message.split(DEFECT_VALIDATION + ':')[1]);
      setdefectsState(defectsJSON);
      let defectsList = (defectsJSON.Compost ? defectsJSON.Compost : []).concat(
        defectsJSON.Transplant ? defectsJSON.Transplant : []
      );
      setvalidationMessage(defectsErrorMessage(defectsList));
      setIsConfirmDialogOpen(true);
    } else {
      snackbarProps.errorSnackbar({ message });
    }
  };

  const submitValues = async submitWithValidation => {
    // wait on makeRequest and onSuccess (since async) to complete before submission is complete.
    formData.plugs = serializePlugsFromValues({
      values: formData,
      plugs: EUPHRATES_PLUGS,
      percentages: EUPHRATES_PERCENTAGES,
      plug_defects: PLUG_DEFECTS,
      processing_defects: PROCESSING_DEFECTS,
      plant_defects: PLANT_DEFECTS,
    });
    formData.enableThresholdsValidation = submitWithValidation;

    await makeRequest({
      data: {
        ...serializer.serialize(
          omit(formData, [
            'images',
            'seedlingCount',
            'packagingCondensationLevels',
            'plugIntegrity',
            'processingDefects',
            'plantHealth',
          ])
        ),
        id: match.params.seedlingQaId,
        username: coreState.currentUser.username,
      },
      onSuccess: async response => {
        // Code will come here in case of Validation
        try {
          const imagesDragAndDrop = findFieldBy<FormGen.FieldDragAndDrop>({ name: 'images' });
          await imagesDragAndDrop.afterSubmit(formData['images'], response);
          const qAActionResponseStatus = response.seedlingQAActionResponse.status;
          const qAActionResponseError = response.seedlingQAActionResponse.error;
          if (!submitWithValidation && defectsState && defectsState.hasOwnProperty('Compost')) {
            setInfoDialogContent(moveToCompostMessage(formData.trayId, qAActionResponseStatus, qAActionResponseError));
            setIsInfoDialogOpen(true);
          } else {
            setInfoDialogContent(
              moveToTransplantMessage(formData.trayId, qAActionResponseStatus, qAActionResponseError)
            );
            setIsInfoDialogOpen(true);
          }
          formEventReady.api.handleSuccess();
        } catch (error) {
          formEventReady.api.handleError(error);
        }
      },
      onError: error => {
        let error_message = parseErrorMessage(error);

        if (error.status === 400) {
          handleBadRequest(error);
        } else if (error_message.includes(RECORD_SAVED_ERROR_SUBSTRING)) {
          snackbarProps.warningSnackbar(error_message);
          formEventReady.api.resetForm();
          console.log(error_message);
        } else {
          formEventReady.api.handleError(error);
        }
      },
    });
  };

  // Submit handler
  const handleSubmit: BaseForm['onSubmit'] = (values: any) => {
    setFormData(Object.assign(formData, values));
    // Submit Form by validating data against threshold in EVS
    submitValues(true);
  };

  const handleConfirmation = () => {
    setIsConfirmDialogOpen(false);
    // Submit Form by By-passing threshold validation from EVS
    submitValues(false);
  };

  // Clears the form when switching from update to create mode.
  React.useEffect(() => {
    if (match.params.seedlingQaId === undefined && formEventReady) {
      formEventReady.api.resetForm();
    }
  }, [match.params.seedlingQaId]);

  return (
    <Can resource={permission?.resource} level={permission?.level} fallback={<Redirect to="/quality" />}>
      <BaseForm
        isUpdating={isUpdating}
        isLoading={isLoading}
        initialValues={initialValues}
        formGenConfig={config}
        onSubmit={handleSubmit}
        onBaseFormReady={setFormEventReady}
        submitterTextHelperProps={{ createdAt: requests.get.data?.createdAt, username: requests.get.data?.username }}
      />

      <DialogConfirmation
        open={isConfirmDialogOpen}
        title="Confirmation"
        cancelLabel="Review"
        confirmLabel="Yes"
        onConfirm={handleConfirmation}
        onCancel={() => setIsConfirmDialogOpen(false)}
      >
        {validationMessage}
      </DialogConfirmation>
      <InfoDialog
        open={isInfoDialogOpen}
        content={infoDialogContent}
        onClose={() => setIsInfoDialogOpen(false)}
        statusTitle="Information"
      />
    </Can>
  );
};
