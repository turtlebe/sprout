import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';

import { Card, dataTestIdsCard as dataTestIds } from '.';

describe('Card', () => {
  it('renders with a loader', () => {
    const { queryByTestId } = render(<Card title="title" isLoading={true} />);

    expect(queryByTestId(dataTestIds.cardHeader)).toHaveTextContent('title');
    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });

  it('renders with a default empty state', () => {
    const { queryByTestId } = render(<Card title="title" isLoading={false} />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cardContent)).toHaveTextContent('title is not present');
  });

  it('renders with a custom empty state', () => {
    const { queryByTestId } = render(<Card title="title" fallback="--" isLoading={false} />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cardContent)).toHaveTextContent('--');
  });

  it('renders the children', () => {
    const { queryByTestId } = render(
      <Card title="title" isLoading={false}>
        example
      </Card>
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cardContent)).toHaveTextContent('example');
  });

  it('renders the title with react element', () => {
    const typograpyTitleDataTestId = 'typography-title-test-id';
    const { queryByTestId } = render(
      <Card title={<Typography data-testid={typograpyTitleDataTestId}>my title</Typography>} isLoading={false}>
        content
      </Card>
    );

    expect(queryByTestId(typograpyTitleDataTestId)).toBeInTheDocument();
    expect(queryByTestId(typograpyTitleDataTestId)).toHaveTextContent('my title');
  });

  it('renders with a custom data-testid tag', () => {
    const { queryByTestId } = render(<Card title="title" isLoading={false} data-testid="customDataTestId" />);

    expect(queryByTestId('customDataTestId')).toBeInTheDocument();
  });

  it('renders with a custom data-testid tag for the loader', () => {
    const { queryByTestId } = render(<Card title="title" isLoading={true} data-testid-loader="customDataTestId" />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId('customDataTestId')).toBeInTheDocument();
  });

  it('renders with an action', () => {
    const { queryByTestId } = render(
      <Card
        title="title"
        isLoading={false}
        data-testid="customDataTestId"
        action={<button data-testid="custom-action" />}
      />
    );

    expect(queryByTestId('custom-action')).toBeInTheDocument();
  });
});
