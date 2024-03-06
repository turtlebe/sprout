/* eslint-disable @typescript-eslint/no-floating-promises */
import { DEFAULT_ERROR_MESSSAGE } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { AUTO_HIDE_DURATION_MS, dataTestIdsSnackbar as dataTestIds, Snackbar, useSnackbar } from './';

describe('Snackbar', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('is not visible by default', () => {
    const { queryByTestId } = render(<Snackbar />);

    expect(queryByTestId(dataTestIds.alert)).not.toBeInTheDocument();
  });

  it('is visible, displays a message and closes automatically', () => {
    jest.useFakeTimers();

    const mockCloseSnackbar = jest.fn();

    const { getByTestId } = render(<Snackbar open={true} message="congrats" closeSnackbar={mockCloseSnackbar} />);

    expect(getByTestId(dataTestIds.alert)).toBeInTheDocument();
    expect(getByTestId(dataTestIds.alert)).toHaveTextContent('congrats');

    expect(mockCloseSnackbar).not.toHaveBeenCalled();

    // shouldn't call before advancing past timer duration.
    jest.advanceTimersByTime(AUTO_HIDE_DURATION_MS - 1);
    expect(mockCloseSnackbar).not.toHaveBeenCalled();

    // now at duration, should have closed
    jest.advanceTimersByTime(1);
    expect(mockCloseSnackbar).toHaveBeenCalled();
  });

  it('does not close automatically when severity is error', () => {
    jest.useFakeTimers();

    const mockCloseSnackbar = jest.fn();

    const { getByTestId } = render(
      <Snackbar severity="error" open={true} message="congrats" closeSnackbar={mockCloseSnackbar} />
    );

    expect(getByTestId(dataTestIds.alert)).toBeInTheDocument();

    expect(mockCloseSnackbar).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(mockCloseSnackbar).not.toHaveBeenCalled();
  });

  it('closes the snackbar', () => {
    const closeSnackbar = jest.fn();
    const { getByLabelText } = render(<Snackbar open={true} closeSnackbar={closeSnackbar} />);

    getByLabelText('Close').click();
    expect(closeSnackbar).toHaveBeenCalledTimes(1);
  });
});

describe('useSnackbar', () => {
  it('initializes the severity, message, open and disableAutoHide', () => {
    const { result } = renderHook(() => useSnackbar());

    expect(result.current.severity).toBe('success');
    expect(result.current.open).toBe(false);
    expect(result.current.message).toBe('');
    expect(result.current.disableAutoHide).toBe(false);
  });

  it('updates the serverity, message and open', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.updateSnackbar({
        message: 'error',
        severity: 'error',
        open: true,
        disableAutoHide: true,
      });
    });

    expect(result.current.message).toBe('error');
    expect(result.current.severity).toBe('error');
    expect(result.current.open).toBe(true);
    expect(result.current.disableAutoHide).toBe(true);
  });

  it('provides a helper for success messages', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.successSnackbar('congrats!');
    });

    expect(result.current.message).toBe('congrats!');
    expect(result.current.severity).toBe('success');
    expect(result.current.open).toBe(true);
    expect(result.current.disableAutoHide).toBe(false);
  });

  it('provides a helper for success messages with disabled auto hide', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.successSnackbar('congrats!', { disableAutoHide: true });
    });

    expect(result.current.message).toBe('congrats!');
    expect(result.current.severity).toBe('success');
    expect(result.current.open).toBe(true);
    expect(result.current.disableAutoHide).toBe(true);
  });

  it('provides a helper for error messages', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.errorSnackbar({ message: 'failed' });
    });

    expect(result.current.message).toBe('failed');
    expect(result.current.severity).toBe('error');
    expect(result.current.open).toBe(true);
  });

  it('provides a default error message when none is provided', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.errorSnackbar();
    });

    expect(result.current.message).toBe(DEFAULT_ERROR_MESSSAGE);
    expect(result.current.open).toBe(true);
  });

  it('provides title and message in snackbar error', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.errorSnackbar({ message: 'some message', title: 'my title' });
    });

    expect(result.current.message).toBe(`my title:

some message`);
    expect(result.current.severity).toBe('error');
    expect(result.current.open).toBe(true);
  });

  it('supports JSX content', () => {
    const { result } = renderHook(() => useSnackbar());
    const element = <div data-testid="test">Some content</div>;

    act(() => {
      result.current.errorSnackbar({ message: element });
    });

    expect(result.current.message).toEqual(element);
    expect(result.current.severity).toBe('error');
    expect(result.current.open).toBe(true);
    expect((result.current.message as JSX.Element).props['data-testid']).toEqual('test');
  });

  it('provides a helper for warning messages', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.warningSnackbar('failed');
    });

    expect(result.current.message).toBe('failed');
    expect(result.current.severity).toBe('warning');
    expect(result.current.open).toBe(true);
  });

  it('closes the Snackbar', () => {
    const { result } = renderHook(() => useSnackbar({ open: true }));

    expect(result.current.open).toBe(true);

    act(() => result.current.closeSnackbar());

    expect(result.current.open).toBe(false);
    expect(result.current.disableAutoHide).toBe(false);
  });

  it('Turns off disableAutoHide once success message with disableAutoHide enabled has been closed', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.successSnackbar('congrats!', { disableAutoHide: true });
    });

    expect(result.current.open).toBe(true);
    expect(result.current.disableAutoHide).toBe(true);

    act(() => result.current.closeSnackbar());

    expect(result.current.open).toBe(false);
    expect(result.current.disableAutoHide).toBe(false);
  });
});
