import { ReactorBehaviorTreeNode } from '@plentyag/app-production/src/common/types';
import React from 'react';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

function recursivelyBuildTree(behaviorTreeNode: ReactorBehaviorTreeNode) {
  const datum: RawNodeDatum = {
    name: behaviorTreeNode.name,
    attributes: {},
    children: [],
  };

  const status = behaviorTreeNode.status?.status;
  if (status) {
    datum.attributes['status'] = status;
  }

  const description = behaviorTreeNode?.description || behaviorTreeNode.status?.description;
  if (description) {
    datum.attributes['description'] = description;
  }

  behaviorTreeNode.childNodes.forEach(node => datum.children.push(recursivelyBuildTree(node)));

  return datum;
}

/**
 * This hook transforms reactor behavior tree nodes into format needed for react-d3-tree
 */
export const useBuildBehaviorTree = (behaviorTree: ReactorBehaviorTreeNode): RawNodeDatum => {
  const treeData = React.useMemo(() => {
    if (behaviorTree) {
      return recursivelyBuildTree(behaviorTree);
    }
  }, [behaviorTree]);

  return treeData;
};
