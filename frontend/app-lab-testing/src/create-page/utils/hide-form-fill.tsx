import React from 'react';

// hack to remove chrome form fill adorner, see: SD-5304
export const HideFormFill: React.FC = () => {
  return (
    <>
      <input
        type="text"
        style={{ width: '0', height: '0', background: 'transparent', color: 'transparent', border: 'none' }}
        data-description="dummyUsername"
      ></input>
      <input
        type="password"
        style={{ width: '0', height: '0', background: 'transparent', color: 'transparent', border: 'none' }}
        data-description="dummyPassword"
      ></input>
    </>
  );
};
