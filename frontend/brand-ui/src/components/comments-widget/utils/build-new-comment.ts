import { CommentableType, ContextType } from '@plentyag/core/src/types';

export interface BuildNewComment {
  commentableId: string;
  commentableType: CommentableType;
  contextId: string;
  contextType: ContextType;
  username: string;
}
export function buildNewComment({ commentableId, commentableType, contextId, contextType, username }: BuildNewComment) {
  return {
    id: '',
    commentableId,
    commentableType,
    contextId,
    contextType,
    content: '',
    createdBy: username,
    updatedBy: username,
    createdAt: '',
    updatedAt: '',
  };
}
