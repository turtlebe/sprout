import { useGetRequest, usePostRequest, useRedisJsonObjectApi, useSwrAxios } from '@plentyag/core/src/hooks';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { buildDmsDevice } from '../common/test-helpers/devices';
import { DmsDevice } from '../common/types';
import { ROUTES } from '../routes';

import { dataTestIdsDevicePage as dataTestIds, DevicePage, getDeviceUrl, getMappedDeviceLocationsUrl } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-redis-json-object-api');

const revalidate = jest.fn();
const makePostRequest = jest.fn();
const makeGetRequest = jest.fn();
const createRedisJsonObject = jest.fn();
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUseGetRequest = useGetRequest as jest.Mock;
const mockUseRedisJsonObjectApi = useRedisJsonObjectApi as jest.Mock;

function renderDevicePage(device: DmsDevice) {
  const history = createMemoryHistory({ initialEntries: [ROUTES.devicePage(device.id)] });

  mockUseSwrAxios.mockImplementation(args => {
    if (args?.url?.includes(getDeviceUrl(device.id))) {
      return { data: device, isValidating: false, revalidate };
    }
    if (args?.url?.includes(getMappedDeviceLocationsUrl(device.id))) {
      return { data: [], isValidating: false, revalidate };
    }

    return { data: undefined, isValidating: false, revalidate };
  });

  mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: makePostRequest });
  mockUseGetRequest.mockReturnValue({ isLoading: false, makeRequest: makeGetRequest });
  mockUseRedisJsonObjectApi.mockReturnValue({ isLoading: false, createRedisJsonObject });

  return render(
    <Router history={history}>
      <Route path={ROUTES.devicePage(':deviceId')} component={DevicePage} />
    </Router>
  );
}

describe('DevicePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a page for a Sprinkle2', () => {
    const device = buildDmsDevice({ deviceTypeName: 'Sprinkle2FIR' });

    const { queryByTestId } = renderDevicePage(device);

    expect(queryByTestId(dataTestIds.header)).toHaveTextContent(device.serial);
    expect(queryByTestId(dataTestIds.deviceType)).toHaveTextContent(device.deviceTypeName);
    expect(queryByTestId(dataTestIds.macAddress)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.upgradeFirmware)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.location)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.decommissionDevice)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.commissionDevice)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.comeFindMe)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.rebootDevice)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.testSequences)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.hathorConsoleLogTab)).not.toBeInTheDocument();
  });

  it('renders a page for a Hathor', () => {
    const device = buildDmsDevice({ deviceTypeName: 'Hathor', properties: { macAddress: '1234' } });

    const { queryByTestId } = renderDevicePage(device);

    expect(queryByTestId(dataTestIds.header)).toHaveTextContent(device.serial);
    expect(queryByTestId(dataTestIds.deviceType)).toHaveTextContent(device.deviceTypeName);
    expect(queryByTestId(dataTestIds.macAddress)).toHaveTextContent(device.properties.macAddress);
    expect(queryByTestId(dataTestIds.upgradeFirmware)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.location)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.decommissionDevice)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.commissionDevice)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.comeFindMe)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.rebootDevice)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.testSequences)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.hathorConsoleLogTab)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.commentsTab)).toBeInTheDocument();
  });

  it('shows the device location path when the device is commissioned', () => {
    const device = buildDmsDevice({ deviceTypeName: 'Hathor', withLocation: true });

    const { queryByTestId } = renderDevicePage(device);

    expect(queryByTestId(dataTestIds.location)).toHaveTextContent(getShortenedPath(device.location.path));
    expect(queryByTestId(dataTestIds.decommissionDevice)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.commissionDevice)).not.toBeInTheDocument();
  });

  it('does not allow to upgade firmware when the device is not compatible', () => {
    const device = buildDmsDevice({ deviceTypeName: 'Coco' });

    const { queryByTestId } = renderDevicePage(device);

    expect(queryByTestId(dataTestIds.upgradeFirmware)).not.toBeInTheDocument();
  });
});
