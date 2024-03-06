import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';

import { AutocompleteOptionWithCount } from '.';

describe('AutocompleteOptionWithCount', () => {
  it('renders a label and a count', () => {
    const { container } = render(<AutocompleteOptionWithCount label="Example" count={1987987} />);

    expect(container).toHaveTextContent('Example');
    expect(container).toHaveTextContent('2.0m');
  });

  it('renders lastObservedAt', () => {
    const { container } = render(
      <AutocompleteOptionWithCount
        label="Example"
        count={10}
        lastObservedAt={DateTime.now().minus({ month: 1 }).toISO()}
      />
    );

    expect(container).toHaveTextContent('1 month ago');
  });
});
