import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import {
  mockBadResult,
  mockResult,
  mockResultContainerOnly,
  mockResultMaterialOnly,
} from '../search/mock-search-result';

import { dataTestIds, ResourceLinkWithType } from '.';

describe('ResourceLink', () => {
  function renderResourceLinkWithType(mockData: ProdResources.ResourceState) {
    const { queryByTestId } = render(<ResourceLinkWithType resource={mockData} />, {
      wrapper: AppProductionTestWrapper,
    });
    return queryByTestId(dataTestIds.navLink);
  }
  it('renders container type if resource has both container and material', () => {
    const navLink = renderResourceLinkWithType(mockResult);
    expect(navLink).toHaveTextContent(`${mockResult.containerObj.containerType}`);
  });

  it('renders material type if resource has only material', () => {
    const navLink = renderResourceLinkWithType(mockResultMaterialOnly);
    expect(navLink).toHaveTextContent(`${mockResult.materialObj.materialType}`);
  });

  it('render container type if resource has only container', () => {
    const navLink = renderResourceLinkWithType(mockResultContainerOnly);
    expect(navLink).toHaveTextContent(`${mockResultContainerOnly.containerObj.containerType}`);
  });

  it('renders nothing if resouces has neither container nor material', () => {
    const navLink = renderResourceLinkWithType(mockBadResult);
    expect(navLink).toBe(null);
  });
});
