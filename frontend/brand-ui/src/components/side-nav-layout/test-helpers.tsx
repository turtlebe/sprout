import React from 'react';

import { SideNavLayout } from '.';

import { SideNavTreeNode } from './side-nav-tree-node';

export const routes: SideNavLayout['routes'] = {
  Page1: {
    path: '/page1',
    component: () => <div data-testid="page1">mock-page-1</div>,
  },
  Page2: {
    path: '/page2',
    component: () => <div data-testid="page2">mock-page-2</div>,
  },
};
export const treeRoot = new SideNavTreeNode({ name: 'Root' });

const group1 = treeRoot.addNode({ name: 'Group1' });
group1.addNode({
  name: 'InternalLink1',
  href: routes.Page1.path.toString(),
  route: routes.Page1,
});
group1.addNode({
  name: 'InternalLink2',
  href: routes.Page2.path.toString(),
  route: routes.Page2,
});
const group2 = treeRoot.addNode({ name: 'Group2' });
group2.addNode({
  name: 'ExternalLink',
  href: 'https://plenty.ag',
  redirect: true,
});
treeRoot.addNode({ name: 'Group3', isLoading: true });

export const match = {
  url: '/quality',
  path: '/quality',
  isExact: true,
  params: {},
};

export const location = {
  search: '',
  hash: '',
  pathname: '/',
  state: undefined,
};
