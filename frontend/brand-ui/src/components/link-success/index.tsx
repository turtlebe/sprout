import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { useStyles } from './styles';

export const LinkSuccess: React.FC<LinkProps> = ({ children, ...otherProps }) => {
  const classes = useStyles({});
  return (
    <Link className={classes.link} {...otherProps}>
      {children}
    </Link>
  );
};
