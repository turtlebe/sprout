import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { dataTestIdsSnackbar, GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { NormalizedObservation, PaginatedList } from '@plentyag/core/src/types';
import { act, render, waitFor } from '@testing-library/react';
import React from 'react';

import {
  CLEAR_LUMINAIRE_FAULTS_SUCCESS_MESSAGE,
  dataTestIdsTabPanelDeviceFaults as dataTestIds,
  NO_FAULTS_MESSAGE,
  TabPanelDeviceFaults,
} from '.';

import { mockObservations } from './test-mocks';

const device = mockDevices[4];

jest.mock('@plentyag/core/src/hooks');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const makeRequest = jest.fn();

describe('TabPanelDeviceFaults', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    makeRequest.mockRestore();
  });

  it('renders an empty Card', () => {
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

    const { queryByTestId } = render(<TabPanelDeviceFaults device={device} />);

    expect(queryByTestId(dataTestIds.tableFaults)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cardAction)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogConfirmation)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(NO_FAULTS_MESSAGE);
  });

  it('sends a request to ES to clear luminaire faults', async () => {
    mockUsePostRequest.mockReturnValue({ makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      const paginatedResponse: PaginatedList<NormalizedObservation> = {
        data: mockObservations.filter(observation => observation.observationName === args.data.observationName),
        meta: { total: 1, limit: 100, offset: 0 },
      };
      if (args?.data?.observationName) {
        return {
          isValidating: false,
          data: paginatedResponse,
          error: undefined,
        };
      }

      return { isValidating: false, data: undefined, error: undefined };
    });
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess());

    const { queryByTestId } = render(<TabPanelDeviceFaults device={device} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.tableFaults)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cardAction)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.clearLuminaireFaults)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogConfirmation)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.cardAction).click();

    // -> Dropdown opens
    expect(queryByTestId(dataTestIds.clearLuminaireFaults)).toBeInTheDocument();

    queryByTestId(dataTestIds.clearLuminaireFaults).click();

    // -> Dialog opens
    expect(queryByTestId(dataTestIds.dialogConfirmation)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.confirm).click());

    // -> Dialog closed
    await waitFor(() => expect(queryByTestId(dataTestIds.dialogConfirmation)).not.toBeInTheDocument());
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ faults: { requestToEnter: true } }) })
    );
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent(CLEAR_LUMINAIRE_FAULTS_SUCCESS_MESSAGE);
  });

  it('clears luminaire fault events from UI', () => {
    jest.useFakeTimers();

    mockUsePostRequest.mockReturnValue({ makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      const paginatedResponse: PaginatedList<NormalizedObservation> = {
        data: mockObservations.filter(observation => observation.observationName === args.data.observationName),
        meta: { total: 1, limit: 100, offset: 0 },
      };
      if (args?.data?.observationName) {
        return {
          isValidating: false,
          data: paginatedResponse,
          error: undefined,
        };
      }

      return { isValidating: false, data: undefined, error: undefined };
    });
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess());

    const { queryByTestId } = render(<TabPanelDeviceFaults device={device} delay={100} />);

    expect(queryByTestId(dataTestIds.tableRow(mockObservations[2]))).toBeInTheDocument();

    mockObservations[1].valueString = 'false';

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(queryByTestId(dataTestIds.tableRow(mockObservations[2]))).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('shows an error and closes the modal to clear Luminaires', async () => {
    mockUsePostRequest.mockReturnValue({ makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      const paginatedResponse: PaginatedList<NormalizedObservation> = {
        data: mockObservations.filter(observation => observation.observationName === args.data.observationName),
        meta: { total: 1, limit: 100, offset: 0 },
      };
      if (args?.data?.observationName) {
        return {
          isValidating: false,
          data: paginatedResponse,
          error: undefined,
        };
      }

      return { isValidating: false, data: undefined, error: undefined };
    });
    makeRequest.mockImplementation(({ onError }) => onError('error-message'));

    const { queryByTestId } = render(<TabPanelDeviceFaults device={device} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.tableFaults)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cardAction)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.clearLuminaireFaults)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogConfirmation)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.cardAction).click();

    // -> Dropdown opens
    expect(queryByTestId(dataTestIds.clearLuminaireFaults)).toBeInTheDocument();

    queryByTestId(dataTestIds.clearLuminaireFaults).click();

    // -> Dialog opens
    expect(queryByTestId(dataTestIds.dialogConfirmation)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.confirm).click());

    // -> Dialog closed
    await waitFor(() => expect(queryByTestId(dataTestIds.dialogConfirmation)).not.toBeInTheDocument());
    expect(makeRequest).toHaveBeenCalled();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent('error-message');
  });
});
