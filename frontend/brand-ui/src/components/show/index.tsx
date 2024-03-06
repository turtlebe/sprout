import React from 'react';

export interface Show {
  when: boolean;
  fallback?: JSX.Element;
}

/**
 * This component helps with code readability to replace ternary operations
 * in JSX code. The idea was taken from: https://www.solidjs.com/docs/latest/api#%3Cshow%3E
 */
export const Show: React.FC<Show> = ({ children, when, fallback }) => {
  return when ? <>{children}</> : fallback ? <>{fallback}</> : null;
};
