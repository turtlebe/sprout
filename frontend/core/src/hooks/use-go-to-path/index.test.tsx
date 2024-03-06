import { act, renderHook } from '@testing-library/react-hooks';
import { useHistory } from 'react-router-dom';

import { useGoToPath } from '.';

jest.mock('react-router');

let blockCallback;

function mockUseHistory() {
  const MockUseHistory = () => {
    return {
      block: (func: () => string) => {
        blockCallback = jest.fn(func);
        return function () {}; // unregister func - noop.
      },
      push: () => {
        blockCallback();
      },
    };
  };

  (useHistory as jest.Mock).mockImplementation(MockUseHistory);
}

describe('useGoToPath', () => {
  it('allows the goToPath function', () => {
    mockUseHistory();

    const { result } = renderHook(() => useGoToPath({ warningMessage: 'blocked msg' }));

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.setIsGoToAllowed(true);
      result.current.goToPath('/some/path');
      expect(blockCallback).toHaveReturnedWith(undefined);
    });
  });

  it('allows the goToPath function when isAllowed is `true`', () => {
    mockUseHistory();

    const { result } = renderHook(() => useGoToPath({ isAllowed: true, warningMessage: 'blocked msg' }));

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.goToPath('/some/path');
      expect(blockCallback).toHaveReturnedWith(undefined);
    });
  });

  it('blocks the goToPath function', () => {
    mockUseHistory();

    const { result } = renderHook(() => useGoToPath({ warningMessage: 'blocked msg' }));

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.goToPath('/some/path');
      expect(blockCallback).toHaveReturnedWith('blocked msg');
    });
  });

  it('blocks the goToPath function when isAllowed is false', () => {
    mockUseHistory();

    const { result } = renderHook(() => useGoToPath({ isAllowed: false, warningMessage: 'blocked msg' }));

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.goToPath('/some/path');
      expect(blockCallback).toHaveReturnedWith('blocked msg');
    });
  });

  it('does not block the goToPath when disabled is true', () => {
    mockUseHistory();

    const { result } = renderHook(() => useGoToPath({ isAllowed: false, disabled: true }));

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.goToPath('/some/path');
      expect(blockCallback).toHaveReturnedWith(undefined);
    });
  });
});
