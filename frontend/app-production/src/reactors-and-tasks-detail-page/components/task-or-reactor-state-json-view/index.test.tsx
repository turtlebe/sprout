import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { mockReactorStateReturnValue } from '../../test-helpers';

import { dataTestIdsTaskOrReactorStateJsonView as dataTestIds, TaskOrReactorStateJsonView } from '.';

const mockReactorsAndTaskDetailBasePath = `${mockBasePath}/reactors-and-tasks/detail`;
const mockReactorPath = 'sites/LAX1/farms/LAX1/workCenters/Seed';

describe('TaskOrReactorStateJsonView', () => {
  function renderTaskOrReactorStateJsonView(props: Partial<TaskOrReactorStateJsonView>) {
    return render(<TaskOrReactorStateJsonView state={props.state} reactorPath={props.reactorPath} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('does not render anything if state not provided', () => {
    const { queryByTestId } = renderTaskOrReactorStateJsonView({});

    expect(queryByTestId(dataTestIds.jsonView)).not.toBeInTheDocument();
  });

  it('replaces reactor paths in field "subTasksExecutorsPaths" with html anchor tags', () => {
    const _mockReactorStateReturnValue = cloneDeep(mockReactorStateReturnValue);
    // for testing purposes delete other entry that gets turned into links so we just test subTasksExecutorsPaths here.
    delete _mockReactorStateReturnValue.state['activeTasks'];

    const state = _mockReactorStateReturnValue.state;

    const { queryByTestId } = renderTaskOrReactorStateJsonView({ state });

    expect(queryByTestId(dataTestIds.jsonView)).toBeInTheDocument();

    const reactorPaths = Object.values(state['subTasksExecutorsPaths']);

    // check that correct number of anchor tags exist.
    const aTags = queryByTestId(dataTestIds.jsonView).querySelectorAll('a');
    expect(aTags).toHaveLength(reactorPaths.length);

    // check that each a tag has correct href path.
    reactorPaths.forEach((reactorPath, index) => {
      const reactorLink = `${mockReactorsAndTaskDetailBasePath}/${reactorPath}`;
      expect(aTags[index]).toHaveAttribute('href', reactorLink);
    });
  });

  it('replaces the id (key in object "activeTasks") with html anchor tags', () => {
    const _mockReactorStateReturnValue = cloneDeep(mockReactorStateReturnValue);
    // for testing purposes delete other entry that gets turned into links so we just test activeTasks here.
    delete _mockReactorStateReturnValue.state['subTasksExecutorsPaths'];

    const state = _mockReactorStateReturnValue.state;

    const { queryByTestId } = renderTaskOrReactorStateJsonView({ state, reactorPath: mockReactorPath });

    expect(queryByTestId(dataTestIds.jsonView)).toBeInTheDocument();

    const activeTasks = Object.values(state['activeTasks']);
    const taskIds = Object.keys(state['activeTasks']);

    // check that correct number of anchor tags exist.
    const aTags = queryByTestId(dataTestIds.jsonView).querySelectorAll('a');
    expect(aTags).toHaveLength(activeTasks.length);

    // check that each a tag has correct href path.
    activeTasks.forEach((task, index) => {
      const link = `${mockReactorsAndTaskDetailBasePath}/${mockReactorPath}?taskId=${taskIds[index]}`;
      expect(aTags[index]).toHaveAttribute('href', link);
    });
  });
});
