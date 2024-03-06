import { IframePure } from '@plentyag/brand-ui/src/components/iframe';
import { MockIframeLoaded, MockIframeLoading } from '@plentyag/brand-ui/src/components/iframe/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { DataDocsPage, dataTestIds } from '.';

jest.mock('@plentyag/brand-ui/src/components/iframe');

const MockIframe = IframePure as jest.Mock;

describe('DataDocsHome', () => {
  it('renders an iframe and a loader', () => {
    MockIframe.mockImplementation(MockIframeLoading);

    const { getByTestId } = render(<DataDocsPage />, { wrapper: props => <MemoryRouter {...props} /> });

    expect(getByTestId(dataTestIds.loader)).toHaveStyle('visibility: visible;');
    expect(getByTestId(dataTestIds.iframe)).toBeInTheDocument();
  });

  it('stops loading once the iframe has loaded', () => {
    MockIframe.mockImplementation(MockIframeLoaded);

    const { getByTestId } = render(<DataDocsPage />, { wrapper: props => <MemoryRouter {...props} /> });

    expect(getByTestId(dataTestIds.loader)).toHaveStyle('visibility: hidden;');
    expect(getByTestId(dataTestIds.iframe)).toBeInTheDocument();
  });
});
