import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { CentralProcessingLinksCard, dataTestIdsCentralProcessingLinksCard as dataTestIds, links } from '.';

describe('CentralProcessingLinksCard', () => {
  it('renders the links', () => {
    const { queryByTestId } = render(<CentralProcessingLinksCard />, {
      wrapper: AppProductionTestWrapper,
    });

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();

    // renders all the links with proper name and href
    Object.keys(links).forEach(linkName => {
      expect(queryByTestId(dataTestIds.link(linkName))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.link(linkName)).getAttribute('href')).toEqual(
        `${mockBasePath}${links[linkName]}`
      );
      expect(queryByTestId(dataTestIds.link(linkName))).toHaveTextContent(linkName);
    });
  });
});
