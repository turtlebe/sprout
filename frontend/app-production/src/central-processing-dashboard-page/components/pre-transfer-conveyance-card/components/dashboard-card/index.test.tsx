import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';

import { DashboardCard, dataTestIdsDashboardCard as dataTestIds } from '.';

const title = 'hello world';

describe('DashboardCard', () => {
  it('renders the title', () => {
    const { queryByTestId } = render(<DashboardCard title={title} contentLength={0} />);

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(title);
  });

  it('renders error when contentLength is 0', () => {
    const { queryByTestId } = render(
      <DashboardCard title={title} contentLength={0}>
        <Typography data-testid="test-content">test content</Typography>
      </DashboardCard>
    );

    expect(queryByTestId(dataTestIds.emptyContent)).toHaveTextContent(`The ${title} is empty.`);
    expect(queryByTestId('test-content')).not.toBeInTheDocument();
  });

  it('renders error when contentLength is undefined', () => {
    const { queryByTestId } = render(
      <DashboardCard title={title} contentLength={undefined}>
        <Typography data-testid="test-content">test content</Typography>
      </DashboardCard>
    );

    expect(queryByTestId(dataTestIds.emptyContent)).toHaveTextContent(`The ${title} is empty.`);
    expect(queryByTestId('test-content')).not.toBeInTheDocument();
  });

  it('renders children when contentLength is greater than 0', () => {
    const { queryByTestId } = render(
      <DashboardCard title={title} contentLength={1}>
        <Typography data-testid="test-content">test content</Typography>
      </DashboardCard>
    );

    expect(queryByTestId('test-content')).toBeInTheDocument();
  });
});
