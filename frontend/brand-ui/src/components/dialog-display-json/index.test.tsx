import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDialogDisplayJson as dataTestIds, DialogDisplayJson } from '.';

const onClose = jest.fn();
const jsonObject = { foo: 'bar' };
const title = 'Custom Title';

describe('DialogDisplayJson', () => {
  beforeEach(() => {
    onClose.mockRestore();
  });

  it('renders nothing', () => {
    const { queryByTestId } = render(
      <DialogDisplayJson open={false} title={title} jsonObject={jsonObject} onClose={onClose} />
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders a JSON object', () => {
    const { queryByTestId } = render(
      <DialogDisplayJson open={true} title={title} jsonObject={jsonObject} onClose={onClose} />
    );

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('{ "foo": "bar" }');
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(title);
  });

  it('renders with an empty state', () => {
    const { queryByTestId } = render(
      <DialogDisplayJson open={true} title={title} jsonObject={undefined} onClose={onClose} />
    );

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('--');
  });

  it('renders with a custom data-testid', () => {
    const { queryByTestId } = render(
      <DialogDisplayJson
        open={true}
        title={title}
        jsonObject={jsonObject}
        onClose={onClose}
        data-testid="custom-datatestid"
      />
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
    expect(queryByTestId('custom-datatestid')).toBeInTheDocument();
  });

  it('calls the onClose callback', () => {
    const { queryByTestId } = render(
      <DialogDisplayJson open={true} title={title} jsonObject={jsonObject} onClose={onClose} />
    );

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    queryByTestId(dataTestIds.close).click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
