import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AppBar } from '../components/app-bar';

export default {
  title: 'AppBar',
  component: AppBar,
};

export const AppBarWithoutModules = () => <AppBar farmOsModules={[]} />;

export const AppBarWithModules = () => {
  return (
    <Router>
      <AppBar
        farmOsModules={['HYP_ADMIN', 'HYP_CONTROLS', 'HYP_DEVICES']}
        hostCurrentLocation="/admin"
        reactAppHostName="hypocotyl"
      />{' '}
    </Router>
  );
};
