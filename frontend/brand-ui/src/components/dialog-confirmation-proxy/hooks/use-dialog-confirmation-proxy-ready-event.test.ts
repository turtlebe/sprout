import { act, renderHook } from '@testing-library/react-hooks';

import { useDialogConfirmationProxyReadyEvent } from './use-dialog-confirmation-proxy-ready-event';

describe('useDialogConfirmation', () => {
  it('exposes an api to open/close the Dialog', () => {
    const { result } = renderHook(() => useDialogConfirmationProxyReadyEvent({ open: false }));

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(false);

    void act(() => result.current.dialogConfirmationReadyEvent.api.openDialog());

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(true);

    void act(() => result.current.handleCancel());

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(false);
  });

  it('exposes a callback to listen when the dialog confirms', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const { result } = renderHook(() => useDialogConfirmationProxyReadyEvent({ open: false }));

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(false);

    void act(() => result.current.dialogConfirmationReadyEvent.api.openDialog({ onConfirm, onCancel }));

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(true);

    void act(() => result.current.handleConfirm());

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(false);
    expect(onConfirm).toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('exposes a callback to listen when the dialog cancels', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const { result } = renderHook(() => useDialogConfirmationProxyReadyEvent({ open: false }));

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(false);

    void act(() => result.current.dialogConfirmationReadyEvent.api.openDialog({ onConfirm, onCancel }));

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(true);

    void act(() => result.current.handleCancel());

    expect(result.current.dialogConfirmationReadyEvent.api.isOpen).toBe(false);
    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
