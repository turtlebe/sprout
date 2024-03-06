import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { TreeView as MuiTreeView } from '@material-ui/lab';
import { Box, CircularProgress, Link } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { SideNavTreeNode } from '../side-nav-tree-node';

import { TreeItem, useStyles } from './styles';

const dataTestIds = {
  loading: 'loading-tree-view',
};

export { dataTestIds as treeViewDataTestIds };
export interface TreeView {
  treeRoot: SideNavTreeNode;
  treePaths: SideNavTreeNode[];
}

export const TreeView: React.FC<TreeView> = ({ treeRoot, treePaths }) => {
  const classes = useStyles({});
  // 2nd level is always expended
  const [defaultExpanded] = React.useState<string[]>(treeRoot.children.map(node => node.id));

  function renderTreeNode(treeNode: SideNavTreeNode): JSX.Element {
    const commonProps = {
      key: treeNode.id,
      nodeId: treeNode.id,
      'data-testid': treeNode.id,
    };

    if (treeNode.isLeaf() && treeNode.href) {
      return (
        <TreeItem
          label={
            treeNode.redirect ? (
              <Link className={classes.navLink} underline="none" href={treeNode.href}>
                {treeNode.name}
              </Link>
            ) : (
              <NavLink className={classes.navLink} to={treeNode.href}>
                {treeNode.name}
              </NavLink>
            )
          }
          {...commonProps}
        />
      );
    }

    if (treeNode.isRoot()) {
      return <>{treeNode.children.map(renderTreeNode)}</>;
    }

    return (
      <TreeItem
        label={
          <>
            {treeNode.name}
            {treeNode.isLoading && (
              <>
                <Box component="span" padding={0.5} />
                <CircularProgress data-testid={dataTestIds.loading} size="1rem" />
              </>
            )}
          </>
        }
        {...commonProps}
      >
        {treeNode.children?.map(renderTreeNode)}
      </TreeItem>
    );
  }

  return (
    <MuiTreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      defaultExpanded={defaultExpanded}
      selected={treePaths[treePaths.length - 1].id}
      classes={{ root: classes.treeViewRoot }}
    >
      {renderTreeNode(treeRoot)}
    </MuiTreeView>
  );
};
