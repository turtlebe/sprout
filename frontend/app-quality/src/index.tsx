import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { UnsupportedFarm } from './common/components/unsupported-farm';
import { EupQuality } from './eup-quality-pages';

export const Quality: React.FC = () => {
  document.title = 'FarmOS - Quality';

  return (
    <Switch>
      <Route path={'/quality/sites/LAX1/farms/LAX1'} component={EupQuality} />

      <Route component={UnsupportedFarm} />
    </Switch>
  );
};
