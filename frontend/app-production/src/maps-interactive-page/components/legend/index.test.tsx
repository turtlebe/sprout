import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mockMapsState, mockMapsStateWithThreeCrops, mocksResourcesState } from '../../test-helpers/mock-maps-state';
import { EMPTY_CONTAINER_COLOR, MapsState } from '../../types';

import { CROPS_BASE_URL, dataTestIdsLegend as dataTestIds, Legend } from '.';

import { EMPTY_CONTAINER } from './types';

function mockGetCropColor(cropName: string) {
  const colorMap = {
    BAC: 'red',
    WHC: 'blue',
  };

  return colorMap[cropName];
}

describe('Legend', () => {
  function renderLegend(mapsState: MapsState, showCropLinks: boolean) {
    return render(<Legend mapsState={mapsState} getCropColor={mockGetCropColor} showCropLinks={showCropLinks} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  it('renders a legend of crops with color, count and links to crop page', () => {
    const { queryByTestId, queryAllByTestId } = renderLegend(mockMapsState, true);

    // should be two crop items in legend: 'BAC' and mixed container 'BAC,WHC'

    // BAC
    expect(queryByTestId(dataTestIds.legendItemColorBox('BAC'))).toHaveStyle({ background: 'red' });
    expect(queryByTestId(dataTestIds.legendItemCount('BAC'))).toHaveTextContent('(2)');
    expect(queryByTestId(dataTestIds.legendItemLink('BAC'))).toHaveAttribute('href', `${CROPS_BASE_URL}BAC`);

    // BAC,WHC
    // note: test below works but there is bug in jest/jest-dom that basically matches anything
    // here, hopefully someday if it is fixed then this will work.
    // see: https://github.com/testing-library/jest-dom/issues/68
    expect(queryByTestId(dataTestIds.legendItemColorBox('BAC,WHC'))).toHaveStyle({
      background: 'linear-gradient(135deg, red 50%, blue 50%',
    });
    expect(queryByTestId(dataTestIds.legendItemCount('BAC,WHC'))).toHaveTextContent('(1)');
    const links = queryAllByTestId(dataTestIds.legendItemLink('BAC,WHC'));
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', `${CROPS_BASE_URL}BAC`);
    expect(links[1]).toHaveAttribute('href', `${CROPS_BASE_URL}WHC`);

    expect(queryByTestId(dataTestIds.legendItemContainer('BAC,WHC'))).toHaveTextContent('BAC/WHC');
  });

  it('renders a legend item with ellipse when more than two crops', () => {
    const { queryByTestId } = renderLegend(mockMapsStateWithThreeCrops, true);
    expect(queryByTestId(dataTestIds.legendItemContainer('BAC,WHC,SAS'))).toHaveTextContent('BAC/WHC/...(1)');
  });

  it('does not render link to crop page', () => {
    const { queryByTestId } = renderLegend(mockMapsState, false);

    // does not show link to BAC crop in legend
    expect(queryByTestId(dataTestIds.legendItemLink('BAC'))).not.toBeInTheDocument();

    // but still shows crop name
    expect(queryByTestId(dataTestIds.legendItemCrop('BAC'))).toHaveTextContent('BAC');
  });

  it('renders the number of empty containers with the empty color', () => {
    const { queryByTestId } = renderLegend(mockMapsState, false);

    expect(queryByTestId(dataTestIds.legendItemColorBox(EMPTY_CONTAINER))).toHaveStyle({
      background: `${EMPTY_CONTAINER_COLOR}`,
    });
    expect(queryByTestId(dataTestIds.legendItemCount(EMPTY_CONTAINER))).toHaveTextContent('(1)');
  });

  it('does not render empty container in legend if there are no empty containers', () => {
    const mockMapsStateWithNoEmptyContainers: MapsState = {
      [mocksResourcesState[0].location.containerLocation.farmdefContainerLocationRef]: {
        resourceState: mocksResourcesState[0],
      },
      [mocksResourcesState[1].location.containerLocation.farmdefContainerLocationRef]: {
        resourceState: mocksResourcesState[1],
      },
    };

    const { queryByTestId } = renderLegend(mockMapsStateWithNoEmptyContainers, false);

    expect(queryByTestId(dataTestIds.legendItemColorBox(EMPTY_CONTAINER))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.legendItemCount(EMPTY_CONTAINER))).not.toBeInTheDocument();
  });
});
