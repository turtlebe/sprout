import { mockTasks } from '../../../test-helpers';

import { getTitle } from '.';

const states = { pending: 'pending', running: 'running', completed: 'completed' };

describe('getTitle', () => {
  it('returns past tense for completed task', () => {
    expect(getTitle(mockTasks[0], states)).toBe('completed');
  });

  it('returns present tense for running task', () => {
    expect(getTitle(mockTasks[3], states)).toBe('running');
  });

  it('returns future tense for pending task', () => {
    expect(getTitle(mockTasks[6], states)).toBe('pending');
  });
});
