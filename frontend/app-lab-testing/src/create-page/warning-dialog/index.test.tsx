import { render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { dataTestIds, useWarningDialog, WarningDialog } from '.';

describe('Warning Dialog tests', () => {
  it('passing open: true should open dialog', () => {
    const { queryByTestId } = render(<WarningDialog open={true} />);
    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();
  });

  it('passing open: false should hide dialog', () => {
    const { queryByTestId } = render(<WarningDialog open={false} />);
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();
  });

  it('when there are no warnings should return: ignore-warning', async () => {
    const { result } = renderHook(() => useWarningDialog());

    const dialogResult = await result.current.checkWarning(false);
    expect(dialogResult).toBe('ignore-warning');
  });

  it('clicking ignore should return: ignore-warning', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWarningDialog());

    await act(async () => {
      const pr = result.current.checkWarning(true);
      await waitForNextUpdate();
      // fake click ignore.
      result.current.warningDialogStatus.action && result.current.warningDialogStatus.action('ignore-warning');
      const dialogResult = await pr;
      expect(dialogResult).toBe('ignore-warning');
    });
  });
  it('clicking fix should return: fix-warning', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWarningDialog());

    await act(async () => {
      const pr = result.current.checkWarning(true);
      await waitForNextUpdate();
      // fake click fix.
      result.current.warningDialogStatus.action && result.current.warningDialogStatus.action('fix-warning');
      const dialogResult = await pr;
      expect(dialogResult).toBe('fix-warning');
    });
  });
});
