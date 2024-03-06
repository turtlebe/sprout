import { mockFarmDefSiteObj } from '@plentyag/core/src/farm-def/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { useLoadWorkcenters, useWorkcentersFeatureFlag } from '../../hooks';

import { dataTestIdsSelectWorkcentersStep as dataTestIds, SelectWorkcentersStep } from '.';

const mockWorkcenters = Object.values(mockFarmDefSiteObj.workCenters);

jest.mock('../../hooks/use-load-workcenters');
const mockUseGetWorkcenters = useLoadWorkcenters as jest.Mock;

jest.mock('../../hooks/use-workcenters-feature-flag');
const mockUseWorkcentersFeatureFlag = useWorkcentersFeatureFlag as jest.Mock;

describe('SelectWorkcenters', () => {
  beforeEach(() => {
    mockUseGetWorkcenters.mockReturnValue({
      isLoading: false,
      workcenters: mockWorkcenters,
    });

    mockUseWorkcentersFeatureFlag.mockReturnValue(mockWorkcenters);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows list of selectable workcenters', () => {
    const { queryByTestId } = render(<SelectWorkcentersStep onSelectedWorkcentersSubmit={() => {}} />);

    mockWorkcenters.forEach(workcenter =>
      expect(queryByTestId(dataTestIds.selectWorkcenter(workcenter.name))).toBeInTheDocument()
    );
  });

  it('shows submit button with custom label', () => {
    const { queryByTestId } = render(
      <SelectWorkcentersStep onSelectedWorkcentersSubmit={() => {}} submitLabel="Next" />
    );

    expect(queryByTestId(dataTestIds.submit)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.submit).textContent).toContain('Next');
  });

  it('does not show "select all" if there is only one available workcenter', () => {
    mockUseGetWorkcenters.mockReturnValue({
      isLoading: false,
      workcenters: [mockWorkcenters[0]], // only one item
    });
    mockUseWorkcentersFeatureFlag.mockReturnValue([mockWorkcenters[0]]); // only one item

    const { queryByTestId } = render(<SelectWorkcentersStep onSelectedWorkcentersSubmit={() => {}} />);

    expect(queryByTestId(dataTestIds.selectAll)).not.toBeInTheDocument();
  });

  it('selects all workcenters and clears what all is selected again', () => {
    const mockSelectedWorkcentersSubmit = jest.fn();
    const { queryByTestId } = render(
      <SelectWorkcentersStep onSelectedWorkcentersSubmit={mockSelectedWorkcentersSubmit} />
    );

    const selectAll = queryByTestId(dataTestIds.selectAll);
    const submit = queryByTestId(dataTestIds.submit);

    // nothing selected initially
    expect(submit).toBeDisabled(); // if there are none selected, cannot submit

    selectAll.click(); // now everything should be selected
    submit.click();

    expect(submit).not.toBeDisabled(); // if there is some selected, can submit
    expect(mockSelectedWorkcentersSubmit).toHaveBeenCalledWith(mockWorkcenters);

    selectAll.click(); // now nothing should be selected

    expect(submit).toBeDisabled(); // if there are none selected, cannot submit
  });

  it('selects and unselects individual workcenters', () => {
    const mockSelectedWorkcentersSubmit = jest.fn();
    const { queryByTestId } = render(
      <SelectWorkcentersStep onSelectedWorkcentersSubmit={mockSelectedWorkcentersSubmit} />
    );

    const submit = queryByTestId(dataTestIds.submit);
    submit.click();

    // nothing selected initially
    expect(submit).toBeDisabled(); // if there are none selected, cannot submit

    const selectHarvest = queryByTestId(dataTestIds.selectWorkcenter('Harvest'));
    selectHarvest.click(); // only Harvest selected
    submit.click();

    expect(mockSelectedWorkcentersSubmit).toHaveBeenLastCalledWith(
      mockWorkcenters.filter(workcenter => workcenter.name === 'Harvest')
    );

    const selectSeed = queryByTestId(dataTestIds.selectWorkcenter('Seed'));
    selectSeed.click(); // both Harvest and Seed are selected
    submit.click();

    expect(mockSelectedWorkcentersSubmit).toHaveBeenLastCalledWith(
      mockWorkcenters.filter(workcenter => workcenter.name === 'Harvest' || workcenter.name === 'Seed')
    );

    selectHarvest.click();
    selectSeed.click(); // nothing selected since both Harvest and Seed where unchecked

    expect(submit).toBeDisabled(); // if there are none selected, cannot submit
  });
});
