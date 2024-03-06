import { DEFAULT_ALL_RECORD } from '../constants';

export const mockMarks = [
  {
    value: 0,
    label: 'Today',
  },
  {
    value: 1,
    label: '2',
  },
];

export const mockMarksRecord = {
  ...DEFAULT_ALL_RECORD,
  0: {
    value: 0,
    label: 'Today',
    ageCohortDate: '2021-02-14T00:00:00.000Z',
  },
  1: {
    value: 1,
    label: '2',
    ageCohortDate: '2021-04-16T00:00:00.000Z',
  },
};
