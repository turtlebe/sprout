import { GlobalStyles } from '@plentyag/brand-ui/src/theme/index';
import React from 'react';
import { render } from 'react-dom';

import { App } from './app';
import './index.css';
import { inDevelopment } from './utils/config';

const Root: React.FC = () => (
  <GlobalStyles>
    <App />
  </GlobalStyles>
);

const renderApp = () => render(<Root />, document.getElementById('root'));
renderApp();

if (inDevelopment() && module.hot) {
  module.hot.accept('./app', renderApp);
}
