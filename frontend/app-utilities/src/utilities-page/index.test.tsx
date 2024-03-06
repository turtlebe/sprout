import { dataTestIdsSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { act, render, waitFor } from '@testing-library/react';
import React from 'react';

import { dataTestIds, UtilitiesPage } from '.';

import { useGetData } from './hooks';

jest.mock('@plentyag/core/src/utils/request');
jest.mock('./hooks/use-get-data');

const mockUseGetData = useGetData as jest.Mock;

describe('ApiDocsHome', () => {
  it('loads initial data', () => {
    mockUseGetData.mockReturnValue({ isValidating: true });

    const { getByTestId } = render(<UtilitiesPage />);

    expect(getByTestId(dataTestIds.loader)).toHaveStyle('visibility: visible;');
    expect(getByTestId(dataTestIds.buttonEditSpreadsheet)).toBeDisabled();
  });

  it('enables the spreadsheet link once initial data has loaded', () => {
    mockUseGetData.mockReturnValue({ data: { sheet: 'https://mock.com' }, isValidating: false });

    const { getByTestId } = render(<UtilitiesPage />);

    expect(getByTestId(dataTestIds.buttonEditSpreadsheet)).not.toBeDisabled();
    expect(getByTestId(dataTestIds.loader)).toHaveStyle('visibility: hidden;');
    expect(getByTestId(dataTestIds.buttonEditSpreadsheet)).toHaveAttribute('href', 'https://mock.com');
  });

  it('successfully syncs', async () => {
    mockUseGetData.mockReturnValue({});
    (axiosRequest as jest.Mock).mockImplementation(async () => Promise.resolve({ data: { json: 'mock-json' } }));

    const { queryByTestId } = render(<UtilitiesPage />);

    expect(queryByTestId(dataTestIds.syncResponse)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    expect(queryByTestId(dataTestIds.buttonSync)).toBeTruthy();
    act(() => queryByTestId(dataTestIds.buttonSync)?.click());

    await waitFor(() => expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument());
    expect(queryByTestId(dataTestIds.syncResponse)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.syncResponse)).toHaveTextContent('{ "json": "mock-json" }');
  });

  it('fails to sync and shows a snackbar', async () => {
    mockUseGetData.mockReturnValue({});
    (axiosRequest as jest.Mock).mockImplementation(async () => Promise.reject({ response: { data: 'error' } }));

    const { queryByTestId } = render(<UtilitiesPage />);

    expect(queryByTestId(dataTestIds.syncResponse)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    expect(queryByTestId(dataTestIds.buttonSync)).toBeTruthy();
    act(() => queryByTestId(dataTestIds.buttonSync)?.click());

    await waitFor(() => expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument());
    expect(queryByTestId(dataTestIds.syncResponse)).not.toBeInTheDocument();
  });

  it('has a link to controls', () => {
    const { getByTestId } = render(<UtilitiesPage />);

    expect(getByTestId(dataTestIds.buttonControls)).toHaveAttribute(
      'href',
      '/controls/TIGRIS/NUTRIENT?control=nutrient_dosing'
    );
  });
});
