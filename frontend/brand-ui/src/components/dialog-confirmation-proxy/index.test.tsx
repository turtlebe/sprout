import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDialogConfirmationProxy as dataTestIds, DialogConfirmationProxy } from '.';

describe('DialogConfirmation', () => {
  it('shows the dialog and exposes an api to control it', () => {
    let dialogConfirmationReadyEvent;
    const { queryByTestId } = render(
      <DialogConfirmationProxy
        open={true}
        title="Title"
        onDialogConfirmationReady={e => (dialogConfirmationReadyEvent = e)}
      >
        <span data-testid="content">Content</span>
      </DialogConfirmationProxy>
    );

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('Title');
    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('Content');
    expect(queryByTestId('content')).toBeInTheDocument();
    expect(dialogConfirmationReadyEvent.api).toBeDefined();
    expect(dialogConfirmationReadyEvent.api.isOpen).toBe(true);
    expect(dialogConfirmationReadyEvent.api.openDialog).toBeDefined();
  });

  it('hides the dialog', () => {
    const { queryByTestId } = render(
      <DialogConfirmationProxy open={false} title="Title" onDialogConfirmationReady={() => {}}>
        <span data-testid="content">Content</span>
      </DialogConfirmationProxy>
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });
});
