import { render } from '@testing-library/react';
import React from 'react';

import { useGetProfilePicUrl } from '../../hooks/use-get-profile-pic-url';

import { ButtonMenuProfile, dataTestIds } from '.';

jest.mock('../../hooks/use-get-profile-pic-url');

const mockPicUrl = 'https://google.com/test.jpg';

describe('ButtonMenuProfile', () => {
  function createMockUseGetProfilePicUrl(isLoading: boolean, profilePicUrl: string) {
    (useGetProfilePicUrl as jest.Mock).mockReturnValue({
      isLoading,
      profilePicUrl,
    });
  }

  it('does not render button and menu when loading profile', () => {
    createMockUseGetProfilePicUrl(true, undefined);

    const { queryByTestId } = render(<ButtonMenuProfile />);

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders button with profile image', () => {
    createMockUseGetProfilePicUrl(false, mockPicUrl);

    const { queryByTestId } = render(<ButtonMenuProfile />);

    expect(queryByTestId(dataTestIds.img)).toHaveAttribute('src', mockPicUrl);
  });

  it('has a menu with Help and Logout', () => {
    createMockUseGetProfilePicUrl(false, mockPicUrl);

    // mock routing
    const replace = jest.fn();
    const location = window.location;
    delete window.location;
    window.location = { ...location, replace };

    const { getByTestId } = render(<ButtonMenuProfile />);
    expect(getByTestId(dataTestIds.menu)).not.toBeVisible();
    expect(getByTestId(dataTestIds.help)).not.toBeVisible();
    expect(getByTestId(dataTestIds.logout)).not.toBeVisible();

    getByTestId(dataTestIds.root).click();
    expect(getByTestId(dataTestIds.menu)).toBeVisible();
    expect(getByTestId(dataTestIds.help)).toBeVisible();
    expect(getByTestId(dataTestIds.logout)).toBeVisible();

    getByTestId(dataTestIds.help).click();
    expect(replace).toHaveBeenCalledWith('/help');

    getByTestId(dataTestIds.logout).click();
    expect(replace).toHaveBeenCalledWith('/logout');
  });
});
