import { ReactorBehaviorTreeNode } from '@plentyag/app-production/src/common/types';
import { RefreshButton, Show } from '@plentyag/brand-ui/src/components';
import { LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useMeasure } from '@plentyag/core/src/hooks';
import React from 'react';
import Tree from 'react-d3-tree';

import { CustomNode } from './components/custom-node';
import { useBuildBehaviorTree } from './hooks/use-build-behavior-tree';
import { useStyles } from './styles';

const dataTestIds = {};

export { dataTestIds as dataTestIdsReactorBehaviorTree };

export interface ReactorBehaviorTree {
  behaviorTree: ReactorBehaviorTreeNode;
  isLoading: boolean;
  reload: () => void;
}

export const ReactorBehaviorTree: React.FC<ReactorBehaviorTree> = ({ behaviorTree, isLoading, reload }) => {
  const classes = useStyles({ isLoading });

  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>();
  React.useEffect(() => {
    if (behaviorTree) {
      setLastRefreshedAt(new Date().toISOString());
    }
  }, [behaviorTree]);

  const containerRef = React.useRef<HTMLDivElement>();
  const containerBoundingRect = useMeasure(containerRef);

  const treeData = useBuildBehaviorTree(behaviorTree);

  const width = containerBoundingRect?.width || 0;
  const height = containerBoundingRect?.height || 0;

  // note: using hack (adding random value to width) so that on refresh
  // it translates back to original position
  const translate = { x: (width + Math.random()) / 5, y: height / 2 };

  return (
    <div ref={containerRef} className={classes.container}>
      <LinearProgress className={classes.linearProgress} />
      <Show when={Boolean(treeData && containerBoundingRect)}>
        <RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={reload} />
        <Tree
          data={treeData}
          renderCustomNodeElement={CustomNode}
          initialDepth={1}
          nodeSize={{ x: 400, y: 300 }}
          translate={translate}
          dimensions={{ width, height }}
        />
      </Show>
      <Show when={Boolean(!treeData && !isLoading)}>
        <Typography>No behavior tree exists</Typography>
      </Show>
    </div>
  );
};
