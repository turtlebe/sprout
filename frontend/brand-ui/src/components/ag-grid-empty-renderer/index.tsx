import React from 'react';

export const AgGridEmptyRenderer: React.FC = () => {
  // make ag-grid happy, see: https://github.com/ag-grid/ag-grid/issues/3222#issuecomment-548742369
  return <span></span>;
};
