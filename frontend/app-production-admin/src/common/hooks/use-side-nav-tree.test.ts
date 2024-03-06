import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import { flatMap } from 'lodash';

import { useSideNavTree } from './use-side-nav-tree';

mockCurrentUser();

describe('useSideNavTree', () => {
  function renderSideNavTree(basePath: string) {
    const { result } = renderHook<{}, SideNavTreeNode>(() => useSideNavTree(basePath));
    const allPaths = flatMap(result.current.children, node => (node.isLeaf() ? node : node.children))
      .filter(node => node.href)
      .map(node => node.href);

    return { allPaths, result };
  }

  it('renders import-plans when site/farm is LAX1', () => {
    const basePath = '/production-admin/sites/LAX1/farms/LAX1';
    const { allPaths } = renderSideNavTree(basePath);

    expect(allPaths).toContain(`${basePath}/import-plans`);
  });

  it('does not show import-plans when site/farm is not LAX1', () => {
    const basePath = '/production-admin/sites/SSF2/farms/Tigris';
    const { allPaths } = renderSideNavTree(basePath);

    expect(allPaths).not.toContain(`${basePath}/import-plans`);
  });
});
