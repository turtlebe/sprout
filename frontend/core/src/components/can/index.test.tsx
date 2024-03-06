import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { dataTestIdsSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { render } from '@testing-library/react';
import React from 'react';

import { Can, DEFAULT_FALLBACK_ERROR_MESSAGE } from '.';

mockCurrentUser();

const dataTestIds = {
  mockComponent: 'mock-component',
  fallbackComponent: 'fallback-component',
};
const MockComponent: React.FC = () => <div data-testid={dataTestIds.mockComponent}>MockComponent</div>;
const FallbackComponent: React.FC = () => <div data-testid={dataTestIds.fallbackComponent}>FallbackComponent</div>;

describe('Can', () => {
  it('renders an empty fragment when the permissions are not sufficient', () => {
    const { queryByTestId } = render(
      <Can resource={Resources.HYP_SENSORY} level={PermissionLevels.FULL}>
        <MockComponent />
      </Can>,
      { wrapper: GlobalSnackbar }
    );

    expect(queryByTestId(dataTestIds.mockComponent)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.fallbackComponent)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent(DEFAULT_FALLBACK_ERROR_MESSAGE);
  });

  it('renders the fallback component when the permissions are not sufficient', () => {
    const { queryByTestId } = render(
      <Can resource={Resources.HYP_SENSORY} level={PermissionLevels.FULL} fallback={<FallbackComponent />}>
        <MockComponent />
      </Can>,
      { wrapper: GlobalSnackbar }
    );

    expect(queryByTestId(dataTestIds.mockComponent)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.fallbackComponent)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent(DEFAULT_FALLBACK_ERROR_MESSAGE);
  });

  it('renders the fallback and does not trigger the snackbar', () => {
    const { queryByTestId } = render(
      <Can
        resource={Resources.HYP_SENSORY}
        level={PermissionLevels.FULL}
        fallback={<FallbackComponent />}
        disableSnackbar={true}
      >
        <MockComponent />
      </Can>,
      { wrapper: GlobalSnackbar }
    );

    expect(queryByTestId(dataTestIds.mockComponent)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.fallbackComponent)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();
  });

  it('renders the fallback and triggers the snackbar with custom options', () => {
    const { queryByTestId } = render(
      <Can
        resource={Resources.HYP_SENSORY}
        level={PermissionLevels.FULL}
        fallback={<FallbackComponent />}
        snackbarProps={{ message: 'congrats for using the snackbarProps!' }}
      >
        <MockComponent />
      </Can>,
      { wrapper: GlobalSnackbar }
    );

    expect(queryByTestId(dataTestIds.mockComponent)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.fallbackComponent)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent('congrats for using the snackbarProps!');
  });

  it('returns the children component when the permissions are valid', () => {
    const { queryByTestId } = render(
      <Can resource={Resources.HYP_SENSORY} level={PermissionLevels.EDIT}>
        <MockComponent />
      </Can>,
      { wrapper: GlobalSnackbar }
    );

    expect(queryByTestId(dataTestIds.mockComponent)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.fallbackComponent)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();
  });

  it('returns the children component when the permissions are valid', () => {
    const { queryByTestId } = render(
      <Can resource={Resources.HYP_SENSORY} level={PermissionLevels.EDIT}>
        <MockComponent />
      </Can>,
      { wrapper: GlobalSnackbar }
    );

    expect(queryByTestId(dataTestIds.mockComponent)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.fallbackComponent)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();
  });

  it('invokes callback "onPermissionDenied" when permissions check fails', () => {
    const mockOnPermissionDenied = jest.fn();
    render(
      <Can resource={Resources.HYP_SENSORY} level={PermissionLevels.FULL} onPermissionDenied={mockOnPermissionDenied}>
        <MockComponent />
      </Can>,
      { wrapper: GlobalSnackbar }
    );
    expect(mockOnPermissionDenied).toHaveBeenCalled();
  });
});
