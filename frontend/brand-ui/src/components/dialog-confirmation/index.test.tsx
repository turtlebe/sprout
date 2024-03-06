import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDialogConfirmation as dataTestIds, DialogConfirmation, getDialogConfirmationDataTestIds } from '.';

describe('DialogConfirmation', () => {
  it('renders the dialog opened', () => {
    const { queryByTestId } = render(<DialogConfirmation open={true} onCancel={() => {}} title="Confirmation" />);

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.content)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.actions)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cancel)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('Confirmation');
    expect(queryByTestId(dataTestIds.actions)).toHaveTextContent('I understand');
    expect(queryByTestId(dataTestIds.actions)).toHaveTextContent('Cancel');
  });

  it('renders the dialog opened with children', () => {
    const { queryByTestId } = render(
      <DialogConfirmation open={true} title="Confirmation" onCancel={() => {}}>
        Hey There
      </DialogConfirmation>
    );

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.content)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.actions)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('Confirmation');
    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('Hey There');
    expect(queryByTestId(dataTestIds.actions)).toHaveTextContent('I understand');
    expect(queryByTestId(dataTestIds.actions)).toHaveTextContent('Cancel');
  });

  it('renders the dialog closed', () => {
    const { queryByTestId } = render(<DialogConfirmation open={false} title="Confirmation" />);

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.content)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.actions)).not.toBeInTheDocument();
  });

  it('executes onConfirm/onCancel callbacks upon confirmation/cancellation', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    const { queryByTestId } = render(
      <DialogConfirmation open={true} title="Confirmation" onConfirm={handleConfirm} onCancel={handleCancel} />
    );

    queryByTestId(dataTestIds.confirm).click();
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.cancel).click();
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('does not show cancel button if callback not provided', () => {
    const { queryByTestId } = render(<DialogConfirmation open={true} title="Confirmation" />);
    expect(queryByTestId(dataTestIds.cancel)).not.toBeInTheDocument();
  });

  it('renders with custom selectors with a prefix', () => {
    const customDataTestIds = getDialogConfirmationDataTestIds('prefix');

    const { queryByTestId } = render(
      <DialogConfirmation
        open={true}
        title="Confirmation"
        children={<>test</>}
        onCancel={jest.fn()}
        data-testid={customDataTestIds.root}
      />
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.content)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.actions)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.confirm)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cancel)).not.toBeInTheDocument();

    expect(queryByTestId(customDataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(customDataTestIds.title)).toBeInTheDocument();
    expect(queryByTestId(customDataTestIds.content)).toBeInTheDocument();
    expect(queryByTestId(customDataTestIds.actions)).toBeInTheDocument();
    expect(queryByTestId(customDataTestIds.confirm)).toBeInTheDocument();
    expect(queryByTestId(customDataTestIds.cancel)).toBeInTheDocument();
  });

  it('disables the confirm button and shows circular progess when "isConfirmInProgress" is true', () => {
    const { queryByTestId } = render(
      <DialogConfirmation open={true} title="Confirmation" isConfirmInProgress={true} onCancel={() => {}} />
    );

    expect(queryByTestId(dataTestIds.confirm)).toBeDisabled();
    expect(queryByTestId(dataTestIds.confirmProgress)).toBeInTheDocument();
  });
});

describe('getDialogConfirmationDataTestIds', () => {
  it('returns the default dataTestIds', () => {
    expect(getDialogConfirmationDataTestIds('')).toEqual(dataTestIds);
    expect(getDialogConfirmationDataTestIds(undefined)).toEqual(dataTestIds);
  });

  it('returns custom dataTestIds', () => {
    expect(getDialogConfirmationDataTestIds('prefix')).toEqual({
      root: 'prefix',
      title: 'prefix-dialogConfirmation-title',
      content: 'prefix-dialogConfirmation-content',
      actions: 'prefix-dialogConfirmation-actions',
      confirm: 'prefix-dialogConfirmation-confirm',
      cancel: 'prefix-dialogConfirmation-cancel',
      confirmProgress: 'prefix-dialogConfirmation-confirm-progress',
    });
  });
});
