import { buildMetric, buildWidget, mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import {
  changeTextField,
  chooseFromAutocomplete,
  chooseFromSelect,
  getSubmitButton,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useGetRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { WidgetType } from '@plentyag/core/src/types/environment';
import { axiosRequest } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsDialogExportAsDashboard as dataTestIds, DialogExportAsDashboard } from '.';

import { NewOrExistingDashboardOption } from './hooks/use-export-to-dashboard-form-gen-config';

jest.mock('@plentyag/core/src/core-store');
jest.mock('@plentyag/core/src/utils/request');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-axios');

const metrics = [
  buildMetric({ path: 'sites/SITE1', measurementType: 'TEMPERATURE', observationName: 'AirTemperature' }),
  buildMetric({ path: 'sites/SITE1  ', measurementType: 'TEMPERATURE', observationName: 'WaterTemperature' }),
];
const [dashboard] = mockDashboards;
const { id: dashboardId } = dashboard;
const values = {
  name: dashboard.name,
  widgetType: WidgetType.historical,
};

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseGetRequest = useGetRequest as jest.Mock;
const mockAxiosRequest = axiosRequest as jest.Mock;
const onClose = jest.fn();
const onSuccess = jest.fn();

function renderDialogExportAsDashboard() {
  return render(
    <MemoryRouter>
      <GlobalSnackbar>
        <DialogExportAsDashboard open={true} onClose={onClose} onSuccess={onSuccess} metrics={metrics} />
      </GlobalSnackbar>
    </MemoryRouter>
  );
}

describe('DialogExportAsDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCurrentUser();

    // Mock DialogExportAsDashboards's axios requests
    mockAxiosRequest.mockImplementation(async args => {
      if (args.url.includes(EVS_URLS.dashboards.createUrl())) {
        return Promise.resolve({ data: dashboard });
      }

      if (args.url.includes(EVS_URLS.widgets.listUrl())) {
        return Promise.resolve({ data: buildPaginatedResponse([buildWidget({ rowStart: 3, rowEnd: 4 })]) });
      }

      return Promise.resolve({ data: buildWidget({}) });
    });

    // Mock AutocompleteTypeAhead's useSwrAxios request
    mockUseSwrAxios.mockImplementation(args => {
      if (args?.url?.includes(EVS_URLS.dashboards.listUrl())) {
        return { data: buildPaginatedResponse([dashboard]), isValidating: false };
      }

      return { data: undefined, isValidating: false };
    });

    // Mock AutocompleteTypeAhead's useGetRequest
    mockUseGetRequest.mockImplementation(() => ({
      data: buildPaginatedResponse([dashboard]),
      isLoading: false,
      makeRequest: jest.fn(),
    }));
  });

  it('renders a dialog and calls the `onClose` callback', () => {
    const { queryByTestId } = renderDialogExportAsDashboard();

    expect(queryByTestId(dataTestIds.defaultDialog.dialog)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.defaultDialog.close).click();

    expect(onClose).toHaveBeenCalled();
  });

  it('creates a dashboard with two widgets', async () => {
    const { queryByTestId } = renderDialogExportAsDashboard();

    expect(queryByTestId(dataTestIds.defaultDialog.dialog)).toBeInTheDocument();
    expect(mockAxiosRequest).toHaveBeenCalledTimes(0);

    await actAndAwait(() => openSelect('newOrExistingDashboard'));
    await actAndAwait(() => chooseFromSelect(NewOrExistingDashboardOption.new));
    await actAndAwait(() => changeTextField('name', values.name));
    await actAndAwait(() => openSelect('widgetType'));
    await actAndAwait(() => chooseFromSelect(values.widgetType));
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onSuccess).toHaveBeenCalled();
    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      url: EVS_URLS.dashboards.createUrl(),
      method: 'POST',
      data: { name: values.name, createdBy: 'olittle' },
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
      url: EVS_URLS.widgets.createUrl(),
      method: 'POST',
      data: expect.objectContaining({ dashboardId, items: [{ itemId: metrics[0].id, itemType: 'METRIC' }] }),
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(3, {
      url: EVS_URLS.widgets.createUrl(),
      method: 'POST',
      data: expect.objectContaining({ dashboardId, items: [{ itemId: metrics[1].id, itemType: 'METRIC' }] }),
    });
    expect(mockUseSwrAxios).not.toHaveBeenCalledWith(expect.objectContaining({ url: expect.any(String) }));
    expect(mockUseGetRequest).not.toHaveBeenCalledWith(expect.objectContaining({ url: expect.any(String) }));
  });

  it('adds two widgets to an existing dashboard', async () => {
    const { queryByTestId } = renderDialogExportAsDashboard();

    expect(queryByTestId(dataTestIds.defaultDialog.dialog)).toBeInTheDocument();
    expect(mockAxiosRequest).toHaveBeenCalledTimes(0);

    await actAndAwait(() => openSelect('newOrExistingDashboard'));
    await actAndAwait(() => chooseFromSelect(NewOrExistingDashboardOption.existing));
    await actAndAwait(() => openAutocomplete('dashboardId'));
    await actAndAwait(() => chooseFromAutocomplete(values.name));
    await actAndAwait(() => openSelect('widgetType'));
    await actAndAwait(() => chooseFromSelect(values.widgetType));
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onSuccess).toHaveBeenCalled();
    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      url: EVS_URLS.widgets.listUrl({ dashboardId, sortBy: 'rowEnd', order: 'desc' }),
      method: 'GET',
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
      url: EVS_URLS.widgets.createUrl(),
      method: 'POST',
      data: expect.objectContaining({ dashboardId, items: [{ itemId: metrics[0].id, itemType: 'METRIC' }] }),
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(3, {
      url: EVS_URLS.widgets.createUrl(),
      method: 'POST',
      data: expect.objectContaining({ dashboardId, items: [{ itemId: metrics[1].id, itemType: 'METRIC' }] }),
    });
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: EVS_URLS.dashboards.listUrl() });
    expect(mockUseGetRequest).toHaveBeenCalledWith({ url: EVS_URLS.dashboards.listUrl() });
  });
});
