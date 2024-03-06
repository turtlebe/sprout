import { TreeItem as MuiTreeItem, TreeItemProps } from '@material-ui/lab';
import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DEFAULT_COLLASPED_DRAWER_WIDTH } from '../collapsable-drawer';

export const useStyles = makeStyles(theme => ({
  navLink: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'block',
    padding: '0.5rem',
    overflow: 'hidden',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflowWrap: 'anywhere',
  },
  /**
   * TreeItem overrides
   */
  treeItemRoot: {
    whiteSpace: 'nowrap',
    '&$treeItemSelected > $treeItemContent > $treeItemLabel': {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
    '&$treeItemSelected > $treeItemContent > $treeItemLabel:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  treeItemSelected: {},
  treeItemExpanded: {},
  treeItemGroup: {
    marginLeft: '15px',
    marginBottom: '0.5rem',
  },
  treeItemContent: {},
  treeItemIconContainer: {
    width: '0', // disable iconContainer by default
  },
  treeItemLabel: {
    color: theme.palette.text.secondary,
  },
  /**
   * TreeView overrides
   */
  treeViewRoot: {
    overflowY: 'auto',
    flexGrow: 1,
    padding: '1rem',
    paddingRight: DEFAULT_COLLASPED_DRAWER_WIDTH,
    '& > $treeItemRoot > $treeItemContent': {
      paddingTop: '0.5rem',
    },
    '& > $treeItemRoot > $treeItemContent > $treeItemIconContainer': {
      width: '15px', // enable iconContainer only on first level
    },
    '& > $treeItemRoot > $treeItemContent > $treeItemLabel': {
      textTransform: 'uppercase',
      color: theme.palette.text.primary,
    },
    '& > $treeItemRoot > $treeItemContent > $treeItemLabel > $navLink': {
      padding: 0,
    },
  },
}));

export const TreeItem: React.FC<TreeItemProps> = props => {
  const classes = useStyles({});

  return (
    <MuiTreeItem
      {...props}
      classes={{
        root: classes.treeItemRoot,
        label: classes.treeItemLabel,
        content: classes.treeItemContent,
        selected: classes.treeItemSelected,
        expanded: classes.treeItemExpanded,
        group: classes.treeItemGroup,
        iconContainer: classes.treeItemIconContainer,
      }}
    />
  );
};
