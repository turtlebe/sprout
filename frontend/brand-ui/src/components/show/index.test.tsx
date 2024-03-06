import { render } from '@testing-library/react';
import React from 'react';

import { Show } from '.';

const childDataTestId = 'children-data-test-id';

describe('Show', () => {
  function renderShow(when: boolean, fallback?: JSX.Element) {
    return render(
      <Show when={when} fallback={fallback}>
        <div data-testid={childDataTestId}>test</div>
      </Show>
    );
  }

  it('renders children when condition is true', () => {
    const { queryByTestId } = renderShow(true);
    expect(queryByTestId(childDataTestId)).toBeInTheDocument();
  });

  it('renders nothing when condition is false and there is no fallback', () => {
    const { queryByTestId } = renderShow(false);
    expect(queryByTestId(childDataTestId)).not.toBeInTheDocument();
  });

  it('renders fallback when condition is false', () => {
    const fallbackDataTestId = 'fallback-data-test-id';
    const fallback = <div data-testid={fallbackDataTestId}>fallback</div>;
    const { queryByTestId } = renderShow(false, fallback);

    expect(queryByTestId(childDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(fallbackDataTestId)).toBeInTheDocument();
  });
});
