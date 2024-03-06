import { AppBreadcrumbs, AppHeader, AppLayout, BaseForm, BaseFormReadyEvent } from '@plentyag/brand-ui/src/components';
import { usePostRequest } from '@plentyag/core/src/hooks';
import React from 'react';

import { ROUTES } from '../routes';

import { useDeviceRegistrationFormGenConfig } from './hooks/use-device-registration-form-gen-config';

export const DeviceRegistrationPage: React.FC = () => {
  const formGenConfig = useDeviceRegistrationFormGenConfig();
  const { makeRequest, isLoading } = usePostRequest({ url: formGenConfig.createEndpoint });
  const [formEventReady, setFormEventReady] = React.useState<BaseFormReadyEvent>(null);

  // handlers
  const handleSubmit: BaseForm['onSubmit'] = (values: any) => {
    void makeRequest({
      data: formGenConfig.serialize(values),
      onSuccess: () => {
        formEventReady.api.handleSuccess();
      },
      onError: formEventReady.api.handleError,
    });
  };

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs homePageRoute={ROUTES.devicesPage} homePageName="Devices" pageName="Device Registration" />
      </AppHeader>
      <BaseForm
        isUpdating={false}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onBaseFormReady={setFormEventReady}
        formGenConfig={formGenConfig}
      />
    </AppLayout>
  );
};
