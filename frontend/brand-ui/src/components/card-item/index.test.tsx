import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';

import { CardItem, dataTestIdsCardItem as dataTestIds } from '.';

describe('CardItem', () => {
  it('renders nothing if no children are provided', () => {
    const { queryByTestId } = render(<CardItem name="empty" />);
    expect(queryByTestId(dataTestIds.accordion)).toBe(null);
    expect(queryByTestId(dataTestIds.item)).toBe(null);
  });

  it('renders multiple items if children is greater than one', () => {
    const { queryByTestId } = render(
      <CardItem name="more-than-one-item">
        <div key={1}>item1</div>
        <div key={2}>item2</div>
      </CardItem>
    );
    expect(queryByTestId(dataTestIds.accordion)).toHaveTextContent('item1item2');
    expect(queryByTestId(dataTestIds.item)).toBe(null);
  });

  it('renders single item if children is one', () => {
    const { queryByTestId } = render(
      <CardItem name="one-item">
        <div>Single Item</div>
      </CardItem>
    );
    expect(queryByTestId(dataTestIds.accordion)).toBe(null);
    expect(queryByTestId(dataTestIds.item)).toHaveTextContent('Single Item');
  });

  it('renders with a custom data-testid tag', () => {
    const { queryByTestId } = render(
      <CardItem name="one-item" data-testid="customDataTestId">
        <div>Single Item</div>
      </CardItem>
    );

    expect(queryByTestId('customDataTestId')).toHaveTextContent('Single Item');
    expect(queryByTestId(dataTestIds.accordion)).toBe(null);
    expect(queryByTestId(dataTestIds.item)).toBe(null);
  });

  it('renders with a custom data-testid tag (accordion)', () => {
    const { queryByTestId } = render(
      <CardItem name="more-than-one-item" data-testid="customDataTestId">
        <div key={1}>item1</div>
        <div key={2}>item2</div>
      </CardItem>
    );

    expect(queryByTestId('customDataTestId')).toHaveTextContent('item1item2');
    expect(queryByTestId(dataTestIds.accordion)).toBe(null);
    expect(queryByTestId(dataTestIds.item)).toBe(null);
  });

  it('renders tooltip icon', () => {
    const tooltip = <Typography>test</Typography>;

    const { queryByTestId } = render(
      <CardItem name="one-item" tooltip={tooltip}>
        <div>Single Item</div>
      </CardItem>
    );

    expect(queryByTestId(dataTestIds.tooltipIcon)).toBeInTheDocument();
  });
});
