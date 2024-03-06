import { render } from '@testing-library/react';

import { dataTestIdsMachineDiagram, MachineDiagram } from '.';

describe('MachineDiagram', () => {
  it('renders', () => {
    // ACT
    const { queryByTestId } = render(<MachineDiagram title="Hello World">hi</MachineDiagram>);

    // ASSERT
    expect(queryByTestId(dataTestIdsMachineDiagram.container)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsMachineDiagram.displayName)).toHaveTextContent('Hello World');
  });

  it('renders with custom data-testid', () => {
    // ACT
    const { queryByTestId } = render(
      <MachineDiagram title="Hello World 2" data-testid="custom">
        hi
      </MachineDiagram>
    );

    // ASSERT
    const queryByCustom = queryByTestId('custom');
    expect(queryByCustom).toBeInTheDocument();
    expect(queryByCustom.querySelector(`[data-testid="${dataTestIdsMachineDiagram.displayName}"]`)).toHaveTextContent(
      'Hello World 2'
    );
  });
});
