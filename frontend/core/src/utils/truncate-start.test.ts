import { truncateStart } from './truncate-start';

describe('truncateStart', () => {
  it('truncates the work at its start', () => {
    expect(truncateStart('lorem ipsum', { length: 5 })).toEqual('...ipsum');
    expect(truncateStart('lorem ipsum', { length: 2 })).toEqual('...um');
  });

  it('does not truncate', () => {
    expect(truncateStart(null)).toEqual(null);
    expect(truncateStart(undefined)).toEqual(undefined);
    expect(truncateStart('lorem ipsum')).toEqual('lorem ipsum');
  });
});
