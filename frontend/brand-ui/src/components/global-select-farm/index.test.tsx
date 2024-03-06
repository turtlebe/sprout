import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES, mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useUpdateCurrentFarmDefPath } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsGlobalSelectFarm as dataTestIds, GlobalSelectFarm } from '.';

jest.mock('@plentyag/core/src/hooks/use-update-current-farm-def-path');
const mockUseUpdateCurrentFarmDefPath = useUpdateCurrentFarmDefPath as jest.Mock;
const mockMakeUpdate = jest.fn();
mockUseUpdateCurrentFarmDefPath.mockReturnValue({ makeUpdate: mockMakeUpdate, isUpdating: false });

mockGlobalSnackbar();

const mockSetCurrentFarmDefPath = jest.fn();
mockCurrentUser(undefined, { setCurrentFarmDefPath: mockSetCurrentFarmDefPath });

describe('GlobalSelectFarm', () => {
  afterEach(() => {
    mockSetCurrentFarmDefPath.mockClear();
    mockMakeUpdate.mockClear();
  });

  function renderGlobalSelectFarm() {
    const renderResult = render(<GlobalSelectFarm />);

    const textFieldSelect = renderResult.queryByTestId(dataTestIds.root).querySelector('.MuiSelect-root');

    return { textFieldSelect, ...renderResult };
  }

  it('shows TextField select options corresponding to value in "allowedFarmDefPaths"', async () => {
    const { textFieldSelect, getAllByRole } = renderGlobalSelectFarm();

    await actAndAwait(() => fireEvent.mouseDown(textFieldSelect));
    await actAndAwait(() => getAllByRole('option'));

    const allowedFarmDefPaths = DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES.allowedFarmDefPaths;
    getAllByRole('option').forEach((option, index) => {
      const path = allowedFarmDefPaths[index];
      expect(option).toHaveTextContent(getShortenedPath(path));
    });
  });

  it('has selected value from: "currentFarmDefPath"', () => {
    const { textFieldSelect } = renderGlobalSelectFarm();
    const currentFarmDefPath = DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES.currentFarmDefPath;

    expect(textFieldSelect).toHaveTextContent(getShortenedPath(currentFarmDefPath));
  });

  it('calls put makeUpdate when picking a new value', async () => {
    const { textFieldSelect, getAllByRole } = renderGlobalSelectFarm();

    await actAndAwait(() => fireEvent.mouseDown(textFieldSelect));
    await actAndAwait(() => getAllByRole('option')[1].click());

    expect(mockMakeUpdate).toHaveBeenCalledTimes(1);
    expect(mockMakeUpdate).toHaveBeenCalledWith(DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES.allowedFarmDefPaths[1]);
  });

  it('selector shows progress when updating after a selection', () => {
    mockUseUpdateCurrentFarmDefPath.mockReturnValue({ makeUpdate: mockMakeUpdate, isUpdating: true });

    const { queryByTestId } = renderGlobalSelectFarm();

    expect(queryByTestId(dataTestIds.progress)).toBeInTheDocument();
  });
});
