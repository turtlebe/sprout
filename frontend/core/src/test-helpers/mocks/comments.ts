import { Comment, Commentable, CommentableType, ContextType } from '@plentyag/core/src/types';
import { uuidv4 } from '@plentyag/core/src/utils';

export interface BuildComment {
  commentableId?: string;
  commentableType?: CommentableType;
  contextId?: string;
  contextType?: ContextType;
  username?: string;
  content?: string;
}

export function buildComment({
  commentableId = uuidv4(),
  commentableType = CommentableType.loadedTable,
  contextId = uuidv4(),
  contextType = ContextType.table,
  username = 'olittle',
  content = 'Lorem Ipsum...',
  createdAt = '2023-01-01T00:00:00Z',
  updatedAt = '2023-01-01T00:00:00Z',
}: Partial<Comment & { username: string }>): Comment {
  return {
    id: uuidv4(),
    commentableId,
    commentableType,
    contextId,
    contextType,
    content,
    createdAt,
    updatedAt,
    createdBy: username,
    updatedBy: username,
  };
}

export interface buildCommentable {
  id?: string;
  type?: CommentableType;
  username?: string;
}

export function buildCommentable({
  id = uuidv4(),
  type = CommentableType.loadedTable,
  username = 'olittle',
}: buildCommentable): Commentable {
  return {
    id,
    type,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    createdBy: username,
    updatedBy: username,
  };
}
