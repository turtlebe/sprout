import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsEmptyPlaceholder as dataTestIds, EmptyPlaceholder } from '.';

const onAddAction = jest.fn();

describe('EmptyPlaceholder', () => {
  it('calls `onAddAction` ', () => {
    const { queryByTestId } = render(<EmptyPlaceholder onAddAction={onAddAction} />);

    expect(onAddAction).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.addAction).click();

    expect(onAddAction).toHaveBeenCalled();
  });
});
