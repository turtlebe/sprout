import { dataTestIdsDialogConfirmation } from '@plentyag/brand-ui/src/components/dialog-confirmation';
import { render } from '@testing-library/react';
import React from 'react';

import { AgGridDialogRenderer, dataTestIdsAgGridDialogRenderer as dataTestIds } from '.';

describe('AgGridDialogRenderer', () => {
  function renderAgGridDialogRenderer(content: JSX.Element, showCommentIcon?: boolean) {
    return render(
      <AgGridDialogRenderer
        cellText="Hello World"
        title="Dialog Title"
        content={content}
        showCommentIcon={showCommentIcon}
      />
    );
  }

  it('does not render cell when content is not provided', () => {
    const { queryByTestId } = renderAgGridDialogRenderer(null);
    expect(queryByTestId(dataTestIds.cell)).toBeNull();
  });

  it('renders cell when content is provdided', () => {
    const { queryByTestId } = renderAgGridDialogRenderer(<span>hi</span>);
    expect(queryByTestId(dataTestIds.cell)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.commentIcon)).not.toBeInTheDocument();
  });

  it('opens the dialog when clicking the cell', () => {
    const { queryByTestId } = renderAgGridDialogRenderer(<span>hi</span>);

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeNull();

    const cell = queryByTestId(dataTestIds.cell);
    cell.click();

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();
  });

  it('shows comment icon', () => {
    const { queryByTestId } = renderAgGridDialogRenderer(<span>hi</span>, true);
    expect(queryByTestId(dataTestIds.commentIcon)).toBeInTheDocument();
  });
});
