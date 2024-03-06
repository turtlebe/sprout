import { render } from '@testing-library/react';
import React from 'react';

import { useGetFarmDefObject } from '../../hooks/use-get-farm-def-object';
import { mockResult } from '../search/mock-search-result';

import { dataTestIds, Location } from '.';

jest.mock('../../hooks/use-get-farm-def-object');
const mockUseGetFarmDefObject = useGetFarmDefObject as jest.Mock;

describe('Location', () => {
  beforeEach(() => {
    mockUseGetFarmDefObject.mockReturnValue({ data: undefined });
  });

  it('shows location site, area and line', () => {
    const { queryByTestId } = render(<Location location={mockResult.location} />);
    expect(queryByTestId(dataTestIds.location)).toHaveTextContent('SSF2/VerticalGrow/GrowRoom');
  });

  it('shows location site, area, line and machine name when provided', () => {
    const mockFarmDefMachine = {
      name: 'machine1',
    };
    mockUseGetFarmDefObject.mockImplementationOnce(() => ({ data: mockFarmDefMachine }));

    const { queryByTestId } = render(<Location location={mockResult.location} />);
    expect(queryByTestId(dataTestIds.location)).toHaveTextContent('SSF2/VerticalGrow/GrowRoom/machine1');
  });

  it('shows location site, area, line, machine name and container location name when available', () => {
    const mockFarmDefMachine = {
      name: 'machine1',
      containerLocations: {
        Location1: { index: 35, name: 'local1', ref: '32d60718-2753-4b35-b67c-58fcb88422e8:containerLocation-T35' },
      },
    };

    mockUseGetFarmDefObject.mockImplementationOnce(() => ({ data: mockFarmDefMachine }));

    const { queryByTestId } = render(<Location location={mockResult.location} />);
    expect(queryByTestId(dataTestIds.location)).toHaveTextContent('SSF2/VerticalGrow/GrowRoom/machine1/local1');
  });
});
