import { mockLeafTasks } from '../test-helpers';

import { taskDuration } from './task-duration';

describe('taskDuration', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-11-10T17:08:43.712Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns the difference from time now', () => {
    // ACT
    const result = Math.ceil(taskDuration(mockLeafTasks[0]).as('days'));

    // ASSERT
    expect(result).toEqual(-19);
  });
});
