import { mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { Action } from '@plentyag/core/src/types/environment';

import { copySchedule } from './copy-schedule';

const [schedule] = mockSchedules;

const sortedActions: Action[] = [
  { time: 0, value: '10', valueType: 'SINGLE_VALUE' },
  { time: 1, value: '20', valueType: 'SINGLE_VALUE' },
];
const unsortedActions: Action[] = [
  { time: 1, value: '20', valueType: 'SINGLE_VALUE' },
  { time: 0, value: '10', valueType: 'SINGLE_VALUE' },
];
const unsortedSchedule = { ...schedule, actions: unsortedActions };
const sortedSchedule = { ...schedule, actions: sortedActions };

describe('copySchedule', () => {
  it('copies the Schedule', () => {
    const scheduleCopy = copySchedule({ schedule, newActions: sortedActions });

    expect(scheduleCopy).toEqual(sortedSchedule);
  });

  it('sorts the actions', () => {
    const scheduleCopy = copySchedule({ schedule, newActions: unsortedActions });

    expect(scheduleCopy).toEqual(sortedSchedule);
  });

  it('does not sort the actions', () => {
    const scheduleCopy = copySchedule({ schedule, newActions: unsortedActions, sortAcions: false });

    expect(scheduleCopy).toEqual(unsortedSchedule);
  });

  it('creates a copy of the Schedule and sort its Actions', () => {
    const scheduleCopy = copySchedule({ schedule: unsortedSchedule });

    expect(scheduleCopy).toEqual(sortedSchedule);
  });
});
