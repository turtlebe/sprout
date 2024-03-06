import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { SideNavTreeNode } from './index';

const MockComponent: React.FC = () => <span></span>;

describe('TreeNode', () => {
  it('declares a root node', () => {
    const root = new SideNavTreeNode({ name: 'Quality' });

    expect(root.parent).toBeUndefined();
    expect(root.id).toBeDefined();
    expect(root.children).toHaveLength(0);
    expect(root.name).toBe('Quality');
    expect(root.isRoot()).toBe(true);
    expect(root.isLeaf()).toBe(true);
  });

  it('adds a children to the root node', () => {
    const root = new SideNavTreeNode({ name: 'Quality' });
    const child = root.addNode({
      name: 'FGQA',
    });

    expect(root.children).toHaveLength(1);
    expect(root.children).toEqual([child]);
    expect(root.isLeaf()).toBe(false);
    expect(child.parent).toEqual(root);
    expect(child.id).toBeDefined();
    expect(child.children).toHaveLength(0);
    expect(child.name).toBe('FGQA');
    expect(child.isRoot()).toBe(false);
    expect(child.isLeaf()).toBe(true);
  });

  it('adds a leaf with a route description', () => {
    const root = new SideNavTreeNode({ name: 'Quality' });
    const child = root.addNode({ name: 'FGQA' });
    const leaf = child.addNode({
      name: 'Form',
      href: '/fgqa',
      route: { path: '/fgqa', component: MockComponent },
    });

    expect(leaf.parent).toEqual(child);
    expect(leaf.id).toBeDefined();
    expect(leaf.href).toBe('/fgqa');
    expect(leaf.route.path).toBe('/fgqa');
    expect(leaf.route.component).toEqual(MockComponent);
  });

  it('returns an array of TreeNode for a given ReactRouter Route match', () => {
    const root = new SideNavTreeNode({ name: 'Quality' });

    const fgqa = root.addNode({ name: 'FGQA' });
    const fgqaForm = fgqa.addNode({
      name: 'Form',
      href: '/fgqa',
      route: { path: '/fgqa', component: MockComponent },
    });
    const fgqaFormDetails = fgqa.addNode({
      name: 'Form',
      href: '/fgqa/details',
      route: { path: '/fgqa/details/:id', component: MockComponent },
    });

    const seedling = root.addNode({ name: 'SeedlingQA' });
    const seedlingForm = seedling.addNode({
      name: 'Form',
      href: '/seedling',
      route: { path: '/seedling/:id', component: MockComponent },
    });

    const fgqaFormMatch: RouteComponentProps['match'] = {
      url: '/fgqa',
      path: '/fgqa',
      params: {},
      isExact: true,
    };
    expect(root.getTreePath(fgqaFormMatch)).toEqual([root, fgqa, fgqaForm]);

    const seedlingFormMatch: RouteComponentProps['match'] = {
      url: '/seedling/1234',
      path: '/seedling/:id',
      params: { id: '1234' },
      isExact: true,
    };
    expect(root.getTreePath(seedlingFormMatch)).toEqual([root, seedling, seedlingForm]);

    // should match path given by: seedlingForm since url here is a subpath.
    const seedlingFormSubMatch: RouteComponentProps['match'] = {
      url: '/seedling/123/4567',
      path: '/seedling/:id/:subid',
      params: { id: '123', subid: '4567' },
      isExact: true,
    };
    expect(root.getTreePath(seedlingFormSubMatch)).toEqual([root, seedling, seedlingForm]);

    // should match '/fqqa/details' path - not '/fgqa' since the former is deepest match.
    const fgqaFormDetailsMatch: RouteComponentProps['match'] = {
      url: '/fgqa/details/789',
      path: '/fgqa/details/:id',
      params: { id: '789' },
      isExact: true,
    };
    expect(root.getTreePath(fgqaFormDetailsMatch)).toEqual([root, fgqa, fgqaFormDetails]);

    const noMatch: RouteComponentProps['match'] = {
      url: '/404',
      path: '/404',
      params: {},
      isExact: true,
    };
    expect(root.getTreePath(noMatch)).toEqual([root]);
  });
});
