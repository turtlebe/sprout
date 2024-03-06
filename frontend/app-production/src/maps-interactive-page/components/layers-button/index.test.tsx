import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { fireEvent, render } from '@testing-library/react';

import { dataTestIdsLayersButton as dataTestIds, LayersButton } from '.';

import { ShowCommentsLayerButton } from './components/show-comments-layer-button';
import { ShowIrrigationLayerButton } from './components/show-irrigation-layer-button';
import { ShowSerialsLayerButton } from './components/show-serials-layer-button';

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter');
const mockUseQueryParameter = useQueryParameter as jest.MockedFunction<typeof useQueryParameter>;

jest.mock('./components/show-serials-layer-button');
const mockShowSerialsLayerButton = ShowSerialsLayerButton as jest.MockedFunction<typeof ShowSerialsLayerButton>;
const showSerialsLayerButtonDataTestId = 'mock-show-serials-layer-button';
mockShowSerialsLayerButton.mockReturnValue(
  <div data-testid={showSerialsLayerButtonDataTestId}>mock show serials switch</div>
);

jest.mock('./components/show-irrigation-layer-button');
const mockShowIrrigationLayerButton = ShowIrrigationLayerButton as jest.MockedFunction<
  typeof ShowIrrigationLayerButton
>;
const showIrrigationLayerButtonDataTestId = 'mock-show-irrigation-layer-button';
mockShowIrrigationLayerButton.mockReturnValue(
  <div data-testid={showIrrigationLayerButtonDataTestId}>mock show irrigation layer button</div>
);

jest.mock('./components/show-comments-layer-button');
const mockShowCommentsLayerButton = ShowCommentsLayerButton as jest.MockedFunction<typeof ShowCommentsLayerButton>;
const showCommentsLayerButtonDataTestId = 'mock-show-comments-layer-button';
mockShowCommentsLayerButton.mockReturnValue(
  <div data-testid={showCommentsLayerButtonDataTestId}>mock show comments layer button</div>
);

describe('LayersButton', () => {
  beforeEach(() => {
    mockUseQueryParameter.mockReturnValue({
      parameters: mockDefaultQueryParameters,
      setParameters: jest.fn(),
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });
  });

  it('renders layers button', () => {
    const { queryByTestId } = render(<LayersButton />);
    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).toHaveTextContent('LAYERS');
  });

  it('shows popover items when clicking on layers button', () => {
    const { queryByTestId } = render(<LayersButton />);

    expect(queryByTestId(showSerialsLayerButtonDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(showIrrigationLayerButtonDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(showCommentsLayerButtonDataTestId)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(showSerialsLayerButtonDataTestId)).toBeInTheDocument();
    expect(queryByTestId(showIrrigationLayerButtonDataTestId)).toBeInTheDocument();
    expect(queryByTestId(showCommentsLayerButtonDataTestId)).toBeInTheDocument();
  });

  it('does not show clear layers button when layers are not applied', () => {
    mockUseQueryParameter.mockReturnValue({
      parameters: mockDefaultQueryParameters,
      setParameters: jest.fn(),
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });

    const { queryByTestId } = render(<LayersButton />);

    expect(queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon')).not.toBeInTheDocument();
  });

  it('clears layers when clicking on clear delete button', () => {
    const mockSetParameters = jest.fn();
    mockUseQueryParameter.mockReturnValue({
      parameters: { ...mockDefaultQueryParameters, showSerials: true },
      setParameters: mockSetParameters,
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });

    const { queryByTestId } = render(<LayersButton />);

    const deleteButton = queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon');
    expect(deleteButton).toBeInTheDocument();

    expect(mockSetParameters).not.toHaveBeenCalled();

    fireEvent.click(deleteButton);

    expect(mockSetParameters).toHaveBeenCalledWith({
      showSerials: false,
      showIrrigationLayer: false,
      showCommentsLayer: false,
    });
  });
});
