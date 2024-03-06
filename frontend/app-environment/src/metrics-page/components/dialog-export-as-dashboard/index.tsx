import { useDashboardHandler } from '@plentyag/app-environment/src/common/hooks';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import {
  BaseForm,
  DialogDefault,
  getDialogDefaultDataTestIds,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { Dashboard, Metric, Widget } from '@plentyag/core/src/types/environment';
import { axiosRequest, getScopedDataTestIds, parseErrorMessage } from '@plentyag/core/src/utils';
import { PaginatedList } from 'core/src/types';
import React from 'react';

import {
  ExporToDashoardFormikValues,
  NewOrExistingDashboardOption,
  useExportAsDashboardFormGenConfig,
} from './hooks/use-export-to-dashboard-form-gen-config';
import { createWidgets } from './utils/create-widgets';

const dataTestIds = getScopedDataTestIds(
  {
    defaultDialog: getDialogDefaultDataTestIds('default-dialog'),
  },
  'DialogExportAsDashboard'
);

export { dataTestIds as dataTestIdsDialogExportAsDashboard };

export interface DialogExportAsDashboard {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  metrics: Metric[];
}

export const DialogExportAsDashboard: React.FC<DialogExportAsDashboard> = ({
  open,
  onClose,
  onSuccess,
  metrics = [],
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const formGenConfig = useExportAsDashboardFormGenConfig();
  const snackbar = useGlobalSnackbar();
  const { handleCreated, handleUpdated } = useDashboardHandler();

  const handleSubmit: BaseForm<ExporToDashoardFormikValues>['onSubmit'] = async values => {
    setIsLoading(true);
    let dashboardId;
    let successCallback;
    let rowStartOffset: number = undefined;

    try {
      let response;

      if (values.newOrExistingDashboard === NewOrExistingDashboardOption.new) {
        // Create a Dashboard
        response = await axiosRequest<Dashboard>({
          url: EVS_URLS.dashboards.createUrl(),
          method: 'POST',
          data: {
            name: values.name,
            createdBy: coreStore.currentUser.username,
          },
        });

        dashboardId = response.data.id;
        successCallback = handleCreated;
      } else {
        dashboardId = values.dashboardId;
        successCallback = handleUpdated;

        // Find the Widget with the highest rowEnd so that we can place new Wigets after that one
        const { data: pagimatedWidgets } = await axiosRequest<PaginatedList<Widget>>({
          url: EVS_URLS.widgets.listUrl({ dashboardId, sortBy: 'rowEnd', order: 'desc' }),
          method: 'GET',
        });
        rowStartOffset = pagimatedWidgets?.data?.[0]?.rowEnd;
      }

      // Create Widgets
      await createWidgets({
        ...values,
        dashboardId,
        metrics,
        username: coreStore.currentUser.username,
        rowStartOffset,
      });
    } catch (error) {
      snackbar.errorSnackbar({ message: parseErrorMessage(error) });
      setIsLoading(false);
      return;
    }

    successCallback(dashboardId);
    setIsLoading(false);
    onSuccess();
  };

  return (
    <DialogDefault
      title="Export Metrics as Dashboard"
      open={open}
      onClose={onClose}
      data-testid={dataTestIds.defaultDialog.root}
    >
      <BaseForm formGenConfig={formGenConfig} onSubmit={handleSubmit} isUpdating={false} isLoading={isLoading} />
    </DialogDefault>
  );
};
