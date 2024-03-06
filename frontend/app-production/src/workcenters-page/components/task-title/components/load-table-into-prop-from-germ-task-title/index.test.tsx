import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mockPropLoadWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsLoadTableIntoPropFromGermTaskTitle as dataTestIds, LoadTableIntoPropFromGermTaskTitle } from '.';

const mockLoadTableIntoPropFromGermTaskTitle = mockPropLoadWorkcenterPlan.detailsOfTasksFromPlan[0];

describe('LoadTableIntoPropFromGermTaskTitle', () => {
  function renderLoadTableIntoPropFromGermTaskTitle() {
    return render(<LoadTableIntoPropFromGermTaskTitle task={mockLoadTableIntoPropFromGermTaskTitle} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('shows load title in correct tense', () => {
    const { queryByTestId } = renderLoadTableIntoPropFromGermTaskTitle();

    // past tense since task is complete
    expect(queryByTestId(dataTestIds.loadTitle)).toHaveTextContent('Loaded');
  });

  it('shows table serial link', () => {
    const { queryByTestId } = renderLoadTableIntoPropFromGermTaskTitle();

    expect(queryByTestId(dataTestIds.tableLink)).toHaveAttribute(
      'href',
      expect.stringContaining('P900-0008046A:YW97-3K02-0U')
    );
  });

  it('shows germ stack', () => {
    const { queryByTestId } = renderLoadTableIntoPropFromGermTaskTitle();

    expect(queryByTestId(dataTestIds.germStack)).toHaveTextContent('GermStack7');
  });

  it('shows propagation rack and level', () => {
    const { queryByTestId } = renderLoadTableIntoPropFromGermTaskTitle();

    expect(queryByTestId(dataTestIds.propPath)).toHaveTextContent('PropagationRack1, PropLevel1');
  });
});
