import { CommentableType, ContextType } from '@plentyag/core/src/types';

import { isCommentable } from './is-commentable';

export function getMaterialCommentableId(resouceState: ProdResources.ResourceState): string {
  return resouceState?.materialObj?.id;
}

export function getMaterialCommentableType(resouceState: ProdResources.ResourceState): CommentableType {
  if (!isCommentable(resouceState)) {
    return undefined;
  }

  switch (resouceState?.materialObj?.materialType) {
    case CommentableType.loadedTable:
      return CommentableType.loadedTable;
    case CommentableType.loadedTower:
      return CommentableType.loadedTower;
    default:
      return undefined;
  }
}

export function getMaterialContextId(resouceState: ProdResources.ResourceState): string {
  return resouceState?.containerObj?.id;
}

export function getMaterialContextType(resouceState: ProdResources.ResourceState): ContextType {
  if (!isCommentable(resouceState)) {
    return undefined;
  }

  switch (resouceState?.materialObj?.materialType) {
    case CommentableType.loadedTable:
      return ContextType.table;
    case CommentableType.loadedTower:
      return ContextType.tower;
    default:
      return undefined;
  }
}
