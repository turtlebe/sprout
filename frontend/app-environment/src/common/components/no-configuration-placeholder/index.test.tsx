import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsNoConfigurationPlaceholder as dataTestIds, NoConfigurationPlaceholder } from '.';

describe('NoConfigurationPlaceholder', () => {
  it('renders with a custom title and a click handler', () => {
    const onClick = jest.fn();
    const { queryByTestId } = render(<NoConfigurationPlaceholder title="Welcome!" onClick={onClick} />);

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('Welcome!');
    expect(onClick).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.cta).click();

    expect(onClick).toHaveBeenCalled();
  });
});
