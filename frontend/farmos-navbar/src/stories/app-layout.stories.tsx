import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AppBody, AppContainer, AppHeader } from '../components/app-layout';

export default {
  title: 'AppLayout',
};

export const AppLayoutWithModules = () => {
  return (
    <Router>
      <AppContainer>
        <AppHeader
          farmOsModules={['HYP_ADMIN', 'HYP_CONTROLS', 'HYP_DEVICES']}
          hostCurrentLocation="/admin"
          reactAppHostName="hypocotyl"
        />
        <AppBody>
          <p>This is the body of the page</p>
        </AppBody>
      </AppContainer>
    </Router>
  );
};
