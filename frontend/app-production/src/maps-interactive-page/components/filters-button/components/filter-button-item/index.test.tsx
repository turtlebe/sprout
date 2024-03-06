import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsFilterButtonItem as dataTestIds, FilterButtonItem } from '.';

describe('FilterButtonItem', () => {
  it('renders title, icon and children', () => {
    const mockTitle = 'some title';
    const mockIconDataTestId = 'icon-data-testid';
    const mockIcon = <div data-testid={mockIconDataTestId}>some icon</div>;
    const mockContentDataTestId = 'mock-content-data-testid';
    const mockContent = <div data-testid={mockContentDataTestId}>some content</div>;

    const { queryByTestId } = render(
      <FilterButtonItem title={mockTitle} icon={mockIcon}>
        {mockContent}
      </FilterButtonItem>
    );

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(mockTitle);
    expect(queryByTestId(mockIconDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockContentDataTestId)).toBeInTheDocument();
  });
});
