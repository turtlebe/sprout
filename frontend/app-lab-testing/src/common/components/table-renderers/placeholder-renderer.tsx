import React from 'react';

// For ag-grid cell render, when loading data from backend (since it takes time), the
// render will get passed 'undefined/null' data. Renderer will complain that data isn't
// rendered on time if only return null value, so return empty span,
// for details see: https://github.com/ag-grid/ag-grid/issues/3222
export const Placeholder = () => {
  return <span></span>;
};
