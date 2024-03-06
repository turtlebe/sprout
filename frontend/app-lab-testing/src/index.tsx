import { lazyWithRetry } from '@plentyag/core/src/utils/lazy-with-retry';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { ResultsPage } from './results-page';

const CreatePage = lazyWithRetry(async () =>
  import(/* webpackChunkName: "lab-testing-create" */ './create-page').then(module => ({ default: module.CreatePage }))
);

export const LabTesting: React.FC = () => {
  const { path } = useRouteMatch();
  document.title = 'Lab Testing App';
  return (
    <Switch>
      <Route extact path={`${path}/create`} component={CreatePage} />
      <Route extact path={path} component={ResultsPage} />
    </Switch>
  );
};
