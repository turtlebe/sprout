import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { mockFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag/test-helpers/mock-use-feature-flag';
import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import { flatMap } from 'lodash';

import { mockWorkcenters, mockWorkspaces } from '../test-helpers';

import { useGetWorkcenters } from './use-get-workcenters';
import { useGetWorkspaces } from './use-get-workspaces';
import { CULTIVATION_INTERFACE_FEATURE_KEY, useSideNavTree } from './use-side-nav-tree';

jest.mock('./use-get-workspaces');
const mockuseGetWorkspaces = useGetWorkspaces as jest.Mock;
mockuseGetWorkspaces.mockReturnValue({ workspaces: mockWorkspaces, isLoading: false });

jest.mock('./use-get-workcenters');
const mockuseGetWorkcenters = useGetWorkcenters as jest.Mock;
mockuseGetWorkcenters.mockReturnValue({ workcenters: mockWorkcenters, isLoading: false });

mockCurrentUser();

describe('useSideNavTree', () => {
  function renderSideNavTree(permission: string) {
    mockCurrentUser({ username: 'gdebeaupuis', permissions: { HYP_PRODUCTION: permission } });

    const { result } = renderHook<{}, SideNavTreeNode>(() => useSideNavTree(), {
      wrapper: AppProductionTestWrapper,
    });

    const allPaths = flatMap(result.current.children, node => (node.isLeaf() ? node : node.children))
      .filter(node => node.href)
      .map(node => node.href);

    return { allPaths, result };
  }

  it('removes Actions modules without Admin privileges', () => {
    const { allPaths } = renderSideNavTree('READ_AND_LIST');

    expect(allPaths).not.toContain(`${mockBasePath}/actions`);
  });

  it('enables Actions modules with Admin privileges', () => {
    const { allPaths } = renderSideNavTree('EDIT');

    expect(allPaths).toContain(`${mockBasePath}/actions`);
  });

  it('shows workspaces paths', () => {
    const { allPaths } = renderSideNavTree('READ_AND_LIST');

    expect(allPaths).toContain(`${mockBasePath}/workspaces/${mockWorkspaces[0].role}`);
    expect(allPaths).toContain(`${mockBasePath}/workspaces/${mockWorkspaces[1].role}`);
  });

  it('shows workspaces as loading', () => {
    mockuseGetWorkspaces.mockReturnValue({ workspaces: undefined, isLoading: true });

    const { allPaths, result } = renderSideNavTree('READ_AND_LIST');

    // does not show workspace roles - since haven't loaded yet.
    expect(allPaths).not.toContain(`${mockBasePath}/workspaces/${mockWorkspaces[0].role}`);
    expect(allPaths).not.toContain(`${mockBasePath}/workspaces/${mockWorkspaces[1].role}`);

    const toplevelNodes = result.current.children;
    expect(toplevelNodes).toHaveLength(7);

    // workspace item exists and has isLoading: true
    const workspaceNode = toplevelNodes.find(item => item.name === 'Workspaces');
    expect(workspaceNode.isLoading).toBe(true);
  });

  it('show workcenters paths', () => {
    const { allPaths } = renderSideNavTree('READ_AND_LIST');

    expect(allPaths).toContain(`${mockBasePath}/workcenters/${mockWorkcenters[0].name}`);
    expect(allPaths).toContain(`${mockBasePath}/workcenters/${mockWorkcenters[1].name}`);
  });

  it('show workcenters as loading', () => {
    mockuseGetWorkcenters.mockReturnValue({ workcenters: undefined, isLoading: true });

    const { allPaths, result } = renderSideNavTree('READ_AND_LIST');

    // does not show workcenter names - since haven't loaded yet.
    expect(allPaths).not.toContain(`${mockBasePath}/workcenters/${mockWorkcenters[0].name}`);
    expect(allPaths).not.toContain(`${mockBasePath}/workcenters/${mockWorkcenters[1].name}`);

    const toplevelNodes = result.current.children;
    expect(toplevelNodes).toHaveLength(7);

    // workcenter item exists and has isLoading: true
    const workcenterNode = toplevelNodes.find(item => item.name === 'Workcenters');
    expect(workcenterNode.isLoading).toBe(true);
  });

  describe('Orchestration Links', () => {
    it('should show orchestration links', () => {
      // ACT
      const { allPaths, result } = renderSideNavTree('READ_AND_LIST');
      const toplevelNodes = result.current.children;

      // ASSERT
      // -- Parent node
      expect(toplevelNodes.find(item => item.name === 'Orchestration')).toBeDefined();
      // -- CP Settings/Dashboard and cultivation dashboard
      expect(allPaths).toContain(`${mockBasePath}/central-processing/settings`);
      expect(allPaths).toContain(`${mockBasePath}/central-processing/dashboard`);
      expect(allPaths).not.toContain(`${mockBasePath}/cultivation/dashboard`);
    });

    it('should show cultivation dashboard link if feature flag is set', () => {
      // ARRANGE
      mockFeatureFlag(CULTIVATION_INTERFACE_FEATURE_KEY, true);

      // ACT
      const { allPaths, result } = renderSideNavTree('READ_AND_LIST');
      const toplevelNodes = result.current.children;

      // ASSERT
      // -- Parent node
      expect(toplevelNodes.find(item => item.name === 'Orchestration')).toBeDefined();
      // -- CP Settings/Dashboard and cultivation dashboard
      expect(allPaths).toContain(`${mockBasePath}/cultivation/dashboard`);
    });
  });
});
