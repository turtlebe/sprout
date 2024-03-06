import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { useStyles } from './styles';

export const UnstyledLink: React.FC<LinkProps> = ({ children, ...props }) => {
  const classes = useStyles({});

  return (
    <Link className={classes.link} {...props}>
      {children}
    </Link>
  );
};
