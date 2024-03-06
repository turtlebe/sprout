import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mockPropUnloadWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import {
  dataTestIdsUnloadTableFromPropAndSendToTransplanterTaskTitle as dataTestIds,
  UnloadTableFromPropAndSendToTransplanterTaskTitle,
} from '.';

const mockUnloadTableFromPropAndSendToTransplanterTask = mockPropUnloadWorkcenterPlan.detailsOfTasksFromPlan[3];

describe('UnloadTableFromPropAndSendToTransplanterTaskTitle', () => {
  function renderUnloadTableFromPropAndSendToTransplanterTaskTitle() {
    return render(
      <UnloadTableFromPropAndSendToTransplanterTaskTitle task={mockUnloadTableFromPropAndSendToTransplanterTask} />,
      {
        wrapper: AppProductionTestWrapper,
      }
    );
  }

  it('titles are in the correct tense', () => {
    const { queryByTestId } = renderUnloadTableFromPropAndSendToTransplanterTaskTitle();

    // should all have future tense since task is in pending state
    expect(queryByTestId(dataTestIds.unloadTitle)).toHaveTextContent('Unload');
    expect(queryByTestId(dataTestIds.sendTitle)).toHaveTextContent('send');
    expect(queryByTestId(dataTestIds.pushTitle)).toHaveTextContent('push');
  });

  it('shows table hyperlink', () => {
    const { queryByTestId } = renderUnloadTableFromPropAndSendToTransplanterTaskTitle();

    expect(queryByTestId(dataTestIds.tableLink)).toHaveAttribute(
      'href',
      expect.stringContaining('P900-0008046A:JSN9-YI3A-7P')
    );
  });

  it('shows propagation rack and level from which table is unloaded', () => {
    const { queryByTestId } = renderUnloadTableFromPropAndSendToTransplanterTaskTitle();

    expect(queryByTestId(dataTestIds.propPath)).toHaveTextContent('PropagationRack1, PropLevel1');
  });

  it('shows level of table being rotated', () => {
    const { queryByTestId } = renderUnloadTableFromPropAndSendToTransplanterTaskTitle();

    expect(queryByTestId(dataTestIds.rotateFromLevel)).toHaveTextContent('PropLevel3');
  });
});
