import { mockTasks } from '../test-helpers';

import { isTaskRunning } from '.';

describe('isTaskRunning', () => {
  it('tests for running tasks', () => {
    const results = mockTasks.map(task => isTaskRunning(task));

    expect(results).toHaveLength(7);

    expect(results).toEqual([false, false, false, true, true, true, false]);
  });
});
