import { mockTasks } from '../test-helpers';

import { isTaskCompleted } from '.';

describe('isTaskCompleted', () => {
  it('tests for completed tasks', () => {
    const results = mockTasks.map(task => isTaskCompleted(task));

    expect(results).toHaveLength(7);

    // first three tasks should be completed, rest should not.
    expect(results).toEqual([true, true, true, false, false, false, false]);
  });
});
