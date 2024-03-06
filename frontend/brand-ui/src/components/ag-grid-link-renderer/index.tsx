import { useTheme } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

import { AgGridEmptyRenderer } from '../ag-grid-empty-renderer';

interface AgGridLinkRenderer {
  to: string;
}

export const AgGridLinkRenderer: React.FC<AgGridLinkRenderer> = ({ to, children }) => {
  const theme = useTheme();

  if (!to) {
    return <AgGridEmptyRenderer />;
  }

  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.primary.main,
      }}
    >
      {children}
    </Link>
  );
};
