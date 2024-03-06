import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../constants';

interface CropLink {
  cropName: string;
}

export const CropLink: React.FC<CropLink> = ({ cropName }) => {
  return <Link to={ROUTES.crop(cropName)}>{cropName}</Link>;
};
