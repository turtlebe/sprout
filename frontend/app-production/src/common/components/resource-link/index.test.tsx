import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsResourceLink as dataTestIds, ResourceLink } from '.';

describe('ResourceLink', () => {
  function renderResourceLink(resourceId: string | undefined, resourceName?: string | JSX.Element) {
    return render(<ResourceLink resourceId={resourceId} resourceName={resourceName} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('renders a resource link', () => {
    const { queryByTestId } = renderResourceLink('123');

    expect(queryByTestId(dataTestIds.link)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.link).getAttribute('href')).toEqual(`${mockBasePath}/resources/info?q=123`);
  });

  it('does not render resource link when no resource id is provided', () => {
    const { queryByTestId } = renderResourceLink(undefined);

    expect(queryByTestId(dataTestIds.link)).not.toBeInTheDocument();
  });

  it('displays link text using optional prop: resourceName', () => {
    const { queryByTestId } = renderResourceLink('123', 'my link');

    expect(queryByTestId(dataTestIds.link).textContent).toEqual('my link');
  });

  it('displays link text in react node using optional prop: resourceName', () => {
    const { queryByTestId } = renderResourceLink('123', <Typography>hello world</Typography>);

    expect(queryByTestId(dataTestIds.link).textContent).toEqual('hello world');
  });
});
