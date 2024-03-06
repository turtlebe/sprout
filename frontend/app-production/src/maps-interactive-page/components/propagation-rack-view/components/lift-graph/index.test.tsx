import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import {
  mockFarmDefMachine,
  mockFarmDefTailLiftMachine,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { SupportedLiftTypes } from '@plentyag/app-production/src/maps-interactive-page/types';
import { render } from '@testing-library/react';
import React from 'react';

import { PropagationLevelGraph } from '../propagation-level-graph';

import { dataTestIdsLiftGraph as dataTestIds, LiftGraph } from '.';

const mockGetCropColor = jest.fn();
const mockMapsState = {}; // empty mock state

jest.mock('../propagation-level-graph');
const mockPropagationLevelGraph = PropagationLevelGraph as jest.Mock;
mockPropagationLevelGraph.mockReturnValue(<div>mock prop diagram</div>);

const mockMachinesWithLift = [mockFarmDefMachine, mockFarmDefTailLiftMachine];
const mockMachinesWithoutLift = [mockFarmDefMachine];

describe('LiftGraph', () => {
  it('renders when lift is found in given machines', () => {
    const { queryByTestId } = render(
      <LiftGraph
        getCropColor={mockGetCropColor}
        mapsState={mockMapsState}
        machines={mockMachinesWithLift}
        liftType={SupportedLiftTypes.TailTableLift}
        queryParameters={mockDefaultQueryParameters}
      />
    );
    expect(queryByTestId(dataTestIds.container)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.displayName)).toHaveTextContent(mockMachinesWithLift[1].name);
    expect(mockPropagationLevelGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        containerLocations: mockMachinesWithLift[1].containerLocations,
        getCropColor: mockGetCropColor,
        mapsState: mockMapsState,
        showLift: true,
      }),
      expect.anything()
    );
  });
  it('does not render when lift is not found in given machines', () => {
    const { queryByTestId } = render(
      <LiftGraph
        getCropColor={mockGetCropColor}
        mapsState={mockMapsState}
        machines={mockMachinesWithoutLift}
        liftType={SupportedLiftTypes.HeadTableLift}
        queryParameters={mockDefaultQueryParameters}
      />
    );
    expect(queryByTestId(dataTestIds.container)).not.toBeInTheDocument();
  });
});
