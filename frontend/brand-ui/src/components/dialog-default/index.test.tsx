import { render } from '@testing-library/react';
import React from 'react';
import { titleCase } from 'voca';

import { dataTestIdsDialogDefault as dataTestIds, DialogDefault } from '.';

const title = 'Test Title';
const onClose = jest.fn();
const maxWidth = 'lg';
const defaultMaxWidth = 'sm';

describe('DialogDefault', () => {
  it('renders closed', () => {
    const { queryByTestId } = render(<DialogDefault title={title} open={false} onClose={onClose} />);

    expect(queryByTestId(dataTestIds.close)).not.toBeInTheDocument();
  });

  it('renders with a title', () => {
    const { queryByTestId } = render(
      <DialogDefault title={title} open={true} onClose={onClose}>
        <div>foobar</div>
      </DialogDefault>
    );
    //
    expect(queryByTestId(dataTestIds.close)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).toHaveTextContent(title);
    expect(queryByTestId(dataTestIds.dialog)).toHaveTextContent('foobar');
    // Child paper div must contain CSS class that reflects defaultmaxWidth value
    expect(queryByTestId(dataTestIds.dialog).querySelector('.MuiDialog-paper')).toHaveClass(
      `MuiDialog-paperWidth${titleCase(defaultMaxWidth)}`
    );
  });

  it('renders with maxWidth', () => {
    const { queryByTestId } = render(
      <DialogDefault title={title} open={true} onClose={onClose} maxWidth={maxWidth}>
        <div>foobar</div>
      </DialogDefault>
    );

    // Child paper div must contain CSS class that reflects maxWidth value
    expect(queryByTestId(dataTestIds.dialog).querySelector('.MuiDialog-paper')).toHaveClass(
      `MuiDialog-paperWidth${titleCase(maxWidth)}`
    );
  });

  it('calls `onClose`', () => {
    const { queryByTestId } = render(<DialogDefault title={title} open={true} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.close).click();

    expect(onClose).toHaveBeenCalled();
  });
});
