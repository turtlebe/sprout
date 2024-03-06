import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsStackedBoxes as dataTestIds, StackedAndBoxedTitles } from './stacked-and-boxed-titles';

describe('StackedAndBoxedTitles', () => {
  it('renders a set of titles', () => {
    const titles = ['title1', 'title2'];
    const { queryByTestId } = render(<StackedAndBoxedTitles titles={titles} />);

    const titleRoot = queryByTestId(dataTestIds.root);
    expect(titleRoot.children).toHaveLength(2);
    expect(titleRoot.children[0]).toHaveTextContent('title1');
    expect(titleRoot.children[1]).toHaveTextContent('title2');
  });
});
