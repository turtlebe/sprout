import { Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import React from 'react';

export const GlobalSnackbarContext = React.createContext<Snackbar>({});

export const useGlobalSnackbar = () => React.useContext(GlobalSnackbarContext);

export const GlobalSnackbar: React.FC = ({ children }) => {
  const snackbarProps = useSnackbar();

  return (
    <GlobalSnackbarContext.Provider value={snackbarProps}>
      {children}
      <Snackbar {...snackbarProps} />
    </GlobalSnackbarContext.Provider>
  );
};
