import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { Dashboard } from '@plentyag/core/src/types/environment';
import * as yup from 'yup';

export interface UseDashboardFormGenConfig {
  dashboard?: Dashboard;
  username: string;
}
export interface UseDashboardFormGenConfigReturn extends FormGen.Config {}

export const useDashboardFormGenConfig = ({
  dashboard,
  username,
}: UseDashboardFormGenConfig): UseDashboardFormGenConfigReturn => {
  const isUpdating = Boolean(dashboard);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';

  return {
    title: isUpdating ? 'Edit Dashboard' : 'Create Dashboard',
    createEndpoint: EVS_URLS.dashboards.createUrl(),
    updateEndpoint: EVS_URLS.dashboards.updateUrl(dashboard),
    serialize: values => ({
      ...values,
      [createdOrUpdatedBy]: username,
    }),
    fields: [
      {
        type: 'TextField',
        label: 'Dashboard Name',
        name: 'name',
        validate: yup.string().required(),
      },
    ],
  };
};
