import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { mockMapStateForTable } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-map-state-data';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsFiltersButton as dataTestIds, FiltersButton } from '.';

import { AgeCohortSlider } from './components/age-cohort-slider';
import { SelectCrops } from './components/select-crops';
import { SelectLabels } from './components/select-labels';

jest.mock('./components/age-cohort-slider');
const mockAgeCohortSlider = AgeCohortSlider as jest.MockedFunction<typeof AgeCohortSlider>;
const ageCohortSliderDataTestId = 'mock-age-cohort-slider';
mockAgeCohortSlider.mockReturnValue(<div data-testid={ageCohortSliderDataTestId}>mock age cohort slider</div>);

jest.mock('./components/select-crops');
const mockSelectCrops = SelectCrops as jest.MockedFunction<typeof SelectCrops>;
const selectCropsDataTestId = 'mock-select-crops';
mockSelectCrops.mockReturnValue(<div data-testid={selectCropsDataTestId}>mock select crops</div>);

jest.mock('./components/select-labels');
const mockSelectLabels = SelectLabels as jest.MockedFunction<typeof SelectLabels>;
const selectLabaelsDataTestId = 'mock-select-labels';
mockSelectLabels.mockReturnValue(<div data-testid={selectLabaelsDataTestId}>mock select labels</div>);

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter');
const mockUseQueryParameter = useQueryParameter as jest.MockedFunction<typeof useQueryParameter>;

describe('FiltersButton', () => {
  beforeEach(() => {
    mockUseQueryParameter.mockReturnValue({
      parameters: mockDefaultQueryParameters,
      setParameters: jest.fn(),
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });
  });

  it('renders filters button', () => {
    const { queryByTestId } = render(<FiltersButton mapsState={mockMapStateForTable} />);

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).toHaveTextContent('FILTERS');
    expect(queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon')).not.toBeInTheDocument();
  });

  it('shows popover items when clicking on filters button', () => {
    const { queryByTestId } = render(<FiltersButton mapsState={mockMapStateForTable} />);

    expect(queryByTestId(ageCohortSliderDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(selectCropsDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(selectLabaelsDataTestId)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(ageCohortSliderDataTestId)).toBeInTheDocument();
    expect(queryByTestId(selectCropsDataTestId)).toBeInTheDocument();
    expect(queryByTestId(selectLabaelsDataTestId)).toBeInTheDocument();
  });

  it('does not show clear filters button when filters are not applied', () => {
    mockUseQueryParameter.mockReturnValue({
      parameters: mockDefaultQueryParameters,
      setParameters: jest.fn(),
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });

    const { queryByTestId } = render(<FiltersButton mapsState={mockMapStateForTable} />);

    expect(queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon')).not.toBeInTheDocument();
  });

  it('clears filters when clicking on delete button', () => {
    const mockSetParameters = jest.fn();
    mockUseQueryParameter.mockReturnValue({
      parameters: { ...mockDefaultQueryParameters, ageCohortDate: new Date() },
      setParameters: mockSetParameters,
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });

    const { queryByTestId } = render(<FiltersButton mapsState={mockMapStateForTable} />);

    const deleteButton = queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon');
    expect(deleteButton).toBeInTheDocument();

    expect(mockSetParameters).not.toHaveBeenCalled();

    fireEvent.click(deleteButton);

    expect(mockSetParameters).toHaveBeenCalledWith({
      ageCohortDate: mockDefaultQueryParameters.ageCohortDate,
      selectedCrops: mockDefaultQueryParameters.selectedCrops,
      selectedLabels: mockDefaultQueryParameters.selectedLabels,
    });
  });

  it('shows filters are applied when crops are selected', () => {
    mockUseQueryParameter.mockReturnValue({
      parameters: { ...mockDefaultQueryParameters, selectedCrops: ['BAC'] },
      setParameters: jest.fn(),
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });

    const { queryByTestId } = render(<FiltersButton mapsState={mockMapStateForTable} />);

    const deleteButton = queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon');
    expect(deleteButton).toBeInTheDocument();
  });

  it('shows filters are applied when labels are selected', () => {
    mockUseQueryParameter.mockReturnValue({
      parameters: { ...mockDefaultQueryParameters, selectedLabels: ['broken_tower'] },
      setParameters: jest.fn(),
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });

    const { queryByTestId } = render(<FiltersButton mapsState={mockMapStateForTable} />);

    const deleteButton = queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon');
    expect(deleteButton).toBeInTheDocument();
  });
});
