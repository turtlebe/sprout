import React from 'react';

export interface Iframe extends React.HTMLAttributes<HTMLElement> {
  src: string;
  onLoad: () => void;
}

/**
 * Simple wrapper around an <iframe/>. Useful to mock the component during tests.
 */
export const IframePure: React.FC<Iframe> = ({ src, onLoad, ...props }, ref) => {
  return <iframe ref={ref} src={src} onLoad={onLoad} {...props}></iframe>;
};

export const Iframe = React.forwardRef<HTMLIFrameElement, Iframe>(IframePure);
