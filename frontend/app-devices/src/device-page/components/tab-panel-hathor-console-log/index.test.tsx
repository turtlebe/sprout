import { mockDevices, mockDmsDevice } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';

import {
  dataTestIdsTabPanelHathorConsoleLog as dataTestIds,
  NO_CONSOLE_LOG_MESSAGE,
  TabPanelHathorConsoleLog,
} from '.';

import { mockObservations } from './test-mocks';

const device = mockDmsDevice;
const deviceWithoutCertificate = mockDevices[4];

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const makeRequest = jest.fn();

describe('TabPanelHathorConsoleLog', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with an empty state', () => {
    mockUsePostRequest.mockReturnValue({ makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      if (args?.data?.observationName) {
        return {
          isValidating: false,
          data: [],
          error: undefined,
        };
      }

      return { isValidating: false, data: undefined, error: undefined };
    });

    const { queryByTestId } = render(<TabPanelHathorConsoleLog device={device} />, { wrapper: GlobalSnackbar });
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(NO_CONSOLE_LOG_MESSAGE);
    expect(queryByTestId(dataTestIds.consoleLog)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.latestLogTimestamp)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.requestButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.requestButton)).toBeEnabled();
  });

  it('renders with console log', () => {
    mockUsePostRequest.mockReturnValue({ makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      if (args?.url.includes('search-normalized-observations')) {
        return {
          data: buildPaginatedResponse(
            mockObservations.filter(observation => observation.observationName === args.data.observationName)
          ),
          error: undefined,
          isValidating: false,
        };
      }

      return { isValidating: false, data: undefined, error: undefined };
    });
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess());

    const { queryByTestId } = render(<TabPanelHathorConsoleLog device={device} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toHaveTextContent(NO_CONSOLE_LOG_MESSAGE);
    expect(queryByTestId(dataTestIds.consoleLog)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.consoleLog)).toHaveTextContent('log entry 1 ' + 'log entry 2');
    expect(queryByTestId(dataTestIds.latestLogTimestamp)).toHaveTextContent(
      `Latest log received at ${DateTime.fromSQL(mockObservations[0].observedAt, { zone: 'utc' })
        .toLocal()
        .toFormat(DateTimeFormat.VERBOSE_DEFAULT)}`
    );
    expect(queryByTestId(dataTestIds.latestLogTimestamp)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.requestButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.requestButton)).toBeEnabled();
  });

  it('requests console log', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = render(<TabPanelHathorConsoleLog device={device} />, { wrapper: GlobalSnackbar });

    expect(makeRequest).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.requestButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.requestButton)).toBeEnabled();

    await actAndAwait(() => queryByTestId(dataTestIds.requestButton).click());
    expect(queryByTestId(dataTestIds.requestButton)).toBeDisabled();

    expect(makeRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({
        command: 'SEND_CONSOLE_LOG',
      }),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('requests console log without certificate', () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = render(<TabPanelHathorConsoleLog device={deviceWithoutCertificate} />, {
      wrapper: GlobalSnackbar,
    });

    expect(makeRequest).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.requestButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.requestButton)).toBeDisabled();
  });
});
