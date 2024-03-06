import { dataTestIdsAppHeader } from '@plentyag/brand-ui/src/components/app-header';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { EditCropButton } from '../common/components';
import { mockCrops } from '../common/test-helpers';
import { GrowConfigurationType } from '../common/types';
import { ROUTES } from '../constants';

import { CropPage, dataTestIdsCropPage as dataTestIds } from '.';

import { AssociatedCropsSkus, CropBasics, dataTestIdsCropInformationPanel } from './components';

jest.mock('@plentyag/core/src/hooks');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('../common/components/edit-crop-button');
const mockEditCropButton = EditCropButton as jest.Mock;
mockEditCropButton.mockImplementation(({ isUpdating, onEditSuccess }) => {
  return (
    <button data-testid="fake-success" onClick={() => onEditSuccess(isUpdating, 'B11')}>
      fake success
    </button>
  );
});

jest.mock('./components/crop-basics');
const mockCropBasics = CropBasics as jest.Mock;
mockCropBasics.mockReturnValue(<div />);

jest.mock('./components/associated-crops-skus');
const mockAssociatedCropsSkus = AssociatedCropsSkus as jest.Mock;
mockAssociatedCropsSkus.mockReturnValue(<div />);

describe('CropPage', () => {
  beforeEach(() => {
    mockUseLogAxiosErrorInSnackbar.mockClear();
    mockUseSwrAxios.mockClear();
  });

  function renderCropPage(cropName: string) {
    const initialEntries = [`${ROUTES.crop(cropName)}`];

    const history = createMemoryHistory({ initialEntries });
    const result = render(
      <Router history={history}>
        <Route path={ROUTES.crop(':cropName')} component={CropPage} />
      </Router>
    );

    return { history, ...result };
  }

  it('shows error when crop name not found', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockCrops, error: '' });

    const nonExistentCropName = 'Bogus';
    renderCropPage(nonExistentCropName);

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(expect.stringContaining(nonExistentCropName));
  });

  it('shows header and tab panel when crop is found and no error', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockCrops, error: '' });

    const { queryByTestId } = renderCropPage('BRN');

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(false);

    expect(queryByTestId(dataTestIdsAppHeader.header)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsCropInformationPanel.root)).toBeInTheDocument();
  });

  it('shows header and tab panel when crop with a compound name is found and no error', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockCrops, error: '' });

    const { queryByTestId } = renderCropPage('BRN:COMPOUND_1');

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(false);

    expect(queryByTestId(dataTestIdsAppHeader.header)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsCropInformationPanel.root)).toBeInTheDocument();
  });

  it('shows no header or info tab panel when data is not yet loaded', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: true, data: undefined, error: '' });

    const { queryByTestId } = renderCropPage('BRN');

    expect(queryByTestId(dataTestIdsAppHeader.header)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsCropInformationPanel.root)).not.toBeInTheDocument();
  });

  it('shows error loading crop data', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined, error: 'ouch' });

    renderCropPage('BRN');

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith('ouch');
  });

  it('route is changed when new crop is created', async () => {
    const mockRevalidate = jest.fn().mockResolvedValue('done');

    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockCrops, error: '', revalidate: mockRevalidate });

    const { history, queryAllByTestId } = renderCropPage('BRN');

    const buttons = queryAllByTestId('fake-success');
    expect(buttons).toHaveLength(2);

    expect(history.location.pathname).toBe('/crops-skus/crops/BRN');

    // edit button - revalidates but does not change location
    buttons[0].click();
    await expect(mockRevalidate()).resolves.toBe('done');
    expect(history.location.pathname).toBe('/crops-skus/crops/BRN');

    // create button - revalidates and changes to mock create location: B11
    buttons[1].click();
    await expect(mockRevalidate()).resolves.toBe('done');
    expect(history.location.pathname).toBe('/crops-skus/crops/B11');
  });

  it('route is changed when new crop with a compound name is created', async () => {
    const mockRevalidate = jest.fn().mockResolvedValue('done');

    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockCrops, error: '', revalidate: mockRevalidate });

    const { history, queryAllByTestId } = renderCropPage('BRN:COMPOUND_1');

    const buttons = queryAllByTestId('fake-success');
    expect(buttons).toHaveLength(2);

    expect(history.location.pathname).toBe('/crops-skus/crops/BRN:COMPOUND_1');

    // edit button - revalidates but does not change location
    buttons[0].click();
    await expect(mockRevalidate()).resolves.toBe('done');
    expect(history.location.pathname).toBe('/crops-skus/crops/BRN:COMPOUND_1');

    // create button - revalidates and changes to mock create location: B11
    buttons[1].click();
    await expect(mockRevalidate()).resolves.toBe('done');
    expect(history.location.pathname).toBe('/crops-skus/crops/B11');
  });

  it('shows grow configuration for crop BRN', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockCrops, error: '' });

    const { queryByTestId } = renderCropPage('BRN');

    expect(queryByTestId(dataTestIds.growConfiguration)).toHaveTextContent(GrowConfigurationType.isSeedableAlone);
  });

  it('shows grow configuration for crop YCH', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockCrops, error: '' });

    const { queryByTestId } = renderCropPage('YCH');

    expect(queryByTestId(dataTestIds.growConfiguration)).toHaveTextContent(
      GrowConfigurationType.isBlendedAtSeedingMachine
    );
  });

  it('shows recipe tabs and panels for active farms that have recipe data', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockCrops, error: '' });

    const { queryByTestId } = renderCropPage('BRN');

    expect(queryByTestId(dataTestIds.recipesTab('tigris'))).toBeInTheDocument();

    // selecting the tigris recipe tab should show the panel with tigris recipes.
    expect(queryByTestId(dataTestIds.recipesTabPanel('tigris'))).not.toBeInTheDocument();
    queryByTestId(dataTestIds.recipesTab('tigris')).click();
    expect(queryByTestId(dataTestIds.recipesTabPanel('tigris'))).toBeInTheDocument();

    // lax1 is not an active farm for BRN so no tab should be present
    expect(queryByTestId(dataTestIds.recipesTab('lax1'))).not.toBeInTheDocument();
  });
});
