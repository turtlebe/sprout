import { GlobalSnackbar, useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import React from 'react';

jest.mock('@plentyag/brand-ui/src/components/global-snackbar');
jest.mock('@plentyag/brand-ui/src/components/snackbar');

export const closeSnackbar = jest.fn();
export const updateSnackbar = jest.fn();
export const successSnackbar = jest.fn();
export const errorSnackbar = jest.fn();
export const warningSnackbar = jest.fn();

export function mockGlobalSnackbar() {
  (GlobalSnackbar as jest.Mock).mockImplementation(props => <>{props.children}</>);
  (Snackbar as jest.Mock).mockImplementation(() => null);
  const implementation = () => ({
    closeSnackbar,
    updateSnackbar,
    successSnackbar,
    errorSnackbar,
    warningSnackbar,
  });
  (useGlobalSnackbar as jest.Mock).mockImplementation(implementation);
  (useSnackbar as jest.Mock).mockImplementation(implementation);
}
