import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDownloadFile as dataTestIds, DownloadFile, EMPTY_STATE } from '.';

describe('DownloadFile', () => {
  it('renders an empty state', () => {
    const { queryByTestId } = render(<DownloadFile />);

    expect(queryByTestId(dataTestIds.download)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.emptyState)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.emptyState)).toHaveTextContent(EMPTY_STATE);
  });

  it('renders a Download CTA', () => {
    const { queryByTestId } = render(<DownloadFile href="/mock-url" />);

    expect(queryByTestId(dataTestIds.download)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.emptyState)).not.toBeInTheDocument();
  });

  it('renders with a custom data-testid tag', () => {
    const { queryByTestId } = render(<DownloadFile href="/mock-url" data-testid="custom-data-testid" />);

    expect(queryByTestId(dataTestIds.download)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.emptyState)).not.toBeInTheDocument();
    expect(queryByTestId('custom-data-testid')).toBeInTheDocument();
  });

  it('renders with a custom data-testid tag (empty state)', () => {
    const { queryByTestId } = render(<DownloadFile data-testid="custom-data-testid" />);

    expect(queryByTestId(dataTestIds.download)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.emptyState)).not.toBeInTheDocument();
    expect(queryByTestId('custom-data-testid')).toBeInTheDocument();
    expect(queryByTestId('custom-data-testid')).toHaveTextContent(EMPTY_STATE);
  });
});
