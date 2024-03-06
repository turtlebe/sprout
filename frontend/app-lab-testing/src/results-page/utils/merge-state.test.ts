import { mergeState } from './merge-state';

describe('mergeState()', () => {
  it('does not change curr state when savedState is emtpy', () => {
    const savedState = [];
    const currState = [{ colId: '1' }, { colId: '2' }];
    const result = mergeState(currState, savedState);
    expect(result).toEqual(currState);
  });

  it('orders curr state by savedState', () => {
    const savedState = [{ colId: '2' }, { colId: '1' }];
    const currState = [{ colId: '1' }, { colId: '2' }];
    const result = mergeState(currState, savedState);
    expect(result).toEqual(savedState);
  });

  it('ignores items in savedState that do not exist in currState', () => {
    const savedState = [{ colId: '2' }, { colId: '3' }, { colId: '1' }, { colId: '100' }];
    const currState = [{ colId: '1' }, { colId: '2' }];
    const result = mergeState(currState, savedState);
    expect(result).toEqual([{ colId: '2' }, { colId: '1' }]);
  });

  it('orders currState based on mutual items between currState and savedState', () => {
    const savedState = [{ colId: '6' }, { colId: '2' }, { colId: '1' }];
    const currState = [{ colId: '1' }, { colId: '5' }, { colId: '3' }, { colId: '2' }, { colId: '4' }, { colId: '6' }];
    const result = mergeState(currState, savedState);
    expect(result).toEqual([
      { colId: '6' },
      { colId: '5' },
      { colId: '3' },
      { colId: '2' },
      { colId: '4' },
      { colId: '1' },
    ]);
  });

  it('copies other fields (pinned and width) from savedState to currState', () => {
    const savedState = [
      { colId: '2', width: 1, pinned: 'left' },
      { colId: '1', width: 100 },
    ];
    const currState = [{ colId: '5' }, { colId: '1' }, { colId: '3' }, { colId: '2' }, { colId: '4' }];
    const result = mergeState(currState, savedState);
    expect(result).toEqual([
      { colId: '5' },
      { colId: '2', width: 1, pinned: 'left' },
      { colId: '3' },
      { colId: '1', width: 100 },
      { colId: '4' },
    ]);
  });
});
