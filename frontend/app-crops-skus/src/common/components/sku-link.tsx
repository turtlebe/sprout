import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../constants';

interface SkuLink {
  skuName: string;
}

export const SkuLink: React.FC<SkuLink> = ({ skuName }) => {
  return <Link to={ROUTES.sku(skuName)}>{skuName}</Link>;
};
