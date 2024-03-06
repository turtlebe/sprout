import { mockTasks } from '../test-helpers';

import { isTaskPending } from '.';

describe('isTaskPending', () => {
  it('tests for pending tasks', () => {
    const results = mockTasks.map(task => isTaskPending(task));

    expect(results).toHaveLength(7);

    // only last task should be pending.
    expect(results).toEqual([false, false, false, false, false, false, true]);
  });
});
