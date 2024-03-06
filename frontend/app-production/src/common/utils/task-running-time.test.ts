import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';

import { mockLeafTasks } from '../test-helpers';

import { taskRunningTime } from '.';

describe('taskRunningTime', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-04-01T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('shows task running time in hh:mm:ss when duration is less than 1 day', () => {
    const task = cloneDeep(mockLeafTasks[0]);
    task.createdAt = DateTime.now().minus({ hours: 5, minutes: 10, seconds: 5 }).toSeconds();
    expect(taskRunningTime(task)).toBe('05:10:05');
  });

  it('shows number of days running when duration is more than 1 day', () => {
    const task = cloneDeep(mockLeafTasks[0]);
    task.createdAt = DateTime.now().minus({ days: 2, hours: 0, minutes: 10, seconds: 5 }).toSeconds();
    expect(taskRunningTime(task)).toBe('2+ days');
  });
});
