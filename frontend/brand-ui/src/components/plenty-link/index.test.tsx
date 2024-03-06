import { isIgnition } from '@plentyag/core/src/utils/is-ignition';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsPlentyLink as dataTestIds, PlentyLink } from '.';

jest.mock('@plentyag/core/src/utils/is-ignition');
const mockisIgnition = isIgnition as jest.Mock;

const mockUrl = 'https://www.google.com';

describe('PlentyLink', () => {
  beforeEach(() => {
    mockisIgnition.mockReturnValue(false);
  });

  // eslint-disable-next-line max-params
  function renderLink(to: string, isReactRouteLink: boolean, openInNewTab: boolean, download?: string) {
    return render(
      <PlentyLink to={to} isReactRouterLink={isReactRouteLink} openInNewTab={openInNewTab} download={download} />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  it('opens in current tab for ignition', () => {
    mockisIgnition.mockReturnValue(true);
    const { queryByTestId } = renderLink(mockUrl, false, true);

    expect(queryByTestId(dataTestIds.newTabIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toHaveAttribute('target');
  });

  it('supports opening in new a tab', () => {
    const { queryByTestId } = renderLink(mockUrl, false, true);

    expect(queryByTestId(dataTestIds.newTabIcon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveAttribute('target', '_blank');
  });

  it('supports url like: https://www.google.com', () => {
    const { queryByTestId } = renderLink(mockUrl, false, false);

    expect(queryByTestId(dataTestIds.root)).toHaveAttribute('href', mockUrl);
  });

  it('supports react-route path', () => {
    const mockReactRouterPath = '/production';
    const { queryByTestId } = renderLink(mockReactRouterPath, true, false);

    expect(queryByTestId(dataTestIds.root)).toHaveAttribute('href', mockReactRouterPath);
  });

  it('supports downloading', () => {
    const downloadFilename = 'filename.pdf';
    const { queryByTestId } = renderLink(mockUrl, false, false, downloadFilename);

    expect(queryByTestId(dataTestIds.root)).toHaveAttribute('download', downloadFilename);
  });
});
