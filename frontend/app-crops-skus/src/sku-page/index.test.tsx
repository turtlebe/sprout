import { dataTestIdsAppHeader } from '@plentyag/brand-ui/src/components/app-header';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { EditSkuButton } from '../common/components';
import { useSearchSkuTypes } from '../common/hooks';
import { mockSkus, mockSkuTypes } from '../common/test-helpers';
import { ROUTES } from '../constants';

import { dataTestIdsSkuPage as dataTestIds, SkuPage } from '.';

jest.mock('@plentyag/core/src/hooks');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('../common/components/edit-sku-button');
const mockEditSkuButton = EditSkuButton as jest.Mock;
mockEditSkuButton.mockImplementation(({ isUpdating, onEditSuccess }) => {
  return (
    <button data-testid="fake-success" onClick={() => onEditSuccess(isUpdating, 'B11Clamshell4o5oz')}>
      fake success
    </button>
  );
});

jest.mock('../common/hooks/use-search-sku-types');
const mockUseSearchSkuTypes = useSearchSkuTypes as jest.Mock;
mockUseSearchSkuTypes.mockReturnValue({
  isLoading: false,
  skuTypes: mockSkuTypes,
});

describe('SkuPage', () => {
  beforeEach(() => {
    mockUseLogAxiosErrorInSnackbar.mockClear();
    mockUseSwrAxios.mockClear();
  });

  function renderSkuPage(skuName: string) {
    const initialEntries = [ROUTES.sku(skuName)];

    const history = createMemoryHistory({ initialEntries });
    const result = render(
      <Router history={history}>
        <Route path={ROUTES.sku(':skuName')} component={SkuPage} />
      </Router>
    );

    return { history, ...result };
  }

  it('shows error when sku name not found', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockSkus, error: '' });

    const nonExistentSkuName = 'non-existent-sku-name';
    const { queryByTestId } = renderSkuPage(nonExistentSkuName);

    expect(queryByTestId(dataTestIds.noSkuFoundError)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noSkuFoundError)).toHaveTextContent(nonExistentSkuName);
  });

  it('shows header and tab panel when sku is found and no error', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockSkus, error: '' });

    const { queryByTestId } = renderSkuPage('KaleClam4oz');

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith('');

    expect(queryByTestId(dataTestIdsAppHeader.header)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.infoTab)).toBeInTheDocument();
  });

  it('shows no header or info tab panel when data is not yet loaded', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: true, data: undefined, error: '' });

    const { queryByTestId } = renderSkuPage('KaleClam4oz');

    expect(queryByTestId(dataTestIdsAppHeader.header)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.infoTab)).not.toBeInTheDocument();
  });

  it('shows error loading sku data', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined, error: 'ouch' });

    renderSkuPage('KaleClam4oz');

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith('ouch');
  });

  it('route is changed when new sku is created', async () => {
    const mockRevalidate = jest.fn();

    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockSkus, error: '', revalidate: mockRevalidate });

    const { history, queryAllByTestId } = renderSkuPage('KaleClam4oz');

    const buttons = queryAllByTestId('fake-success');
    expect(buttons).toHaveLength(2);

    expect(history.location.pathname).toBe('/crops-skus/skus/KaleClam4oz');

    // edit button - revalidates and changes to mock edit location: B11Clamshell4o5oz
    buttons[0].click();
    await waitFor(() => expect(mockRevalidate).toHaveBeenCalled());
    expect(history.location.pathname).toBe('/crops-skus/skus/B11Clamshell4o5oz');

    mockRevalidate.mockClear();

    // create button - revalidates and changes to mock create location: B11Clamshell4o5oz
    buttons[1].click();
    await waitFor(() => expect(mockRevalidate).toHaveBeenCalled());
    expect(history.location.pathname).toBe('/crops-skus/skus/B11Clamshell4o5oz');
  });
});
