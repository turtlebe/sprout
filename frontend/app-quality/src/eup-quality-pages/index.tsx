import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { QualityAppRouter } from '../common/components/quality-app-router';

import { useSideNavTree } from './common/hooks/use-side-nav-tree';
import { routes as qualityRoutes } from './routes';

export const EupQuality: React.FC = () => {
  const { url: basePath } = useRouteMatch();
  const treeRoot = useSideNavTree(basePath);
  const routes = qualityRoutes(basePath);

  return <QualityAppRouter treeRoot={treeRoot} routes={routes} />;
};
