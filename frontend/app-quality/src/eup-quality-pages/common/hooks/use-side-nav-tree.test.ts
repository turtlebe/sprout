import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';
import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import { flatMap } from 'lodash';

import { FEATURE_POSTHARVEST_QA_SETTINGS, useSideNavTree } from './use-side-nav-tree';

jest.mock('@plentyag/brand-ui/src/components/feature-flag');
const mockUseFeatureFlag = useFeatureFlag as jest.Mock;
mockCurrentUser();

describe('useSideNavTree', () => {
  const basePath = 'sites/LAX1/farms/LAX1';

  function renderHookAndGetAllPaths() {
    const { result } = renderHook<{}, SideNavTreeNode>(() => useSideNavTree(basePath));
    const allPaths = flatMap(result.current.children, node => (node.isLeaf() ? node : node.children))
      .filter(node => node.href)
      .map(node => node.href);
    return {
      result,
      allPaths,
    };
  }

  describe('Seedling QA', () => {
    function expectToHaveQualityModules(paths: string[], { edit }) {
      if (edit) {
        expect(paths).toContain(`${basePath}/seedling/form`);
      } else {
        // currently no modules should be enabled with permissions less than EDIT.
        expect(paths).toHaveLength(0);
      }
    }

    it('hides Quality modules without EDIT permissions', () => {
      mockCurrentUser({ permissions: { HYP_QUALITY: 'READ_AND_LIST' } });

      const { allPaths } = renderHookAndGetAllPaths();

      expectToHaveQualityModules(allPaths, { edit: false });
    });

    it('enables Quality modules with EDIT permissions', () => {
      mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });

      const { allPaths } = renderHookAndGetAllPaths();

      expectToHaveQualityModules(allPaths, { edit: true });
    });
  });

  describe('Postharvest QA', () => {
    function mockEnableFeatureFlag(key, value) {
      mockUseFeatureFlag.mockImplementation(flag => {
        if (flag === key) {
          return value;
        }
        return;
      });
    }

    beforeEach(() => {
      mockUseFeatureFlag.mockReturnValue(true);
    });

    it('hides Postharvest page and Settings without EDIT permissions', () => {
      mockEnableFeatureFlag(FEATURE_POSTHARVEST_QA_SETTINGS, true);
      mockCurrentUser({ permissions: { HYP_QUALITY: 'READ_AND_LIST' } });

      const { allPaths } = renderHookAndGetAllPaths();

      expect(allPaths).not.toContain(`${basePath}/postharvest`);
      expect(allPaths).not.toContain(`${basePath}/postharvest/settings`);
    });

    it('hides Postharvest page and Settings without EDIT permissions', () => {
      mockEnableFeatureFlag(FEATURE_POSTHARVEST_QA_SETTINGS, true);
      mockCurrentUser({ permissions: { HYP_QUALITY: 'READ_AND_LIST' } });

      const { allPaths } = renderHookAndGetAllPaths();

      expect(allPaths).not.toContain(`${basePath}/postharvest`);
      expect(allPaths).not.toContain(`${basePath}/postharvest/settings`);
    });

    it('hides Postharvest Settings without feature flag', () => {
      mockEnableFeatureFlag(FEATURE_POSTHARVEST_QA_SETTINGS, false);
      mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });

      const { allPaths } = renderHookAndGetAllPaths();

      expect(allPaths).toContain(`${basePath}/postharvest`);
      expect(allPaths).not.toContain(`${basePath}/postharvest/settings`);
    });
  });
});
