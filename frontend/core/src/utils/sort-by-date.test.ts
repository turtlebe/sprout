import { sortByDate } from './sort-by-date';

const unsorted = [
  { id: 3, generatedAt: '2022-01-01T03:00:00Z' },
  { id: 1, generatedAt: '2022-01-01T01:00:00Z' },
  { id: 2, generatedAt: '2022-01-01T02:00:00Z' },
];

const sorted = [
  { id: 3, generatedAt: '2022-01-01T03:00:00Z' },
  { id: 2, generatedAt: '2022-01-01T02:00:00Z' },
  { id: 1, generatedAt: '2022-01-01T01:00:00Z' },
];

describe('sortByDate', () => {
  it('sorts in desc order', () => {
    expect(unsorted.sort(sortByDate({ attribute: 'generatedAt', order: 'desc' }))).toEqual(sorted);
  });

  it('sorts in asc order', () => {
    expect(unsorted.sort(sortByDate({ attribute: 'generatedAt', order: 'asc' }))).toEqual(sorted.reverse());
  });
});
