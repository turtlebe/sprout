import React from 'react';

interface Props {
  title: String;
  subTitle: String;
}

/**
 * Provides a custom header for ag-grid that is split across two lines.
 */
export const CustomHeader: React.FC<Props> = ({ title, subTitle }) => {
  return (
    <>
      <div>{title}</div>
      <div>{subTitle}</div>
    </>
  );
};
